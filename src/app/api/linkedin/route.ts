import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const count = parseInt(searchParams.get('count') || '6')

    // TODO: Replace with actual LinkedIn API integration
    // Option 1: Official LinkedIn API (requires OAuth)
    // const response = await fetch(`https://api.linkedin.com/v2/ugcPosts?author=${userId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
    //   },
    // })

    // Option 2: RapidAPI LinkedIn Scraper
    // const response = await fetch(`https://linkedin-profile-data.p.rapidapi.com/posts`, {
    //   method: 'POST',
    //   headers: {
    //     'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
    //     'X-RapidAPI-Host': 'linkedin-profile-data.p.rapidapi.com',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ profile_url: userId }),
    // })

    // Option 3: Proxycurl API
    // const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin/company/posts`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`,
    //   },
    // })

    // Mock data for demonstration
    const mockPosts = [
      {
        id: '1',
        author: {
          name: 'Vinny',
          headline: 'AI Engineer & Full Stack Developer',
          profileImage: '/profile.jpg',
        },
        content: '🚀 Just launched a new AI-powered application that processes natural language queries and generates interactive visualizations in real-time! Built with Next.js, Python FastAPI, and OpenAI GPT-4.\n\nThe system can understand complex data requests and automatically create beautiful charts, graphs, and dashboards. Already saving teams 10+ hours per week on data analysis.\n\nExcited to share more details soon!',
        publishedAt: '2 days ago',
        likes: 342,
        comments: 28,
        shares: 15,
        postUrl: 'https://linkedin.com/post/1',
        hashtags: ['AI', 'MachineLearning', 'WebDevelopment', 'Innovation'],
      },
      {
        id: '2',
        author: {
          name: 'Vinny',
          headline: 'AI Engineer & Full Stack Developer',
          profileImage: '/profile.jpg',
        },
        content: '💡 Sharing some insights on building scalable microservices with Docker and Kubernetes.\n\nKey lessons learned:\n• Container orchestration reduces deployment time by 70%\n• Horizontal scaling handles 10x traffic spikes seamlessly\n• Health checks and auto-recovery prevent 99% of downtime\n\nWould love to hear your experiences with cloud-native architectures!',
        publishedAt: '5 days ago',
        likes: 187,
        comments: 12,
        shares: 8,
        postUrl: 'https://linkedin.com/post/2',
        hashtags: ['DevOps', 'Docker', 'Kubernetes', 'CloudComputing'],
      },
      {
        id: '3',
        author: {
          name: 'Vinny',
          headline: 'AI Engineer & Full Stack Developer',
          profileImage: '/profile.jpg',
        },
        content: '🎯 Completed AWS Solutions Architect certification! Grateful for this journey of learning cloud infrastructure at scale.\n\nNext focus: Building serverless architectures with Lambda, API Gateway, and DynamoDB to reduce infrastructure costs by 60%.\n\nAlways learning, always growing. 📚',
        publishedAt: '1 week ago',
        likes: 521,
        comments: 45,
        shares: 23,
        postUrl: 'https://linkedin.com/post/3',
        hashtags: ['AWS', 'CloudArchitecture', 'Serverless', 'CareerGrowth'],
      },
      {
        id: '4',
        author: {
          name: 'Vinny',
          headline: 'AI Engineer & Full Stack Developer',
          profileImage: '/profile.jpg',
        },
        content: '🌟 Reflecting on an amazing year of innovation! Built 5 production apps, mentored 10+ junior devs, and contributed to open-source AI projects.\n\nKey achievements:\n✅ Reduced API response time by 85%\n✅ Implemented real-time ML inference\n✅ Achieved 99.9% uptime\n\nGrateful for this community. Here\'s to 2026! 🎉',
        publishedAt: '2 weeks ago',
        likes: 789,
        comments: 67,
        shares: 34,
        postUrl: 'https://linkedin.com/post/4',
        hashtags: ['YearInReview', 'TechCareer', 'AI', 'OpenSource'],
      },
      {
        id: '5',
        author: {
          name: 'Vinny',
          headline: 'AI Engineer & Full Stack Developer',
          profileImage: '/profile.jpg',
        },
        content: '🔥 New blog post: "Building Real-Time AI Chat with Streaming Responses"\n\nDive deep into:\n• WebSocket vs Server-Sent Events\n• Token streaming optimization\n• State management patterns\n• Production deployment tips\n\nLink in comments 👇',
        publishedAt: '3 weeks ago',
        likes: 234,
        comments: 19,
        shares: 11,
        postUrl: 'https://linkedin.com/post/5',
        hashtags: ['TechBlog', 'AI', 'RealTime', 'WebDevelopment'],
      },
      {
        id: '6',
        author: {
          name: 'Vinny',
          headline: 'AI Engineer & Full Stack Developer',
          profileImage: '/profile.jpg',
        },
        content: '💻 Open to consulting opportunities! Specializing in:\n\n• AI/ML integration & optimization\n• Full-stack web application development\n• Cloud architecture & DevOps\n• System design & scalability\n\nLet\'s build something amazing together! 🚀',
        publishedAt: '1 month ago',
        likes: 156,
        comments: 23,
        shares: 7,
        postUrl: 'https://linkedin.com/post/6',
        hashtags: ['Consulting', 'Hiring', 'AIEngineering', 'FullStack'],
      },
    ]

    return NextResponse.json({
      success: true,
      posts: mockPosts.slice(0, count),
      message: 'Mock data - Configure LinkedIn API for real posts',
    })
  } catch (error) {
    console.error('LinkedIn API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch LinkedIn posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
