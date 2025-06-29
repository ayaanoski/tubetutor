import { type NextRequest, NextResponse } from "next/server"
import { tubeTutorMindsDB } from "@/lib/mindsdb-sdk"

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    console.log(`🔧 MindsDB API action: ${action}`)

    switch (action) {
      case "check_connection":
        try {
          const isConnected = await tubeTutorMindsDB.checkConnection()
          const status = tubeTutorMindsDB.getConnectionStatus()

          return NextResponse.json({
            success: isConnected,
            message: isConnected ? "MindsDB SDK connection successful" : "MindsDB SDK connection failed",
            details: {
              connected: status.connected,
              attempts: status.attempts,
              config: {
                host: status.config.host,
                port: status.config.port,
                user: status.config.user,
                // Don't expose password
              },
            },
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "Connection check failed",
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }

      case "create_knowledge_base":
        try {
          const created = await tubeTutorMindsDB.createKnowledgeBase()
          return NextResponse.json({
            success: created,
            message: created ? "Knowledge base created successfully" : "Failed to create knowledge base",
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "Knowledge base creation failed",
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }


      case "create_ai_model":
        try {
          const modelCreated = await tubeTutorMindsDB.createAIModel()
          return NextResponse.json({
            success: modelCreated,
            message: modelCreated ? "AI model created successfully" : "Failed to create AI model",
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "AI model creation failed",
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }

      case "create_agent":
        try {
          const agentCreated = await tubeTutorMindsDB.createAgent()
          return NextResponse.json({
            success: agentCreated,
            message: agentCreated ? "AI agent created successfully" : "Failed to create AI agent",
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "AI agent creation failed (this is optional)",
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }

      case "insert_transcript":
        try {
          const { content, metadata } = data
          const inserted = await tubeTutorMindsDB.insertTranscriptChunk(content, metadata)
          return NextResponse.json({
            success: inserted,
            message: inserted ? "Transcript chunk inserted successfully" : "Failed to insert transcript chunk",
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "Transcript insertion failed",
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ MindsDB API error:", error)
    return NextResponse.json(
      {
        error: "MindsDB operation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
