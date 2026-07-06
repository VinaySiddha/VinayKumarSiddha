"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar as CalendarIcon, User, Mail, MessageSquare, CheckCircle, ArrowRight, Video, AlertCircle } from "lucide-react";

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Custom Time variables
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState("10:00");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result parameters from API
  const [meetLink, setMeetLink] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");

  const availableTimes = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    // "05:00 PM",
    // "05:30 PM",
    // "06:00 PM",
    // "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
  ];

  // Format HH:MM string to 12-hour AM/PM format
  const formatCustomTime = (timeString: string) => {
    if (!timeString) return "";
    const [hoursStr, minutesStr] = timeString.split(":");
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    if (isNaN(hours) || isNaN(minutes)) return timeString;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
    return `${hours.toString().padStart(2, '0')}:${minutesFormatted} ${ampm}`;
  };

  // Sync customTime with selectedTime when custom mode is active
  useEffect(() => {
    if (isCustomTime) {
      setSelectedTime(formatCustomTime(customTime));
    }
  }, [customTime, isCustomTime]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime || !name || !email) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          date: date.toISOString(),
          time: selectedTime,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book session");
      }

      setMeetLink(data.meetLink);
      setGeneratedTitle(data.title);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred while booking.");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = date ? date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Title Header */}
      <div className="z-10 text-center max-w-2xl mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-cyber-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
        >
          SYNC & COLLABORATE
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4"
        >
          SCHEDULE A <span className="gradient-text-fusion">MEETING</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/60 text-sm leading-relaxed"
        >
          Select a date and time slot to book an AI consulting, system architecture, or full-stack development discussion session.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-4xl z-10"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="booking-form"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="cyber-glass-heavy p-8 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: Calendar & Time Picker */}
              <div className="lg:col-span-7 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10 gap-6 md:gap-4 items-center justify-center bg-black/40 rounded-2xl border border-white/5 p-4">
                <div className="flex-shrink-0">
                  <Calendar mode="single" onSelect={setDate} selected={date} />
                </div>
                <div className="relative w-full md:w-[240px] h-[320px] overflow-hidden pt-4 md:pt-0 md:pl-4">
                  <div className="absolute inset-0 flex flex-col gap-3">
                    <div className="flex justify-between items-center px-2">
                      <p className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400">
                        {isCustomTime ? "Custom Time" : "Available Slots"}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomTime(!isCustomTime);
                          setSelectedTime(isCustomTime ? null : formatCustomTime(customTime));
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider font-mono text-cyber-blue hover:text-cyber-blue/80 transition-colors"
                      >
                        {isCustomTime ? "Use Slots" : "Custom Time"}
                      </button>
                    </div>

                    {isCustomTime ? (
                      <div className="flex flex-col gap-4 px-2 pt-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
                          Select Custom Time
                        </label>
                        <input
                          type="time"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all font-mono"
                        />
                        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed mt-2">
                          Choose any time of the day. Sessions are booked for a default duration of 30 minutes.
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="flex-grow">
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 px-2 pb-4">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              size="sm"
                              variant={selectedTime === time ? "default" : "outline"}
                              className="w-full font-mono text-xs"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Appointment details form */}
              <form onSubmit={handleBook} className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-cyber-blue" />
                    Session Details
                  </h3>

                  {date && selectedTime ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-cyber-blue/10 border border-cyber-blue/20 text-sm text-zinc-300 space-y-2 mb-6"
                    >
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <CalendarIcon className="w-4 h-4 text-cyber-blue" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-cyber-blue font-semibold">
                        <Clock className="w-4 h-4" />
                        {selectedTime}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-white/40 mb-6 italic text-center">
                      Select a date and time slot from the calendar to configure your session.
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                        <User className="w-3 h-3 text-cyber-blue" /> Name
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!date || !selectedTime}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all placeholder:text-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-cyber-blue" /> Email Address
                      </label>
                      <input
                        type="email"
                        required
                        disabled={!date || !selectedTime}
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all placeholder:text-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3 text-cyber-blue" /> Agenda / Topic (Optional)
                      </label>
                      <textarea
                        rows={3}
                        disabled={!date || !selectedTime}
                        placeholder="Discussing RAG pipelines, fine-tuning LLMs, or job opportunities..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all placeholder:text-white/20 resize-none disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!date || !selectedTime || !name || !email || loading}
                  className="w-full flex items-center justify-center gap-2 group tracking-wider uppercase text-[10px] font-black py-3 rounded-full mt-4"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="booking-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="cyber-glass-heavy p-12 border border-cyber-blue/20 text-center max-w-xl mx-auto flex flex-col items-center gap-6 shadow-cyber-glow"
            >
              <div className="w-16 h-16 rounded-full bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/20 text-cyber-blue animate-pulse-ring">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight">TRANSMISSION CONFIRMED</h2>
                <p className="text-zinc-400 text-sm">
                  Your appointment slot has been successfully scheduled on Google Calendar.
                </p>
              </div>

              <div className="w-full p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-mono">TITLE</span>
                  <span className="text-white font-bold text-right max-w-[70%] truncate">{generatedTitle}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-mono">CLIENT</span>
                  <span className="text-white font-semibold">{name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-mono">EMAIL</span>
                  <span className="text-white font-semibold font-mono">{email}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-mono">DATE</span>
                  <span className="text-white font-semibold">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-mono">TIME SLOT</span>
                  <span className="text-cyber-blue font-bold font-mono">{selectedTime}</span>
                </div>
                {notes && (
                  <div className="pt-2 border-t border-white/5 text-xs text-zinc-400">
                    <span className="text-zinc-500 font-mono block mb-1">AGENDA</span>
                    {notes}
                  </div>
                )}
              </div>

              {meetLink && (
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="default"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-mono text-[10px] uppercase font-black bg-[#00E8F3] hover:bg-[#00E8F3]/90 text-black hover:shadow-[0_0_15px_rgba(0,232,243,0.4)]"
                  >
                    <Video className="w-4 h-4" />
                    Join Google Meet Session
                  </Button>
                </a>
              )}

              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedTime(null);
                  setName("");
                  setEmail("");
                  setNotes("");
                  setMeetLink("");
                  setGeneratedTitle("");
                  setIsCustomTime(false);
                }}
                variant="outline"
                className="rounded-full px-8 py-2 text-xs font-bold uppercase tracking-widest mt-2"
              >
                Schedule Another Meeting
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
