# TubeTutor Setup Guide

Complete guide to set up TubeTutor with MindsDB JavaScript SDK integration.

## 📋 Prerequisites

### 1. MindsDB Installation

**Option A: Docker (Recommended)**
\`\`\`bash
docker run -p 47334:47334 mindsdb/mindsdb
\`\`\`

**Option B: Local Installation**
\`\`\`bash
pip install mindsdb
mindsdb --api http
\`\`\`

**Option C: MindsDB Cloud**
- Sign up at [cloud.mindsdb.com](https://cloud.mindsdb.com)
- Update your `.env` with cloud credentials

### 2. Node.js Requirements
- Node.js 18+ 
- npm or yarn package manager

## 🚀 Installation Steps

### Step 1: Clone and Install
\`\`\`bash
git clone <your-repo-url>
cd tubetutor
npm install
\`\`\`

### Step 2: Environment Configuration
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your MindsDB credentials:
\`\`\`env
MINDSDB_HOST=localhost
MINDSDB_PORT=47334
MINDSDB_USER=mindsdb
MINDSDB_PASSWORD=mindsdb
\`\`\`

### Step 3: Start MindsDB
Make sure MindsDB is running on `localhost:47334`

**Verify MindsDB is running:**
\`\`\`bash
curl http://localhost:47334/api/status
\`\`\`

### Step 4: Run TubeTutor Setup
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000/setup` and click "Run All Steps"

## 🔧 Manual Setup (Alternative)

If the web setup doesn't work, run the setup script directly:

\`\`\`bash
node scripts/setup-mindsdb-sdk.js
\`\`\`

## 📊 Verification

### Test MindsDB Connection
\`\`\`bash
curl -X POST http://localhost:3000/api/mindsdb \
  -H "Content-Type: application/json" \
  -d '{"action": "check_connection"}'
\`\`\`

### Test Search Functionality
\`\`\`bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "recursion tree example", "filters": {"difficulty": "all", "topic": "all", "language": "all"}}'
\`\`\`

## 🎯 Usage

### 1. Basic Search
- Go to `http://localhost:3000`
- Click "Get Started" 
- Enter your search query: "explain recursion with trees"
- View results with timestamps

### 2. Advanced Features
- Use filters for difficulty, topic, language
- Click timestamps to jump to video moments
- Try conversational queries

## 🔍 MindsDB SDK Features Used

### 1. Knowledge Base (ChromaDB)
\`\`\`javascript
await mindsdb.databases.create('eduvideos_kb', 'chromadb')
\`\`\`

### 2. Semantic Search
\`\`\`javascript
const results = await mindsdb.query(`
  SELECT content, metadata, distance 
  FROM eduvideos_kb.documents 
  WHERE content LIKE '%${query}%'
`)
\`\`\`

### 3. AI Models
\`\`\`javascript
await mindsdb.query(`
  CREATE MODEL eduvideos_semantic_model
  PREDICT relevance_score
  USING engine = 'openai'
`)
\`\`\`

### 4. AI Agents
\`\`\`javascript
await mindsdb.query(`
  CREATE AGENT tubetutor_agent
  USING model = 'gpt-4', skills = ['knowledge_base']
`)
\`\`\`

## 🐛 Troubleshooting

### MindsDB Connection Issues
\`\`\`bash
# Check if MindsDB is running
curl http://localhost:47334/api/status

# Check logs
docker logs <mindsdb-container-id>
\`\`\`

### Port Conflicts
If port 47334 is busy:
\`\`\`bash
# Find process using port
lsof -i :47334

# Kill process
kill -9 <PID>
\`\`\`

### SDK Installation Issues
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 📈 Adding Real Data

### 1. YouTube API Setup
- Get API key from [Google Cloud Console](https://console.cloud.google.com/)
- Add to `.env`: `YOUTUBE_API_KEY=your_key`

### 2. Process Videos
\`\`\`bash
npm run process:videos
\`\`\`

### 3. Custom Data
Add your own educational content:
\`\`\`javascript
await tubeTutorMindsDB.insertTranscriptChunk(
  "Your educational content here",
  {
    video_id: "custom_video_1",
    start_time: 60,
    topic: "programming",
    difficulty_level: "beginner"
  }
)
\`\`\`

## 🚀 Production Deployment

### 1. Environment Variables
Set these in your production environment:
- `MINDSDB_HOST` (your MindsDB instance)
- `MINDSDB_USER` / `MINDSDB_PASSWORD`
- `OPENAI_API_KEY` (for AI features)

### 2. Build and Deploy
\`\`\`bash
npm run build
npm start
\`\`\`

### 3. MindsDB Cloud
For production, consider using MindsDB Cloud:
- More reliable and scalable
- Built-in security and monitoring
- Easy integration with the SDK

## 📚 Next Steps

1. **Add More Content**: Process educational YouTube videos
2. **Customize AI Models**: Fine-tune for your specific domain
3. **Enhance Search**: Add more sophisticated filtering
4. **Scale Up**: Use MindsDB Cloud for production
5. **Analytics**: Track search patterns and user behavior

## 🆘 Support

- **MindsDB Docs**: [docs.mindsdb.com](https://docs.mindsdb.com)
- **MindsDB Community**: [community.mindsdb.com](https://community.mindsdb.com)
- **GitHub Issues**: Create issues for bugs or feature requests

---

**Happy Learning with TubeTutor! 🎓**
