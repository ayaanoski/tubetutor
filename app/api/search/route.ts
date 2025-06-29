import { type NextRequest, NextResponse } from "next/server"
import { tubeTutorMindsDB } from "@/lib/mindsdb-sdk"

export async function POST(request: NextRequest) {
  try {
    const { query, filters } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log(`🔍 Searching for: "${query}" with filters:`, filters)

    // Perform semantic search using MindsDB SDK
    const results = await tubeTutorMindsDB.semanticSearch({ query, filters })

    // Transform results to include additional YouTube data
    const enrichedResults = results.map((result) => ({
      video_id: result.video_id,
      title: `Educational Video - ${result.topic.charAt(0).toUpperCase() + result.topic.slice(1)}`,
      channel_name: result.channel_name,
      transcript_snippet: result.content,
      start_time: result.start_time,
      thumbnail: `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(result.video_id)}`,
      duration: result.duration,
      view_count: result.view_count,
      difficulty_level: result.difficulty_level,
      topic: result.topic,
      language: result.language,
      relevance_score: result.relevance_score,
    }))

    console.log(`✅ Found ${enrichedResults.length} results`)

    return NextResponse.json({
      results: enrichedResults,
      total: enrichedResults.length,
      query: query,
    })
  } catch (error) {
    console.error("❌ Search API error:", error)
    return NextResponse.json(
      {
        error: "Search failed. Please check MindsDB connection.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
