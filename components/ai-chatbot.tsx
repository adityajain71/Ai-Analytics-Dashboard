"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Settings, Key, MessageSquare, Loader2, Copy, Trash2, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { ChatMessage } from '@/app/api/chat/route'

interface ChatSettings {
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  customEndpoint?: string
}

const providerModels = {
  openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
  anthropic: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  google: ['gemini-pro', 'gemini-pro-vision'],
  custom: ['custom-model']
}

export function AIChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const [settings, setSettings] = useState<ChatSettings>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful AI assistant for ADmyBRAND dashboard. You can help with digital marketing campaigns, analytics, and reporting questions.',
    customEndpoint: ''
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || !settings.apiKey) {
      if (!settings.apiKey) {
        toast({
          title: "API Key Required",
          description: "Please configure your API key in settings first.",
          variant: "destructive"
        })
      }
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const messagesToSend = [
        {
          id: 'system',
          role: 'system' as const,
          content: settings.systemPrompt,
          timestamp: new Date()
        },
        ...messages,
        userMessage
      ]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
          maxTokens: settings.maxTokens,
          temperature: settings.temperature
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages(prev => [...prev, data.message])
      
    } catch (error) {
      console.error('Chat error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    })
  }

  const clearChat = () => {
    setMessages([])
    toast({
      title: "Chat Cleared",
      description: "All messages have been removed",
    })
  }

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      provider: settings.provider,
      model: settings.model,
      messages: messages
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Chat Exported",
      description: "Chat history has been downloaded",
    })
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-accent-pink to-accent-blue rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Assistant
                <Badge variant="secondary" className="text-xs">
                  {settings.provider} • {settings.model}
                </Badge>
              </CardTitle>
              <CardDescription>
                Powered by {settings.provider.toUpperCase()} - Ask me anything about your campaigns!
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportChat} disabled={messages.length === 0}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={clearChat} disabled={messages.length === 0}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>AI Chat Settings</DialogTitle>
                  <DialogDescription>
                    Configure your AI provider and preferences
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">AI Provider</Label>
                    <Select 
                      value={settings.provider} 
                      onValueChange={(value: ChatSettings['provider']) => setSettings(prev => ({ 
                        ...prev, 
                        provider: value,
                        model: providerModels[value][0]
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                        <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                        <SelectItem value="google">Google (Gemini)</SelectItem>
                        <SelectItem value="custom">Custom API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select 
                      value={settings.model} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, model: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {providerModels[settings.provider].map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Key className="h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter your API key"
                        value={settings.apiKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      />
                    </div>
                  </div>

                  {settings.provider === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="endpoint">Custom Endpoint</Label>
                      <Input
                        placeholder="https://api.your-provider.com/chat"
                        value={settings.customEndpoint}
                        onChange={(e) => setSettings(prev => ({ ...prev, customEndpoint: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        type="number"
                        min="100"
                        max="4000"
                        value={settings.maxTokens}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea
                      placeholder="You are a helpful assistant..."
                      value={settings.systemPrompt}
                      onChange={(e) => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={() => setShowSettings(false)}>Save Settings</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with your AI assistant!</p>
                <p className="text-sm mt-2">Ask about campaigns, analytics, or anything else.</p>
              </div>
            )}
            
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="p-2 bg-gradient-to-r from-accent-pink to-accent-blue rounded-full">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-accent-pink text-white ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="p-2 bg-accent-pink rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="p-2 bg-gradient-to-r from-accent-pink to-accent-blue rounded-full">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              rows={1}
              className="resize-none"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim() || !settings.apiKey}
              className="bg-accent-pink hover:bg-accent-pink/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!settings.apiKey && (
            <p className="text-sm text-muted-foreground mt-2">
              Configure your API key in settings to start chatting
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
