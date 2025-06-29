# TubeTutor 🎓

An AI-powered semantic search tool that helps users find exact moments in educational YouTube videos. Skip the scrubbing and jump straight to the content you need!

## ✨ Features

- **Semantic Search**: Find video moments using natural language queries
- **Smart Filtering**: Filter by difficulty level, topic, and language
- **Direct Video Links**: Jump to exact timestamps in YouTube videos
- **Modern UI**: Clean, responsive design with smooth animations
- **Authentication**: Secure sign-in with demo mode available
- **AI-Powered**: Uses MindsDB for intelligent content matching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MindsDB instance (local or cloud)
- YouTube Data API key
- Firebase project (optional, for production auth)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/tubetutor.git
   cd tubetutor
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Fill in your API keys in `.env`:
   - `YOUTUBE_API_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com/)
   - `MINDSDB_API_URL`: Your MindsDB instance URL
   - Firebase config (optional for demo)

4. **Set up MindsDB**
   \`\`\`bash
   # Run the MindsDB setup script
   npm run setup:mindsdb
   \`\`\`

5. **Process sample videos**
   \`\`\`bash
   # Add educational videos to the knowledge base
   npm run process:videos
   \`\`\`

6. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context + hooks

### Backend (API Routes)
- **Search API**: Handles semantic queries to MindsDB
- **YouTube API**: Fetches video metadata and transcripts
- **MindsDB API**: Manages knowledge base operations

### AI & Data (MindsDB)
- **Knowledge Base**: `eduvideos_kb` with ChromaDB
- **Semantic Search**: Vector-based content matching
- **AI Agents**: Conversational query handling
- **Automated Jobs**: Periodic content updates

## 📊 MindsDB Schema

\`\`\`sql
-- Knowledge Base Structure
CREATE KNOWLEDGE_BASE eduvideos_kb
WITH metadata_columns = [
  'video_id',
  'channel_name', 
  'topic',
  'difficulty_level',
  'duration',
  'language',
  'view_count'
];
\`\`\`

## 🔧 Configuration

### YouTube Data API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add the key to your `.env` file

### MindsDB Setup

1. **Local Installation**:
   \`\`\`bash
   pip install mindsdb
   mindsdb --api http
   \`\`\`

2. **Cloud**: Sign up at [MindsDB Cloud](https://cloud.mindsdb.com/)

3. **Run setup script**:
   \`\`\`bash
   node scripts/setup-mindsdb.js
   \`\`\`

## 🎯 Usage Examples

### Basic Search
\`\`\`
"explain recursion with tree examples"
\`\`\`

### Advanced Queries
\`\`\`
"JavaScript promises and async/await for beginners"
"calculus derivatives step by step"
"machine learning linear regression"
\`\`\`

### Filters
- **Difficulty**: Beginner, Intermediate, Advanced
- **Topic**: Programming, Mathematics, Science, Business
- **Language**: English, Spanish, French

## 🛠️ Development

### Project Structure
\`\`\`
tubetutor/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── hooks/                 # Custom hooks
├── scripts/               # Setup and processing scripts
├── .env.example          # Environment template
└── README.md
\`\`\`

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run setup:mindsdb # Set up MindsDB knowledge base
npm run process:videos # Process YouTube videos
\`\`\`

### Adding New Videos

1. **Manual**: Add video IDs to `scripts/youtube-processor.js`
2. **Automated**: Set up the MindsDB job to crawl channels
3. **API**: Use the `/api/youtube` endpoint

## 🔒 Authentication

### Demo Mode
- Click "Try Demo" for instant access
- No registration required
- Full functionality available

### Production Auth
- Firebase Authentication
- Email/password sign-up
- Secure session management

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Environment Variables
Set these in your deployment platform:
- `YOUTUBE_API_KEY`
- `MINDSDB_API_URL`
- `NEXTAUTH_SECRET`
- Firebase config (if using)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tubetutor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tubetutor/discussions)
- **Email**: support@tubetutor.com

## 🙏 Acknowledgments

- [MindsDB](https://mindsdb.com/) for AI/ML capabilities
- [YouTube Data API](https://developers.google.com/youtube/v3) for video data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Vercel](https://vercel.com/) for hosting platform

---

**Built with ❤️ for learners everywhere**
