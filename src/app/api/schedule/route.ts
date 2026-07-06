import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const { name, email, date, time, notes } = await request.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Automatically generate a title for the session
    const topicSummary = notes ? ` - ${notes.substring(0, 30)}${notes.length > 30 ? "..." : ""}` : "";
    const eventTitle = `AI & Tech Consultation: ${name}${topicSummary}`;

    // Combine date and time to create start and end dateTimes
    // Expected date format: YYYY-MM-DD or equivalent ISO string from Calendar
    // Expected time format: HH:MM or "09:30 AM" / "02:30 PM"
    
    // Parse time string (handles both "14:30" and "02:30 PM")
    let hours = 0;
    let minutes = 0;
    
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3];
      if (ampm) {
        if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
        if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
      }
    } else {
      // Fallback if browser time input format "HH:MM"
      const [h, m] = time.split(":");
      hours = parseInt(h) || 0;
      minutes = parseInt(m) || 0;
    }

    const eventDate = new Date(date);
    eventDate.setHours(hours, minutes, 0, 0);

    const startDateTime = eventDate.toISOString();
    // Default duration: 30 minutes
    const endDateTime = new Date(eventDate.getTime() + 30 * 60 * 1000).toISOString();

    // Check Google Credentials configuration
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

    console.log("=== SCHEDULE API DIAGNOSTICS ===");
    console.log("Client Email:", clientEmail);
    console.log("Calendar ID:", calendarId);
    console.log("Private Key Length:", privateKey?.length);
    console.log("Private Key Starts With:", privateKey?.substring(0, 50));
    console.log("Private Key Ends With:", privateKey?.substring(privateKey.length - 50));
    console.log("Private Key has literal \\n:", privateKey?.includes("\\n"));
    console.log("Private Key has real newlines:", privateKey?.includes("\n"));
    console.log("===============================");

    let auth;
    let isOAuth2 = false;

    if (clientId && clientSecret && refreshToken) {
      // Use OAuth2 Refresh Token Auth
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });
      auth = oauth2Client;
      isOAuth2 = true;
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Use Google Application Credentials (from JSON file path)
      auth = new google.auth.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });
    } else if (clientEmail && privateKey) {
      // Use Service Account Auth
      auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });
    }

    if (!auth) {
      console.warn("No Google API credentials found. Falling back to Mock Schedule API.");
      
      // Generate a mock Google Meet Link for testing / presentation
      const randomMeetingCode = Math.random().toString(36).substring(2, 5) + "-" + 
                               Math.random().toString(36).substring(2, 6) + "-" + 
                               Math.random().toString(36).substring(2, 5);
      const mockMeetLink = `https://meet.google.com/${randomMeetingCode.toLowerCase()}`;

      return NextResponse.json({
        success: true,
        isMock: true,
        title: eventTitle,
        start: startDateTime,
        end: endDateTime,
        meetLink: mockMeetLink,
        calendarEventId: "mock_event_" + Math.random().toString(36).substring(2, 10),
      });
    }

    const calendar = google.calendar({ version: "v3", auth });

    let response;
    try {
      response = await calendar.events.insert({
        calendarId,
        conferenceDataVersion: 1,
        requestBody: {
          summary: eventTitle,
          description: `AI Consulting Session scheduled via Portfolio.
Client: ${name} (${email})
Agenda: ${notes || "No agenda specified."}`,
          start: {
            dateTime: startDateTime,
          },
          end: {
            dateTime: endDateTime,
          },
          // Automatically request a Google Meet creation
          conferenceData: {
            createRequest: {
              requestId: "meet_" + Math.random().toString(36).substring(2, 15),
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
        },
      });
    } catch (e: any) {
      console.warn("Google Meet creation failed (service accounts on personal Gmail cannot request Meet links). Retrying without Meet creation:", e.message);
      
      try {
        response = await calendar.events.insert({
          calendarId,
          requestBody: {
            summary: eventTitle,
            description: `AI Consulting Session scheduled via Portfolio.
Client: ${name} (${email})
Agenda: ${notes || "No agenda specified."}`,
            start: {
              dateTime: startDateTime,
            },
            end: {
              dateTime: endDateTime,
            },
          },
        });
      } catch (retryError: any) {
        console.error("Retry event insertion failed:", retryError);
        throw retryError;
      }
    }

    const event = response.data;
    
    // Retrieve the Google Meet Link
    let meetLink = "";
    if (event.conferenceData?.entryPoints) {
      const meetEntryPoint = event.conferenceData.entryPoints.find(
        (ep) => ep.entryPointType === "video"
      );
      if (meetEntryPoint) {
        meetLink = meetEntryPoint.uri || "";
      }
    }

    // Fallback if no Meet link returned
    if (!meetLink) {
      meetLink = process.env.PERSONAL_MEETING_LINK || event.htmlLink || "https://meet.google.com";
    }

    return NextResponse.json({
      success: true,
      isMock: false,
      title: event.summary,
      start: event.start?.dateTime,
      end: event.end?.dateTime,
      meetLink: meetLink || "https://meet.google.com",
      calendarEventId: event.id,
    });

  } catch (error: any) {
    console.error("Schedule API Error:", error);
    
    if (error.code === 404 || error.status === 404) {
      return NextResponse.json(
        { 
          error: "Calendar not found. Please ensure that GOOGLE_CALENDAR_ID is correct and that you have shared your Google Calendar with your Service Account email (GOOGLE_CLIENT_EMAIL) with 'Make changes to events' permission." 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to schedule appointment" },
      { status: 500 }
    );
  }
}
