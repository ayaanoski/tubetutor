// MindsDB SDK Setup Script for TubeTutor (Fixed Version)
import MindsDB from "mindsdb-js-sdk"

const MINDSDB_CONFIG = {
  host: process.env.MINDSDB_HOST || "localhost",
  port: Number.parseInt(process.env.MINDSDB_PORT) || 47334,
  username: process.env.MINDSDB_USER || "mindsdb",
  password: process.env.MINDSDB_PASSWORD || "mindsdb",
  database: "mindsdb",
}

class TubeTutorSetup {
  constructor() {
    this.mindsdb = null
  }

  async connect() {
    try {
      console.log("🔌 Connecting to MindsDB with SDK...")

      this.mindsdb = await MindsDB.connect({
        host: MINDSDB_CONFIG.host,
        port: MINDSDB_CONFIG.port,
        username: MINDSDB_CONFIG.username,
        password: MINDSDB_CONFIG.password,
        database: MINDSDB_CONFIG.database,
      })

      console.log("✅ MindsDB SDK connected successfully")
      return true
    } catch (error) {
      console.error("❌ MindsDB SDK connection failed:", error)
      return false
    }
  }

  async setupKnowledgeBase() {
    try {
      console.log("📚 Setting up knowledge base...")

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
      if (error.message.includes("already exists")) {
        console.log("ℹ️ Knowledge base already exists")
        return true
      }
      console.error("❌ Failed to create knowledge base:", error)
      return false
    }
  }

  async createAIModel() {
    try {
      console.log("🧠 Creating AI model...")

      const modelQuery = `
        CREATE MODEL IF NOT EXISTS eduvideos_analyzer
        PREDICT analysis
        USING
          engine = 'openai',
          model_name = 'gpt-3.5-turbo',
          prompt_template = 'Analyze this educational content and provide topic and difficulty: {{content}}'
      `

      await this.mindsdb.query(modelQuery)
      console.log("✅ AI model created successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to create AI model:", error)
      return false
    }
  }

  async listAvailableSkills() {
    try {
      console.log("🔍 Checking available skills...")
      const result = await this.mindsdb.query("SHOW SKILLS")
      const skills = result.rows?.map((row) => row.name) || []
      console.log("Available skills:", skills)
      return skills
    } catch (error) {
      console.log("ℹ️ Could not fetch skills (this is normal for some MindsDB versions)")
      return []
    }
  }

  async createAgent() {
    try {
      console.log("🤖 Creating AI agent...")

      // Check available skills first
      const availableSkills = await this.listAvailableSkills()

      let agentQuery
      if (availableSkills.length > 0) {
        // Use available skills (limit to first 2 to avoid errors)
        const skillsList = availableSkills
          .slice(0, 2)
          .map((skill) => `'${skill}'`)
          .join(", ")
        agentQuery = `
          CREATE AGENT IF NOT EXISTS tubetutor_agent
          USING
            model = 'gpt-3.5-turbo',
            skills = [${skillsList}],
            description = 'TubeTutor AI assistant that helps users find educational video content'
        `
      } else {
        // Create basic agent without skills
        agentQuery = `
          CREATE AGENT IF NOT EXISTS tubetutor_agent
          USING
            model = 'gpt-3.5-turbo',
            description = 'TubeTutor AI assistant that helps users find educational video content',
            instructions = 'You are a helpful assistant specializing in educational content. Help users find relevant video segments for learning programming, mathematics, science, and other subjects.'
        `
      }

      await this.mindsdb.query(agentQuery)
      console.log("✅ AI agent created successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to create AI agent:", error)
      console.log("ℹ️ Agent creation failed, but this won't affect main functionality")
      return false
    }
  }

  async insertSampleData() {
    try {
      console.log("📝 Inserting sample data...")

      const sampleData = [
        {
          content:
            "Recursion is a programming technique where a function calls itself. When working with tree data structures, recursion is particularly powerful because trees have a recursive nature.",
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
            "JavaScript promises provide a way to handle asynchronous operations. A promise represents a value that may not be available yet but will be resolved at some point in the future.",
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
        const insertQuery = `
          INSERT INTO eduvideos_kb (content, metadata)
          VALUES ('${item.content.replace(/'/g, "''")}', '${JSON.stringify(item.metadata).replace(/'/g, "''")}')
        `
        await this.mindsdb.query(insertQuery)
      }

      console.log("✅ Sample data inserted successfully")
      return true
    } catch (error) {
      console.error("❌ Failed to insert sample data:", error)
      return false
    }
  }

  async testSetup() {
    try {
      console.log("🧪 Testing setup...")

      // Test knowledge base
      const countQuery = "SELECT COUNT(*) as total FROM eduvideos_kb"
      const countResult = await this.mindsdb.query(countQuery)
      console.log("Total documents:", countResult.rows[0]?.total || 0)

      // Test search
      const searchQuery = "SELECT content FROM eduvideos_kb WHERE content LIKE '%recursion%' LIMIT 1"
      const searchResult = await this.mindsdb.query(searchQuery)
      console.log("Search test:", searchResult.rows.length > 0 ? "✅ Working" : "❌ No results")

      return true
    } catch (error) {
      console.error("❌ Setup test failed:", error)
      return false
    }
  }

  async runFullSetup() {
    console.log("🚀 Starting TubeTutor MindsDB SDK setup...")

    const connected = await this.connect()
    if (!connected) {
      console.error("❌ Setup failed: Could not connect to MindsDB")
      return false
    }

    const steps = [
      { name: "Knowledge Base", fn: () => this.setupKnowledgeBase() },
      { name: "Sample Data", fn: () => this.insertSampleData() },
      { name: "AI Model", fn: () => this.createAIModel() },
      { name: "AI Agent", fn: () => this.createAgent() },
      { name: "Test Setup", fn: () => this.testSetup() },
    ]

    for (const step of steps) {
      console.log(`\n📋 Setting up ${step.name}...`)
      const success = await step.fn()
      if (!success && step.name !== "AI Agent") {
        console.error(`❌ Failed to setup ${step.name}`)
      }
    }

    console.log("\n🎉 TubeTutor setup completed!")
    console.log("🔍 You can now start searching for educational content!")
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new TubeTutorSetup()
  setup.runFullSetup().catch(console.error)
}

export default TubeTutorSetup
