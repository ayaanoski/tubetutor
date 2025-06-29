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

// Mock data for search results
const mockSearchResults: SearchResult[] = [
  {
    video_id: "PoRJizFvM7s",
    title: "Complete JavaScript Promises & Async/Await Tutorial - From Beginner to Advanced",
    channel_name: "Mosh Hamedani",
    transcript_snippet: "JavaScript promises are objects that represent the eventual completion or failure of an asynchronous operation. They provide a cleaner way to handle asynchronous code compared to callbacks. Let me show you how async and await work together to make your code more readable and maintainable.",
    start_time: 245,
    thumbnail: "https://img.youtube.com/vi/PoRJizFvM7s/maxresdefault.jpg",
    duration: "28:45",
    view_count: "1.2M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.95
  },
  {
    video_id: "W6NZfCO5SIk",
    title: "Python Data Structures: Lists, Dictionaries, and Sets Explained with Examples",
    channel_name: "Programming with Mosh",
    transcript_snippet: "Python offers several built-in data structures that are incredibly powerful. Lists are ordered collections that can hold different data types. Dictionaries store key-value pairs and are perfect for mapping relationships. Sets contain unique elements and are great for mathematical operations.",
    start_time: 180,
    thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
    duration: "35:20",
    view_count: "850K",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.92
  },
  {
    video_id: "aircAruvnKk",
    title: "Machine Learning Fundamentals: Understanding Algorithms and Applications",
    channel_name: "3Blue1Brown",
    transcript_snippet: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed. We'll explore supervised learning, unsupervised learning, and reinforcement learning with practical examples.",
    start_time: 320,
    thumbnail: "https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg",
    duration: "42:15",
    view_count: "2.1M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.88
  },
  {
    video_id: "O6P86uwfdR0",
    title: "React Hooks Deep Dive: useState, useEffect, and Custom Hooks",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "React hooks revolutionized how we write React components. useState manages local component state, useEffect handles side effects like API calls and subscriptions. Custom hooks let you extract and reuse stateful logic across components.",
    start_time: 150,
    thumbnail: "https://img.youtube.com/vi/O6P86uwfdR0/maxresdefault.jpg",
    duration: "31:30",
    view_count: "650K",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.94
  },
  {
    video_id: "9yeOJ0ZMUYw",
    title: "SQL Joins Mastery: INNER, LEFT, RIGHT, and FULL OUTER Joins with Real Examples",
    channel_name: "Programming with Mosh",
    transcript_snippet: "SQL joins are essential for combining data from multiple tables. INNER JOIN returns matching records from both tables. LEFT JOIN returns all records from the left table and matching records from the right. Let me demonstrate with a practical e-commerce database example.",
    start_time: 420,
    thumbnail: "https://img.youtube.com/vi/9yeOJ0ZMUYw/maxresdefault.jpg",
    duration: "26:40",
    view_count: "980K",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.91
  },
  {
    video_id: "WUvTyaaNkzM",
    title: "Calculus Made Easy: Understanding Derivatives Step by Step",
    channel_name: "3Blue1Brown",
    transcript_snippet: "A derivative represents the rate of change of a function at any given point. Think of it as the slope of a curve at a specific point. We'll start with the power rule, then move to more complex functions. The derivative of x squared is 2x, and here's why that makes perfect sense.",
    start_time: 280,
    thumbnail: "https://img.youtube.com/vi/WUvTyaaNkzM/maxresdefault.jpg",
    duration: "38:55",
    view_count: "1.5M",
    difficulty_level: "intermediate",
    topic: "mathematics",
    language: "english",
    relevance_score: 0.89
  },
  {
    video_id: "qz0aGYrrlhU",
    title: "Modern Web Development: HTML5, CSS3, and JavaScript ES6+ Features",
    channel_name: "Traversy Media",
    transcript_snippet: "Modern web development has evolved significantly. HTML5 semantic elements improve accessibility and SEO. CSS3 features like flexbox and grid make layouts easier. JavaScript ES6+ introduces arrow functions, destructuring, and modules that make code more concise and maintainable.",
    start_time: 195,
    thumbnail: "https://img.youtube.com/vi/qz0aGYrrlhU/maxresdefault.jpg",
    duration: "45:20",
    view_count: "1.8M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.86
  },
  {
    video_id: "RBSGKlAvoiM",
    title: "Data Structures and Algorithms: Trees, Graphs, and Sorting Algorithms",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Understanding data structures is crucial for efficient programming. Binary trees organize data hierarchically, graphs represent relationships between entities. Sorting algorithms like quicksort and mergesort have different time complexities. Let's analyze when to use each one.",
    start_time: 360,
    thumbnail: "https://img.youtube.com/vi/RBSGKlAvoiM/maxresdefault.jpg",
    duration: "52:10",
    view_count: "750K",
    difficulty_level: "advanced",
    topic: "programming",
    language: "english",
    relevance_score: 0.87
  },
  {
    video_id: "kKHmoZ24_yA",
    title: "Physics Fundamentals: Newton's Laws and Motion Explained Simply",
    channel_name: "Crash Course Physics",
    transcript_snippet: "Newton's first law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force. This is called inertia. The second law relates force, mass, and acceleration with F equals ma. The third law says every action has an equal and opposite reaction.",
    start_time: 210,
    thumbnail: "https://img.youtube.com/vi/kKHmoZ24_yA/maxresdefault.jpg",
    duration: "33:25",
    view_count: "2.3M",
    difficulty_level: "beginner",
    topic: "science",
    language: "english",
    relevance_score: 0.83
  },
  {
    video_id: "ZfYvTruaORU",
    title: "Business Strategy Fundamentals: Market Analysis and Competitive Advantage",
    channel_name: "Harvard Business Review",
    transcript_snippet: "Successful business strategy starts with understanding your market and competition. SWOT analysis helps identify strengths, weaknesses, opportunities, and threats. Porter's five forces framework analyzes industry competition. Creating sustainable competitive advantage requires differentiation and cost leadership.",
    start_time: 390,
    thumbnail: "https://img.youtube.com/vi/ZfYvTruaORU/maxresdefault.jpg",
    duration: "41:15",
    view_count: "890K",
    difficulty_level: "intermediate",
    topic: "business",
    language: "english",
    relevance_score: 0.79
  },
  // Additional 10 entries with real YouTube video IDs
  {
    video_id: "PkZNo7MFNFg",
    title: "Learn Python - Full Course for Beginners [Tutorial]",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "This course will give you a full introduction into all of the core concepts in Python. You'll learn about variables, data types, functions, classes, modules, and more. This tutorial is designed for beginners who have little to no programming experience.",
    start_time: 300,
    thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
    duration: "4:26:52",
    view_count: "31M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.98
  },
  {
    video_id: "uhWOHmRGqY4",
    title: "HTML Full Course - Build a Website Tutorial",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn HTML in this complete course for beginners. HTML is the standard markup language for Web pages. With HTML you can create your own website. This tutorial covers HTML basics, semantic elements, forms, tables, and modern HTML5 features.",
    start_time: 90,
    thumbnail: "https://img.youtube.com/vi/uhWOHmRGqY4/maxresdefault.jpg",
    duration: "2:12:41",
    view_count: "8.5M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.93
  },
  {
    video_id: "1Rs2ND1ryYc",
    title: "CSS Tutorial - Zero to Hero (Complete Course)",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn CSS from scratch in this complete tutorial. CSS is used to style HTML elements and create beautiful web layouts. We'll cover selectors, properties, flexbox, grid, animations, and responsive design principles to make your websites look professional.",
    start_time: 180,
    thumbnail: "https://img.youtube.com/vi/1Rs2ND1ryYc/maxresdefault.jpg",
    duration: "11:17:12",
    view_count: "4.8M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.91
  },
  {
    video_id: "Ke90Tje7VS0",
    title: "React Course - Beginner's Tutorial for React JavaScript Library [2022]",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn React in this comprehensive course. React is a popular JavaScript library for building user interfaces. You'll learn about components, props, state, hooks, event handling, and how to build modern web applications with React.",
    start_time: 240,
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
    duration: "11:55:27",
    view_count: "5.1M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.95
  },
  {
    video_id: "rfscVS0vtbw",
    title: "Learn Python - Full Course for Beginners",
    channel_name: "Programming with Mosh",
    transcript_snippet: "Python is one of the most popular programming languages and is widely used in web development, data science, and artificial intelligence. In this tutorial, you'll learn Python fundamentals including syntax, data structures, functions, and object-oriented programming.",
    start_time: 200,
    thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg",
    duration: "6:14:07",
    view_count: "15M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.97
  },
  {
    video_id: "2JYT5f2isg4",
    title: "Data Structures and Algorithms in Python - Full Course for Beginners",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn about data structures and algorithms in this comprehensive Python course. We'll cover arrays, linked lists, stacks, queues, trees, graphs, sorting algorithms, and searching algorithms. Understanding these concepts is essential for technical interviews.",
    start_time: 450,
    thumbnail: "https://img.youtube.com/vi/2JYT5f2isg4/maxresdefault.jpg",
    duration: "12:56:43",
    view_count: "2.9M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.89
  },
  {
    video_id: "EerdGm-ehJQ",
    title: "Introduction to Machine Learning Course - Complete Tutorial",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Machine learning is transforming every industry. This comprehensive course covers supervised and unsupervised learning, neural networks, deep learning, and practical applications. You'll work with real datasets and build predictive models using Python and popular ML libraries.",
    start_time: 380,
    thumbnail: "https://img.youtube.com/vi/EerdGm-ehJQ/maxresdefault.jpg",
    duration: "10:23:15",
    view_count: "1.7M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.92
  },
  {
    video_id: "8hly31xKli0",
    title: "Node.js and Express.js - Full Course for Beginners",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn Node.js and Express.js in this complete course. Node.js allows you to run JavaScript on the server side, while Express.js is a web framework that makes building APIs easier. You'll learn about routing, middleware, databases, authentication, and deployment.",
    start_time: 320,
    thumbnail: "https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg",
    duration: "8:16:48",
    view_count: "3.2M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.90
  },
  {
    video_id: "fBNz5xF-Kx4",
    title: "Git and GitHub for Beginners - Crash Course",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Git is a version control system that tracks changes in your code. GitHub is a platform for hosting Git repositories. This crash course covers basic Git commands, branching, merging, pull requests, and collaboration workflows that every developer needs to know.",
    start_time: 180,
    thumbnail: "https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg",
    duration: "1:08:47",
    view_count: "4.5M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.94
  },
  {
    video_id: "w7ejDZ8SWv8",
    title: "TypeScript Course for Beginners 2024 - Learn TypeScript from Scratch!",
    channel_name: "Traversy Media",
    transcript_snippet: "TypeScript is a superset of JavaScript that adds static typing to the language. It helps catch errors early and makes code more maintainable. In this course, you'll learn TypeScript fundamentals, interfaces, classes, generics, and how to use TypeScript in real projects.",
    start_time: 220,
    thumbnail: "https://img.youtube.com/vi/w7ejDZ8SWv8/maxresdefault.jpg",
    duration: "1:54:26",
    view_count: "2.8M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.93
  },
  {
    video_id: "W6NZfCO5SIk",
    title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
    channel_name: "Programming with Mosh",
    transcript_snippet: "JavaScript is the most popular programming language in the world. It's used to build interactive websites and web applications. In this tutorial, you'll learn the fundamentals of JavaScript including variables, functions, objects, arrays, and control structures.",
    start_time: 120,
    thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
    duration: "1:08:35",
    view_count: "6.2M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.96
  },
  {
    video_id: "PkZNo7MFNFg",
    title: "Learn Python - Full Course for Beginners [Tutorial]",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "This course will give you a full introduction into all of the core concepts in Python. You'll learn about variables, data types, functions, classes, modules, and more. This tutorial is designed for beginners who have little to no programming experience.",
    start_time: 300,
    thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
    duration: "4:26:52",
    view_count: "31M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.98
  },
  {
    video_id: "uhWOHmRGqY4",
    title: "HTML Full Course - Build a Website Tutorial",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn HTML in this complete course for beginners. HTML is the standard markup language for Web pages. With HTML you can create your own website. This tutorial covers HTML basics, semantic elements, forms, tables, and modern HTML5 features.",
    start_time: 90,
    thumbnail: "https://img.youtube.com/vi/uhWOHmRGqY4/maxresdefault.jpg",
    duration: "2:12:41",
    view_count: "8.5M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.93
  },
  {
    video_id: "1Rs2ND1ryYc",
    title: "CSS Tutorial - Zero to Hero (Complete Course)",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn CSS from scratch in this complete tutorial. CSS is used to style HTML elements and create beautiful web layouts. We'll cover selectors, properties, flexbox, grid, animations, and responsive design principles to make your websites look professional.",
    start_time: 180,
    thumbnail: "https://img.youtube.com/vi/1Rs2ND1ryYc/maxresdefault.jpg",
    duration: "11:17:12",
    view_count: "4.8M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.91
  },
  {
    video_id: "Ke90Tje7VS0",
    title: "React Course - Beginner's Tutorial for React JavaScript Library [2022]",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn React in this comprehensive course. React is a popular JavaScript library for building user interfaces. You'll learn about components, props, state, hooks, event handling, and how to build modern web applications with React.",
    start_time: 240,
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
    duration: "11:55:27",
    view_count: "5.1M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.95
  },
  {
    video_id: "rfscVS0vtbw",
    title: "Learn Python for Beginners - Python Tutorial",
    channel_name: "Programming with Mosh",
    transcript_snippet: "Python is one of the most popular programming languages and is widely used in web development, data science, and artificial intelligence. In this tutorial, you'll learn Python fundamentals including syntax, data structures, functions, and object-oriented programming.",
    start_time: 200,
    thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg",
    duration: "6:14:07",
    view_count: "15M",
    difficulty_level: "beginner",
    topic: "programming",
    language: "english",
    relevance_score: 0.97
  },
  {
    video_id: "2JYT5f2isg4",
    title: "Data Structures and Algorithms in Python - Full Course for Beginners",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn about data structures and algorithms in this comprehensive Python course. We'll cover arrays, linked lists, stacks, queues, trees, graphs, sorting algorithms, and searching algorithms. Understanding these concepts is essential for technical interviews.",
    start_time: 450,
    thumbnail: "https://img.youtube.com/vi/2JYT5f2isg4/maxresdefault.jpg",
    duration: "12:56:43",
    view_count: "2.9M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.89
  },
  {
    video_id: "EerdGm-ehJQ",
    title: "Introduction to Machine Learning Course - 2024 Edition",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Machine learning is transforming every industry. This comprehensive course covers supervised and unsupervised learning, neural networks, deep learning, and practical applications. You'll work with real datasets and build predictive models using Python and popular ML libraries.",
    start_time: 380,
    thumbnail: "https://img.youtube.com/vi/EerdGm-ehJQ/maxresdefault.jpg",
    duration: "10:23:15",
    view_count: "1.7M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.92
  },
  {
    video_id: "8hly31xKli0",
    title: "Node.js and Express.js - Full Course for Beginners",
    channel_name: "freeCodeCamp.org",
    transcript_snippet: "Learn Node.js and Express.js in this complete course. Node.js allows you to run JavaScript on the server side, while Express.js is a web framework that makes building APIs easier. You'll learn about routing, middleware, databases, authentication, and deployment.",
    start_time: 320,
    thumbnail: "https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg",
    duration: "8:16:48",
    view_count: "3.2M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.90
  },
  {
    video_id: "t_ispmWmdjY",
    title: "MongoDB Crash Course 2024 - Complete Tutorial",
    channel_name: "Traversy Media",
    transcript_snippet: "MongoDB is a popular NoSQL database used in modern web applications. This crash course covers document-based databases, collections, CRUD operations, indexing, aggregation, and how to integrate MongoDB with Node.js applications. Perfect for beginners and intermediate developers.",
    start_time: 150,
    thumbnail: "https://img.youtube.com/vi/t_ispmWmdjY/maxresdefault.jpg",
    duration: "2:32:47",
    view_count: "1.1M",
    difficulty_level: "intermediate",
    topic: "programming",
    language: "english",
    relevance_score: 0.88
  }
]

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

  // Mock search function that simulates API call with relevant results
  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query
    if (!queryToSearch.trim()) return

    setLoading(true)
    setSearchPerformed(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // Filter mock results based on search query
      let filteredResults = mockSearchResults.filter(result => {
        const searchLower = queryToSearch.toLowerCase()
        const titleMatch = result.title.toLowerCase().includes(searchLower)
        const snippetMatch = result.transcript_snippet.toLowerCase().includes(searchLower)
        const topicMatch = result.topic.toLowerCase().includes(searchLower)
        
        // Check for specific keywords
        const keywordMatches = [
          searchLower.includes('javascript') && result.title.toLowerCase().includes('javascript'),
          searchLower.includes('python') && result.title.toLowerCase().includes('python'),
          searchLower.includes('react') && result.title.toLowerCase().includes('react'),
          searchLower.includes('machine learning') && result.title.toLowerCase().includes('machine learning'),
          searchLower.includes('sql') && result.title.toLowerCase().includes('sql'),
          searchLower.includes('calculus') && result.title.toLowerCase().includes('calculus'),
          searchLower.includes('async') && result.title.toLowerCase().includes('async'),
          searchLower.includes('promises') && result.title.toLowerCase().includes('promises'),
          searchLower.includes('hooks') && result.title.toLowerCase().includes('hooks'),
          searchLower.includes('derivatives') && result.title.toLowerCase().includes('derivatives'),
          searchLower.includes('joins') && result.title.toLowerCase().includes('joins'),
          searchLower.includes('data structures') && result.title.toLowerCase().includes('data structures'),
        ].some(Boolean)

        return titleMatch || snippetMatch || topicMatch || keywordMatches
      })

      // Apply filters
      if (filters.difficulty !== "all") {
        filteredResults = filteredResults.filter(result => result.difficulty_level === filters.difficulty)
      }
      if (filters.topic !== "all") {
        filteredResults = filteredResults.filter(result => result.topic === filters.topic)
      }
      if (filters.language !== "all") {
        filteredResults = filteredResults.filter(result => result.language === filters.language)
      }

      // If no specific matches found, return a random subset of results
      if (filteredResults.length === 0) {
        filteredResults = mockSearchResults
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
          .map(result => ({
            ...result,
            relevance_score: Math.random() * 0.3 + 0.5 // Random score between 0.5-0.8
          }))
      }

      // Sort by relevance score
      filteredResults.sort((a, b) => b.relevance_score - a.relevance_score)

      setResults(filteredResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
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
                
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="text-sm text-gray-300">
                <span className="text-blue-400 font-semibold">10+</span> Sample Videos
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
                      10+ Videos
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
                  AI-Powered Search
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
                              src={result.thumbnail}
                              alt={result.title}
                              className="w-full lg:w-80 h-48 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/320x180/1a1a1a/ffffff?text=${encodeURIComponent(result.title.substring(0, 20))}`;
                              }}
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
            <h3 className="text-2xl font-semibold text-white mb-4">Searching through sample videos...</h3>
            <p className="text-gray-400">Our ai system is finding the perfect moments for your query</p>
          </motion.div>
        )}
      </main>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}