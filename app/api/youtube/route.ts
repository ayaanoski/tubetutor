import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "Video ID required" }, { status: 400 })
  }

  try {
    // In a real implementation, this would use the YouTube Data API
    const mockVideoData = {
      id: videoId,
      title: "Sample Educational Video",
      channelTitle: "Education Channel",
      description: "This is a sample educational video description.",
      thumbnails: {
        high: {
          url: "/placeholder.svg?height=360&width=480",
        },
      },
      duration: "PT15M33S",
      viewCount: "100000",
      transcript: [
        {
          start: 0,
          duration: 30,
          text: "Welcome to this educational video about programming concepts.",
        },
        {
          start: 30,
          duration: 30,
          text: "Today we will learn about recursion and how it applies to tree structures.",
        },
      ],
    }

    return NextResponse.json(mockVideoData)
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json({ error: "Failed to fetch video data" }, { status: 500 })
  }
}
