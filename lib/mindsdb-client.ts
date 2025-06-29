// MindsDB Client for TubeTutor
// Handles all MindsDB API interactions with proper authentication

interface MindsDBConfig {
  host: string
  port: string
  user: string
  password: string
}

interface SearchQuery {
  query: string
  filters: {
    difficulty?: string
    topic?: string
    language?: string
  }
}

interface SearchResult {
  video_id: string
  content: string
  start_time: number
  channel_name: string
  topic: string
  difficulty_level: string
  duration: string
  language: string
  view_count: string
  relevance_score: number
}

class MindsDBClient {
  private config: MindsDBConfig
  private baseUrl: string
  private authToken?: string

  constructor() {
    this.config = {
      host: process.env.MINDSDB_HOST || "localhost",
      port: process.env.MINDSDB_PORT || "47334",
      user: process.env.MINDSDB_USER || "mindsdb",
      password: process.env.MINDSDB_PASSWORD || "mindsdb",
    }
    this.baseUrl = `http://${this.config.host}:${this.config.port}`
  }

  async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.config.user,
          password: this.config.password,
        }),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.authToken = data.access_token || "authenticated"
      console.log("MindsDB authentication successful")
    } catch (error) {
      console.error("MindsDB authentication error:", error)
      throw error
    }
  }

  async executeQuery(query: string): Promise<any> {
    if (!this.authToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/sql/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("MindsDB query error:", error)
      throw error
    }
  }

  async createKnowledgeBase(): Promise<boolean> {
    try {
      const query = `
        CREATE KNOWLEDGE_BASE IF NOT EXISTS eduvideos_kb
        USING ChromaDB
        WITH
          metadata_columns = ['video_id', 'channel_name', 'topic', 'difficulty_level', 'duration', 'language', 'view_count', 'start_time'];
      `

      await this.executeQuery(query)
      console.log("Knowledge base created successfully")
      return true
    } catch (error) {
      console.error("Failed to create knowledge base:", error)
      return false
    }
  }

  async insertTranscriptChunk(content: string, metadata: any): Promise<boolean> {
    try {
      const query = `
        INSERT INTO eduvideos_kb (content, metadata)
        VALUES ('${content.replace(/'/g, "''")}', '${JSON.stringify(metadata).replace(/'/g, "''")}');
      `

      await this.executeQuery(query)
      return true
    } catch (error) {
      console.error("Failed to insert transcript chunk:", error)
      return false
    }
  }

  async semanticSearch(searchQuery: SearchQuery): Promise<SearchResult[]> {
    try {
      let query = `
        SELECT content, metadata
        FROM eduvideos_kb
        WHERE content LIKE '%${searchQuery.query}%'
      `

      // Add filters
      if (searchQuery.filters.difficulty && searchQuery.filters.difficulty !== "all") {
        query += ` AND JSON_EXTRACT(metadata, '$.difficulty_level') = '${searchQuery.filters.difficulty}'`
      }

      if (searchQuery.filters.topic && searchQuery.filters.topic !== "all") {
        query += ` AND JSON_EXTRACT(metadata, '$.topic') = '${searchQuery.filters.topic}'`
      }

      if (searchQuery.filters.language && searchQuery.filters.language !== "all") {
        query += ` AND JSON_EXTRACT(metadata, '$.language') = '${searchQuery.filters.language}'`
      }

      query += ` ORDER BY relevance_score DESC LIMIT 10;`

      const result = await this.executeQuery(query)

      // Transform results to expected format
      return this.transformSearchResults(result.data || [])
    } catch (error) {
      console.error("Semantic search error:", error)
      return []
    }
  }

  private transformSearchResults(rawResults: any[]): SearchResult[] {
    return rawResults.map((row: any) => {
      const metadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata

      return {
        video_id: metadata.video_id,
        content: row.content,
        start_time: metadata.start_time || 0,
        channel_name: metadata.channel_name || "Unknown Channel",
        topic: metadata.topic || "general",
        difficulty_level: metadata.difficulty_level || "intermediate",
        duration: metadata.duration || "0:00",
        language: metadata.language || "english",
        view_count: metadata.view_count || "0",
        relevance_score: row.relevance_score || 0.5,
      }
    })
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.authenticate()
      const result = await this.executeQuery("SELECT 1 as test;")
      return result !== null
    } catch (error) {
      console.error("MindsDB connection check failed:", error)
      return false
    }
  }

  async setupInitialData(): Promise<void> {
    try {
      // Create knowledge base
      await this.createKnowledgeBase()

      // Insert sample data for testing
      const sampleData = [
        {
          content:
            "Recursion is a programming technique where a function calls itself. When working with tree data structures, recursion is particularly powerful because trees have a recursive nature - each subtree is itself a tree. Let me show you how to implement a recursive tree traversal.",
          metadata: {
            video_id: "sample_recursion_1",
            start_time: 120,
            channel_name: "CodeAcademy Pro",
            topic: "programming",
            difficulty_level: "intermediate",
            duration: "45:32",
            language: "english",
            view_count: "1200000",
          },
        },
        {
          content:
            "Binary trees are hierarchical data structures where each node has at most two children. Tree traversal algorithms like inorder, preorder, and postorder are naturally implemented using recursion. Here's how we can traverse a binary tree recursively.",
          metadata: {
            video_id: "sample_trees_1",
            start_time: 300,
            channel_name: "CS Fundamentals",
            topic: "programming",
            difficulty_level: "beginner",
            duration: "32:15",
            language: "english",
            view_count: "856000",
          },
        },
        {
          content:
            "JavaScript promises provide a way to handle asynchronous operations. A promise represents a value that may not be available yet but will be resolved at some point in the future. Let's explore how promises work with practical examples.",
          metadata: {
            video_id: "sample_promises_1",
            start_time: 180,
            channel_name: "JavaScript Mastery",
            topic: "programming",
            difficulty_level: "intermediate",
            duration: "28:45",
            language: "english",
            view_count: "2100000",
          },
        },
      ]

      for (const item of sampleData) {
        await this.insertTranscriptChunk(item.content, item.metadata)
      }

      console.log("Sample data inserted successfully")
    } catch (error) {
      console.error("Failed to setup initial data:", error)
    }
  }
}

export const mindsdbClient = new MindsDBClient()
