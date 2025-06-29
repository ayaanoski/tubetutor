"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Play, Clock, Eye, Filter, Sparkles, ArrowLeft, Zap, BookOpen, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"

interface SearchResult {
  video_id: string
  title: string
  channel_name: string
  transcript_snippet: string
  start_time: number
  thumbnail: string
  duration: string
  view_count: string
  difficulty_level: string
  topic: string
  language: string
  relevance_score: number
}

const quickSearches = [
  "JavaScript promises and async/await",
  "Python data structures explained",
  "Machine learning basics",
  "React hooks tutorial",
  "SQL joins with examples",
  "Calculus derivatives step by step",
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [filters, setFilters] = useState({
    difficulty: "all",
    topic: "all",
    language: "all",
  })
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query
    if (!queryToSearch.trim()) return

    setLoading(true)
    setSearchPerformed(true)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToSearch, filters }),
      })

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getYouTubeUrl = (videoId: string, startTime: number) => {
    return `https://youtube.com/watch?v=${videoId}&t=${startTime}s`
  }

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    handleSearch(searchTerm)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                asChild
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-200"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    TubeTutor
                  </h1>
                  <p className="text-xs text-gray-400 -mt-1">Search Mode</p>
                </div>
              </div>
            </div>

            {/* Search Stats */}
            <div className="hidden lg:flex items-center space-x-6 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300">MindsDB Connected</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="text-sm text-gray-300">
                <span className="text-blue-400 font-semibold">10K+</span> Videos Ready
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.isDemo ? "Demo User" : "Premium"}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={signOut}
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-4 py-2 transition-all duration-200"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                What do you want to
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  learn today?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Ask any question and find the exact moment in educational videos that has your answer
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col space-y-6">
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <Input
                      placeholder="Ask anything... e.g., 'explain recursion with a tree example'"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/20"
                    />
                  </div>
                  <Button
                    onClick={() => handleSearch()}
                    disabled={loading || !query.trim()}
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Searches */}
                {!searchPerformed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <div className="text-sm text-gray-400 mb-3">Try these popular searches:</div>
                    <div className="flex flex-wrap gap-2">
                      {quickSearches.map((search, index) => (
                        <motion.button
                          key={search}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          onClick={() => handleQuickSearch(search)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/30"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Filters */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                  </Button>

                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      10K+ Videos
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      AI-Powered
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10"
                    >
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Difficulty Level</label>
                        <Select
                          value={filters.difficulty}
                          onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="All Levels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Topic</label>
                        <Select
                          value={filters.topic}
                          onValueChange={(value) => setFilters({ ...filters, topic: value })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="All Topics" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Topics</SelectItem>
                            <SelectItem value="programming">Programming</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Language</label>
                        <Select
                          value={filters.language}
                          onValueChange={(value) => setFilters({ ...filters, language: value })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="All Languages" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Languages</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">Found {results.length} relevant moments</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI-Powered Results
                </Badge>
              </div>

              {results.map((result, index) => (
                <motion.div
                  key={`${result.video_id}-${result.start_time}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/10 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          <div className="relative group">
                            <img
                              src={result.thumbnail || "/placeholder.svg?height=180&width=320"}
                              alt={result.title}
                              className="w-full lg:w-80 h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-3 py-1 rounded-full">
                              {formatTime(result.start_time)}
                            </div>
                            <div className="absolute top-3 left-3 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full">
                              {Math.round(result.relevance_score * 100)}% match
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white line-clamp-2 mb-2">{result.title}</h4>
                            <p className="text-blue-400 font-medium">{result.channel_name}</p>
                          </div>

                          <p className="text-gray-300 line-clamp-3 leading-relaxed">{result.transcript_snippet}</p>

                          <div className="flex flex-wrap items-center gap-3">
                            <Badge
                              variant="secondary"
                              className={`${
                                result.difficulty_level === "beginner"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : result.difficulty_level === "intermediate"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}
                            >
                              {result.difficulty_level}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                            >
                              {result.topic}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-400 space-x-4">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {result.view_count}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {result.duration}
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={() => window.open(getYouTubeUrl(result.video_id, result.start_time), "_blank")}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch at {formatTime(result.start_time)}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && results.length === 0 && searchPerformed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No results found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search query or filters. Make sure to use descriptive terms.
            </p>
            <Button
              onClick={() => {
                setQuery("")
                setResults([])
                setSearchPerformed(false)
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Start New Search
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="w-12 h-12 text-blue-400" />
              </motion.div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Searching through thousands of videos...</h3>
            <p className="text-gray-400">Our AI is finding the perfect moments for your query</p>
          </motion.div>
        )}
      </main>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
