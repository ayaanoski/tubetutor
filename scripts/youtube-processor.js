// YouTube Data Processing Script for TubeTutor
// This script fetches video data and processes transcripts for MindsDB

import fetch from "node-fetch"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const MINDSDB_CONFIG = {
  host: process.env.MINDSDB_HOST || "localhost",
  port: process.env.MINDSDB_PORT || "47334",
  user: process.env.MINDSDB_USER || "mindsdb",
  password: process.env.MINDSDB_PASSWORD || "mindsdb",
}

class YouTubeProcessor {
  constructor() {
    this.processedVideos = new Set()
    this.mindsdbUrl = `http://${MINDSDB_CONFIG.host}:${MINDSDB_CONFIG.port}`
    this.authToken = null
  }

  async authenticateMindsDB() {
    try {
      const response = await fetch(`${this.mindsdbUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: MINDSDB_CONFIG.user,
          password: MINDSDB_CONFIG.password,
        }),
      })

      if (!response.ok) {
        throw new Error(`MindsDB authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.authToken = data.access_token || "authenticated"
      console.log("✅ MindsDB authentication successful")
    } catch (error) {
      console.error("❌ MindsDB authentication error:", error)
      throw error
    }
  }

  async executeMindsDBQuery(query) {
    if (!this.authToken) {
      await this.authenticateMindsDB()
    }

    try {
      const response = await fetch(`${this.mindsdbUrl}/api/sql/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`MindsDB query failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("MindsDB query error:", error)
      throw error
    }
  }

  async fetchVideoData(videoId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics,contentDetails`,
      )
      const data = await response.json()
      return data.items[0]
    } catch (error) {
      console.error("Error fetching video data:", error)
      return null
    }
  }

  async fetchTranscript(videoId) {
    try {
      // In a real implementation, you would use youtube-transcript library
      // For demo purposes, we'll return mock transcript data
      return [
        {
          start: 0,
          duration: 30,
          text: "Welcome to this comprehensive tutorial on data structures and algorithms.",
        },
        {
          start: 30,
          duration: 30,
          text: "Today we will explore recursion and how it naturally fits with tree structures.",
        },
        {
          start: 60,
          duration: 30,
          text: "A recursive function is one that calls itself with a smaller version of the problem.",
        },
      ]
    } catch (error) {
      console.error("Error fetching transcript:", error)
      return []
    }
  }

  chunkTranscript(transcript, windowSize = 30) {
    const chunks = []
    let currentChunk = ""
    let chunkStart = 0

    for (const segment of transcript) {
      if (segment.start - chunkStart >= windowSize && currentChunk) {
        chunks.push({
          start_time: chunkStart,
          content: currentChunk.trim(),
        })
        currentChunk = segment.text + " "
        chunkStart = segment.start
      } else {
        currentChunk += segment.text + " "
      }
    }

    // Add the last chunk
    if (currentChunk) {
      chunks.push({
        start_time: chunkStart,
        content: currentChunk.trim(),
      })
    }

    return chunks
  }

  async insertToMindsDB(videoData, transcriptChunks) {
    try {
      console.log(`📝 Inserting ${transcriptChunks.length} chunks for video ${videoData.id}`)

      for (const chunk of transcriptChunks) {
        const metadata = {
          video_id: videoData.id,
          channel_name: videoData.snippet.channelTitle,
          topic: this.extractTopic(videoData.snippet.title, videoData.snippet.description),
          difficulty_level: this.assessDifficulty(videoData.snippet.description),
          duration: this.formatDuration(videoData.contentDetails.duration),
          language: "english",
          view_count: videoData.statistics.viewCount,
          start_time: chunk.start_time,
        }

        const query = `
          INSERT INTO eduvideos_kb (content, metadata)
          VALUES ('${chunk.content.replace(/'/g, "''")}', '${JSON.stringify(metadata).replace(/'/g, "''")}');
        `

        await this.executeMindsDBQuery(query)
      }

      console.log(`✅ Successfully inserted all chunks for video ${videoData.id}`)
    } catch (error) {
      console.error(`❌ Error inserting video ${videoData.id} to MindsDB:`, error)
    }
  }

  extractTopic(title, description) {
    const topics = {
      programming: ["javascript", "python", "coding", "programming", "algorithm", "data structure"],
      mathematics: ["math", "calculus", "algebra", "geometry", "statistics"],
      science: ["physics", "chemistry", "biology", "science"],
      business: ["business", "marketing", "finance", "economics"],
    }

    const text = (title + " " + description).toLowerCase()

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return topic
      }
    }

    return "general"
  }

  assessDifficulty(description) {
    const text = description.toLowerCase()

    if (text.includes("beginner") || text.includes("intro") || text.includes("basics")) {
      return "beginner"
    } else if (text.includes("advanced") || text.includes("expert") || text.includes("master")) {
      return "advanced"
    }

    return "intermediate"
  }

  formatDuration(isoDuration) {
    // Convert ISO 8601 duration to readable format
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    const hours = Number.parseInt(match[1]) || 0
    const minutes = Number.parseInt(match[2]) || 0
    const seconds = Number.parseInt(match[3]) || 0

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  async processVideo(videoId) {
    if (this.processedVideos.has(videoId)) {
      console.log(`Video ${videoId} already processed`)
      return
    }

    console.log(`Processing video: ${videoId}`)

    const videoData = await this.fetchVideoData(videoId)
    if (!videoData) {
      console.error(`Failed to fetch data for video: ${videoId}`)
      return
    }

    const transcript = await this.fetchTranscript(videoId)
    if (transcript.length === 0) {
      console.error(`No transcript available for video: ${videoId}`)
      return
    }

    const chunks = this.chunkTranscript(transcript)
    await this.insertToMindsDB(videoData, chunks)

    this.processedVideos.add(videoId)
    console.log(`Successfully processed video: ${videoId}`)
  }

  async processVideoList(videoIds) {
    for (const videoId of videoIds) {
      await this.processVideo(videoId)
      // Add delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

// Example usage with your MindsDB credentials
const processor = new YouTubeProcessor()

console.log("🚀 Starting YouTube video processing...")
console.log(`📡 Connecting to MindsDB at ${MINDSDB_CONFIG.host}:${MINDSDB_CONFIG.port}`)

// Test connection first
processor
  .authenticateMindsDB()
  .then(() => {
    console.log("✅ MindsDB connection established")
    console.log("📚 Ready to process educational videos")
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MindsDB:", error)
    process.exit(1)
  })

// Sample educational video IDs (replace with real ones)
const educationalVideos = [
  "dQw4w9WgXcQ", // Replace with actual educational video IDs
  "abc123def456",
  "xyz789ghi012",
]

processor
  .processVideoList(educationalVideos)
  .then(() => console.log("All videos processed successfully"))
  .catch((error) => console.error("Processing failed:", error))
