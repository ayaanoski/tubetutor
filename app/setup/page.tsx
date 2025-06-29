"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Play, Settings, Brain, Bot, AlertTriangle } from "lucide-react"

interface SetupStep {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "success" | "error"
  error?: string
  optional?: boolean
}

export default function SetupPage() {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: "check_connection",
      title: "Test MindsDB SDK Connection",
      description: "Verify connection to MindsDB using JavaScript SDK",
      status: "pending",
    },
    {
      id: "create_knowledge_base",
      title: "Create Knowledge Base",
      description: "Set up eduvideos_kb knowledge base with ChromaDB",
      status: "pending",
    },
    {
      id: "setup_initial_data",
      title: "Load Sample Data",
      description: "Insert sample educational content for testing",
      status: "pending",
    },
    {
      id: "create_ai_model",
      title: "Create AI Model",
      description: "Set up semantic search AI model",
      status: "pending",
      optional: true,
    },
    {
      id: "create_agent",
      title: "Create AI Agent",
      description: "Set up conversational AI agent",
      status: "pending",
      optional: true,
    },
  ])

  const [connectionDetails, setConnectionDetails] = useState<any>(null)

  const updateStepStatus = (stepId: string, status: SetupStep["status"], error?: string) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, error } : step)))
  }

  const runSetupStep = async (stepId: string) => {
    updateStepStatus(stepId, "running")

    try {
      const response = await fetch("/api/mindsdb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: stepId }),
      })

      const result = await response.json()

      if (stepId === "check_connection" && result.details) {
        setConnectionDetails(result.details)
      }

      if (result.success) {
        updateStepStatus(stepId, "success")
      } else {
        updateStepStatus(stepId, "error", result.message || result.error || "Operation failed")
      }
    } catch (error) {
      updateStepStatus(stepId, "error", error instanceof Error ? error.message : "Unknown error")
    }
  }

  const runAllSteps = async () => {
    for (const step of steps) {
      await runSetupStep(step.id)
      // Add small delay between steps
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const getStatusIcon = (status: SetupStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusBadge = (status: SetupStep["status"], optional?: boolean) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return (
          <Badge className={optional ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
            {optional ? "Optional" : "Error"}
          </Badge>
        )
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "check_connection":
        return <Database className="w-5 h-5" />
      case "create_knowledge_base":
        return <Database className="w-5 h-5" />
      case "setup_initial_data":
        return <Play className="w-5 h-5" />
      case "create_ai_model":
        return <Brain className="w-5 h-5" />
      case "create_agent":
        return <Bot className="w-5 h-5" />
      default:
        return <Settings className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TubeTutor Setup
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Configure your TubeTutor installation using the official MindsDB JavaScript SDK
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Database className="w-5 h-5" />
              <span>MindsDB Connection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-400">Host:</span>
                <p className="font-mono text-white">{connectionDetails?.config?.host || "localhost"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-400">Port:</span>
                <p className="font-mono text-white">{connectionDetails?.config?.port || "47334"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-400">User:</span>
                <p className="font-mono text-white">{connectionDetails?.config?.user || "mindsdb"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-400">Status:</span>
                <p className={connectionDetails?.connected ? "text-green-400" : "text-red-400"}>
                  {connectionDetails?.connected ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
            {connectionDetails?.attempts > 0 && (
              <div className="mt-4 text-sm text-gray-400">Connection attempts: {connectionDetails.attempts}</div>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-8 bg-yellow-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Troubleshooting</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-yellow-300">
              <p>If connection fails, check:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>MindsDB is running on localhost:47334</li>
                <li>
                  Run: <code className="bg-black/20 px-2 py-1 rounded">docker run -p 47334:47334 mindsdb/mindsdb</code>
                </li>
                <li>
                  Or: <code className="bg-black/20 px-2 py-1 rounded">pip install mindsdb && mindsdb --api http</code>
                </li>
                <li>Check firewall settings</li>
                <li>Verify .env configuration</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Setup Steps</span>
              </div>
              <Button onClick={runAllSteps} className="bg-blue-600 text-white hover:bg-blue-700">
                Run All Steps
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-400">{index + 1}.</span>
                      {getStatusIcon(step.status)}
                      {getStepIcon(step.id)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{step.title}</h3>
                        {step.optional && (
                          <Badge variant="outline" className="text-xs">
                            Optional
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{step.description}</p>
                      {step.error && (
                        <p className={`text-sm mt-1 ${step.optional ? "text-yellow-400" : "text-red-400"}`}>
                          {step.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(step.status, step.optional)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSetupStep(step.id)}
                      disabled={step.status === "running"}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {step.status === "running" ? "Running..." : "Run"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-300">
              <p>✅ Once the connection is established:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Knowledge base and sample data will be set up automatically</li>
                <li>AI model and agent creation are optional enhancements</li>
                <li>Search functionality works with mock data even if MindsDB fails</li>
                <li>You can start searching immediately</li>
              </ul>
            </div>
            <div className="mt-4 space-x-4">
              <Button asChild className="bg-green-600 text-white hover:bg-green-700">
                <a href="/search">Go to Search</a>
              </Button>
              <Button asChild variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
