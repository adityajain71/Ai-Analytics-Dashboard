"use client"

import { AIChatBot } from '@/components/ai-chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Key, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent-pink/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-accent-pink to-accent-blue rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-pink to-accent-blue bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your favorite AI model and get intelligent insights about your campaigns, analytics, and marketing performance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent-pink" />
                  Multiple AI Providers
                </CardTitle>
                <CardDescription>
                  Support for OpenAI, Anthropic, Google, and custom APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">OpenAI</Badge>
                  <span className="text-sm text-muted-foreground">GPT-3.5, GPT-4</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Anthropic</Badge>
                  <span className="text-sm text-muted-foreground">Claude 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Google</Badge>
                  <span className="text-sm text-muted-foreground">Gemini Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Custom</Badge>
                  <span className="text-sm text-muted-foreground">Your own API</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Your API keys and conversations stay secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  API keys stored locally
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  No data retention
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Direct API communication
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-500" />
                  How to Get Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">1. Get an API Key</p>
                  <p className="text-muted-foreground">Sign up with your preferred AI provider</p>
                </div>
                <div>
                  <p className="font-medium">2. Configure Settings</p>
                  <p className="text-muted-foreground">Click the settings icon to add your API key</p>
                </div>
                <div>
                  <p className="font-medium">3. Start Chatting</p>
                  <p className="text-muted-foreground">Ask about campaigns, analytics, or anything else!</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AIChatBot />
          </motion.div>
        </div>

        {/* API Key Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>API Key Setup Instructions</CardTitle>
              <CardDescription>
                Choose your preferred AI provider and follow the setup instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Badge variant="outline">OpenAI</Badge>
                    GPT Models
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    1. Visit <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:underline">platform.openai.com</a><br/>
                    2. Create an account or sign in<br/>
                    3. Go to API Keys section<br/>
                    4. Create a new secret key<br/>
                    5. Copy and paste it in settings
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Badge variant="outline">Anthropic</Badge>
                    Claude Models
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    1. Visit <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:underline">console.anthropic.com</a><br/>
                    2. Create an account<br/>
                    3. Navigate to API Keys<br/>
                    4. Generate a new key<br/>
                    5. Add it to the chatbot settings
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Badge variant="outline">Google</Badge>
                    Gemini Models
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    1. Go to <a href="https://makersuite.google.com" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:underline">makersuite.google.com</a><br/>
                    2. Sign in with Google account<br/>
                    3. Get an API key<br/>
                    4. Enable Gemini API<br/>
                    5. Configure in chatbot settings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
