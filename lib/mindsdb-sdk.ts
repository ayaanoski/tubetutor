// MindsDB JavaScript SDK Integration for TubeTutor (Fixed and Cleaned)
import MindsDB from "mindsdb-js-sdk"

interface MindsDBConfig {
  host: string
  user: string
  password?: string
  port: string
  database?: string
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

class TubeTutorMindsDB {
  private mindsdb: any
  private config: MindsDBConfig
  private connected = false
  private connectionAttempts = 0
  private maxConnectionAttempts = 3

  constructor() {
    this.config = {
      user: "mindsdbr",
      password: "mindsdb", // Use a secure password in production
      host: "127.0.0.1",
      port: "47334",
      database: "eduvideos_kb"
    }
  }

async connect(): Promise<boolean> {
  try {
    this.connectionAttempts++;
    const fullHost = `http://${this.config.host}:${this.config.port}`;
    console.log(`🔌 Connecting to MindsDB at ${fullHost} (attempt ${this.connectionAttempts})…`);

    const options: any = { host: fullHost };
    // If you're running a secured cloud/pro instance, include:
    // options.user = '<EMAIL>'; options.password = '<PASSWORD>'; options.managed = true;

    await MindsDB.connect({ host: fullHost, ...options });


    // test query
    const result = await MindsDB.query("SELECT 1 as test");
    if (!result?.rows) throw new Error("Connection test failed");

    this.connected = true;
    console.log("✅ Connected to MindsDB SDK");
    return true;
  } catch (err) {
    console.error(`❌ Connect attempt ${this.connectionAttempts} failed:`, err);
    this.connected = false;

    if (this.connectionAttempts < this.maxConnectionAttempts) {
      console.log("🔄 Retrying in 2s…");
      await new Promise(res => setTimeout(res, 2000));
      return this.connect();
    }
    return false;
  }
}

  async ensureConnection(): Promise<void> {
    if (!this.connected || !this.mindsdb) {
      await this.connect()
    }
  }

  async createKnowledgeBase(): Promise<boolean> {
    try {
      await this.ensureConnection()

      const createKBQuery = `
        CREATE KNOWLEDGE_BASE IF NOT EXISTS eduvideos_kb
        USING
          engine = 'chromadb',
          metadata_columns = ['video_id', 'channel_name', 'topic', 'difficulty_level', 'duration', 'language', 'view_count', 'start_time']
      `

      await this.mindsdb.query(createKBQuery)
      console.log("✅ Knowledge base created successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to create knowledge base:", error)
      return false
    }
  }

  async insertTranscriptChunk(content: string, metadata: any): Promise<boolean> {
    try {
      await this.ensureConnection()

      const insertQuery = `
        INSERT INTO eduvideos_kb (content, metadata)
        VALUES ('${content.replace(/'/g, "''")}', '${JSON.stringify(metadata).replace(/'/g, "''")}')
      `

      await this.mindsdb.query(insertQuery)
      return true
    } catch (error) {
      console.error("❌ Failed to insert transcript chunk:", error)
      return false
    }
  }

async semanticSearch(searchQuery: SearchQuery): Promise<SearchResult[]> {
  try {
    if (!this.connected || !this.mindsdb) {
      console.warn("⚠️ MindsDB not connected. Using mock data.");
      return this.getMockResults(searchQuery.query);
    }

    let query = `
      SELECT 
        content,
        metadata
      FROM eduvideos_kb
      WHERE content LIKE '%${searchQuery.query}%'
    `;

    if (searchQuery.filters.difficulty && searchQuery.filters.difficulty !== "all") {
      query += ` AND JSON_EXTRACT(metadata, '$.difficulty_level') = '${searchQuery.filters.difficulty}'`;
    }

    if (searchQuery.filters.topic && searchQuery.filters.topic !== "all") {
      query += ` AND JSON_EXTRACT(metadata, '$.topic') = '${searchQuery.filters.topic}'`;
    }

    if (searchQuery.filters.language && searchQuery.filters.language !== "all") {
      query += ` AND JSON_EXTRACT(metadata, '$.language') = '${searchQuery.filters.language}'`;
    }

    query += ` LIMIT 10`;

    const result = await this.mindsdb.query(query);
    return this.transformSearchResults(result.rows || []);
  } catch (error) {
    console.error("❌ Semantic search error:", error);
    return this.getMockResults(searchQuery.query);
  }
}


  private transformSearchResults(rawResults: any[]): SearchResult[] {
    return rawResults.map((row: any) => {
      const metadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata

      return {
        video_id: metadata.video_id || "unknown",
        content: row.content || "",
        start_time: metadata.start_time || 0,
        channel_name: metadata.channel_name || "Unknown Channel",
        topic: metadata.topic || "general",
        difficulty_level: metadata.difficulty_level || "intermediate",
        duration: metadata.duration || "0:00",
        language: metadata.language || "english",
        view_count: metadata.view_count || "0",
        relevance_score: 0.85,
      }
    })
  }

private getMockResults(query: string): SearchResult[] {
  const allMockData: SearchResult[] = [
    {
      video_id: "sample_recursion_1",
      content: `Recursion is a programming technique where a function calls itself...`,
      start_time: 120,
      channel_name: "CodeAcademy Pro",
      topic: "programming",
      difficulty_level: "intermediate",
      duration: "45:32",
      language: "english",
      view_count: "1200000",
      relevance_score: 0.95,
    },
    {
      video_id: "sample_trees_1",
      content: `Binary trees are hierarchical data structures...`,
      start_time: 300,
      channel_name: "CS Fundamentals",
      topic: "programming",
      difficulty_level: "beginner",
      duration: "32:15",
      language: "english",
      view_count: "856000",
      relevance_score: 0.88,
    },
    {
      video_id: "sample_promises_1",
      content: `JavaScript promises provide a way to handle asynchronous operations...`,
      start_time: 180,
      channel_name: "JavaScript Mastery",
      topic: "programming",
      difficulty_level: "intermediate",
      duration: "28:45",
      language: "english",
      view_count: "2100000",
      relevance_score: 0.82,
    },
    {
      video_id: "sample_ai_intro",
      content: `Artificial Intelligence is the simulation of human intelligence in machines...`,
      start_time: 60,
      channel_name: "AI World",
      topic: "artificial intelligence",
      difficulty_level: "beginner",
      duration: "20:00",
      language: "english",
      view_count: "540000",
      relevance_score: 0.90,
    },
    {
      video_id: "sample_math_derivatives",
      content: `A derivative represents an instantaneous rate of change...`,
      start_time: 150,
      channel_name: "Math Explained",
      topic: "mathematics",
      difficulty_level: "intermediate",
      duration: "35:12",
      language: "english",
      view_count: "600000",
      relevance_score: 0.93,
    },
    {
      video_id: "sample_physics_motion",
      content: `Motion in physics refers to the change in position of an object over time...`,
      start_time: 90,
      channel_name: "Physics Central",
      topic: "science",
      difficulty_level: "beginner",
      duration: "25:45",
      language: "english",
      view_count: "320000",
      relevance_score: 0.89,
    },
    {
      video_id: "sample_data_structures",
      content: `Stacks and Queues are linear data structures used in many algorithms...`,
      start_time: 240,
      channel_name: "AlgoBoost",
      topic: "programming",
      difficulty_level: "intermediate",
      duration: "40:30",
      language: "english",
      view_count: "900000",
      relevance_score: 0.87,
    }
  ];

  return allMockData.filter(item =>
    item.content.toLowerCase().includes(query.toLowerCase())
  );
}


  async createAIModel(): Promise<boolean> {
    try {
      await this.ensureConnection()

      const modelQuery = `
        CREATE MODEL IF NOT EXISTS eduvideos_analyzer
        PREDICT sentiment
        USING
          engine = 'openai',
          model_name = 'gpt-3.5-turbo',
          prompt_template = 'Analyze the educational content and determine its difficulty level and topic: {{content}}'
      `

      await this.mindsdb.query(modelQuery)
      console.log("✅ AI model created successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to create AI model:", error)
      return false
    }
  }

  async createAgent(): Promise<boolean> {
    try {
      await this.ensureConnection()

      const agentQuery = `
        CREATE AGENT IF NOT EXISTS tubetutor_agent
        USING
          model = 'gpt-3.5-turbo',
          description = 'TubeTutor AI assistant that helps users find educational video content',
          instructions = 'You are a helpful assistant that helps users find educational video content. Answer questions about programming, mathematics, science, and other educational topics.'
      `

      await this.mindsdb.query(agentQuery)
      console.log("✅ AI agent created successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to create AI agent:", error)
      console.log("ℹ️ Agent creation is optional - the main functionality will still work")
      return false
    }
  }

  async listAvailableSkills(): Promise<string[]> {
    try {
      await this.ensureConnection()
      const result = await this.mindsdb.query("SHOW SKILLS")
      return result.rows?.map((row: any) => row.name) || []
    } catch (error) {
      console.error("❌ Failed to list skills:", error)
      return []
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      console.log("🔍 Checking MindsDB connection...")
      this.connectionAttempts = 0
      const connected = await this.connect()
      return connected
    } catch (error) {
      console.error("❌ MindsDB connection check failed:", error)
      return false
    }
  }

  getConnectionStatus(): { connected: boolean; attempts: number; config: MindsDBConfig } {
    return {
      connected: this.connected,
      attempts: this.connectionAttempts,
      config: this.config
    }
  }
}

// Export instance
export const tubeTutorMindsDB = new TubeTutorMindsDB()
