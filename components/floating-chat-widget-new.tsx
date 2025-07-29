'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send, Bot, User, HelpCircle, ArrowLeft, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  showOptions?: boolean
  feedback?: 'helpful' | 'not-helpful' | null
}

interface ConversationOption {
  text: string
  action: string
  icon?: React.ReactNode
}

// FAQ Database with enhanced responses and follow-up options
const faqDatabase = [
  {
    keywords: ['hello', 'hi', 'hey', 'start', 'help'],
    response: "Hello! 👋 I'm your support assistant. I'm here to help you with everything related to your analytics dashboard.",
    followUp: [
      { text: "📊 View Analytics Features", action: "analytics" },
      { text: "💰 Pricing Information", action: "pricing" },
      { text: "🔧 Technical Support", action: "technical" },
      { text: "📞 Contact Human Agent", action: "contact" }
    ]
  },
  {
    keywords: ['analytics', 'report', 'data', 'metrics', 'statistics'],
    response: "Our analytics dashboard provides comprehensive insights:\n\n📈 **Real-time Metrics**\n• Performance tracking\n• Campaign analytics\n• Revenue monitoring\n\n📊 **Custom Reports**\n• Export in JSON, CSV, PDF\n• Scheduled reports\n• Advanced filtering\n\n🎯 **Traffic Analysis**\n• Source breakdown\n• Device analytics\n• User behavior tracking",
    followUp: [
      { text: "How to generate reports?", action: "reports-guide" },
      { text: "Setting up dashboards", action: "dashboard-setup" },
      { text: "Data export options", action: "export-help" },
      { text: "Back to main menu", action: "main-menu" }
    ]
  },
  {
    keywords: ['pricing', 'cost', 'price', 'plan', 'billing', 'payment'],
    response: "💰 **Our Pricing Plans**\n\n🌟 **Starter Plan - $29/month**\n• Basic analytics\n• 10,000 page views\n• Email support\n\n⭐ **Professional - $79/month**\n• Advanced features\n• 100,000 page views\n• Priority support\n• Custom reports\n\n🚀 **Enterprise - $199/month**\n• Full feature suite\n• Unlimited page views\n• Dedicated support\n• API access\n• White-label options",
    followUp: [
      { text: "Compare plan features", action: "compare-plans" },
      { text: "Billing questions", action: "billing-help" },
      { text: "Upgrade my account", action: "upgrade" },
      { text: "Contact sales team", action: "sales" }
    ]
  },
  {
    keywords: ['account', 'settings', 'profile', 'password', 'login'],
    response: "🔧 **Account Management Guide**\n\n👤 **Profile Settings**\n• Update personal information\n• Change password\n• Email preferences\n\n🔐 **Security**\n• Two-factor authentication\n• API key management\n• Login activity\n\n📧 **Notifications**\n• Email alerts\n• Report schedules\n• System updates",
    followUp: [
      { text: "Reset password", action: "password-reset" },
      { text: "Setup 2FA", action: "2fa-setup" },
      { text: "Manage notifications", action: "notifications" },
      { text: "API documentation", action: "api-docs" }
    ]
  },
  {
    keywords: ['technical', 'bug', 'error', 'issue', 'problem', 'not working'],
    response: "🔧 **Technical Support**\n\n🚨 **Quick Fixes**\n• Clear browser cache\n• Refresh the page\n• Check internet connection\n• Try incognito mode\n\n🛠️ **Common Issues**\n• Dashboard not loading\n• Data not updating\n• Export problems\n• Login difficulties\n\nIf issues persist, our technical team is here to help!",
    followUp: [
      { text: "Report a bug", action: "bug-report" },
      { text: "Performance issues", action: "performance" },
      { text: "Browser compatibility", action: "browser-help" },
      { text: "Contact tech support", action: "tech-support" }
    ]
  },
  {
    keywords: ['features', 'how to', 'tutorial', 'guide', 'usage'],
    response: "📚 **Feature Guides**\n\n🎯 **Key Features**\n• Real-time dashboard\n• Custom report builder\n• Campaign tracking\n• Data visualization\n• API integration\n\n📖 **Learning Resources**\n• Video tutorials\n• Step-by-step guides\n• Best practices\n• Use case examples",
    followUp: [
      { text: "Watch tutorials", action: "tutorials" },
      { text: "Feature walkthrough", action: "walkthrough" },
      { text: "Best practices", action: "best-practices" },
      { text: "Advanced features", action: "advanced" }
    ]
  },
  {
    keywords: ['contact', 'support', 'email', 'phone', 'human'],
    response: "📞 **Get In Touch**\n\n💬 **Live Support**\n• Chat: Available 9 AM - 6 PM EST\n• Response time: < 5 minutes\n\n📧 **Email Support**\n• support@admybrand.com\n• Response time: < 2 hours\n\n📱 **Phone Support**\n• +1 (555) 123-4567\n• Available 24/7 for emergencies",
    followUp: [
      { text: "Start live chat", action: "live-chat" },
      { text: "Send email", action: "email-support" },
      { text: "Schedule callback", action: "callback" },
      { text: "Emergency support", action: "emergency" }
    ]
  },
  {
    keywords: ['integration', 'api', 'connect', 'sync', 'webhook'],
    response: "🔌 **Integration Options**\n\n⚡ **API Access**\n• RESTful API\n• Real-time webhooks\n• SDK libraries\n• Comprehensive docs\n\n🔗 **Popular Integrations**\n• Google Analytics\n• Facebook Ads\n• Zapier (500+ apps)\n• Slack notifications\n• Custom solutions",
    followUp: [
      { text: "API documentation", action: "api-docs" },
      { text: "Integration examples", action: "integration-examples" },
      { text: "Webhook setup", action: "webhook-help" },
      { text: "Custom integration", action: "custom-integration" }
    ]
  }
]

const conversationStarters = [
  { text: "🚀 Getting Started Guide", action: "getting-started" },
  { text: "📊 Analytics Features", action: "analytics" },
  { text: "💰 Pricing & Plans", action: "pricing" },
  { text: "🔧 Technical Support", action: "technical" },
  { text: "📞 Contact Support", action: "contact" },
  { text: "👋 Close chat", action: "end-chat" }
]

const helpfulResponses = [
  "Was this helpful?",
  "Did this answer your question?",
  "Do you need more information about this?",
  "Would you like me to explain anything else?"
]

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! 👋 Welcome to ADmyBRAND Support. I\'m here to help you with anything you need.',
      timestamp: new Date(),
      showOptions: true
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [conversationMode, setConversationMode] = useState<'welcome' | 'chatting'>('welcome')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const findBestResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Find matching FAQ entries
    const matches = faqDatabase.filter(faq =>
      faq.keywords.some(keyword => lowerMessage.includes(keyword))
    )

    if (matches.length > 0) {
      return matches[0]
    }

    // Default response for unmatched queries
    return {
      response: "I understand you're looking for help! 🤔 Let me connect you with the right information.",
      followUp: [
        { text: "📊 Analytics & Reports", action: "analytics" },
        { text: "💰 Pricing & Billing", action: "pricing" },
        { text: "🔧 Technical Support", action: "technical" },
        { text: "📞 Contact Human Agent", action: "contact" }
      ]
    }
  }

  const handleOptionClick = (action: string) => {
    let response = ''
    let followUp: ConversationOption[] = []

    switch (action) {
      case 'main-menu':
        response = "🏠 **Main Menu** - What would you like to help you with?"
        followUp = conversationStarters
        break
      case 'getting-started':
        response = "🚀 **Getting Started Guide**\n\n1️⃣ Set up your dashboard\n2️⃣ Connect your data sources\n3️⃣ Create your first report\n4️⃣ Explore analytics features\n\nWould you like detailed steps for any of these?"
        followUp = [
          { text: "Dashboard setup", action: "dashboard-setup" },
          { text: "Connect data sources", action: "data-sources" },
          { text: "Create first report", action: "first-report" },
          { text: "Back to main menu", action: "main-menu" }
        ]
        break
      case 'more-help':
        response = "💡 **Need More Help?**\n\nI'm here to assist you further! What else can I help you with?"
        followUp = [
          { text: "Different question", action: "main-menu" },
          { text: "Talk to human agent", action: "contact" },
          { text: "Browse all topics", action: "browse-topics" },
          { text: "👋 Close chat", action: "end-chat" }
        ]
        break
      case 'end-chat':
        // Close the chat widget and minimize to floating button
        setIsOpen(false)
        // Reset conversation for next time
        setTimeout(() => {
          setMessages([{
            id: '1',
            role: 'assistant',
            content: 'Hello! 👋 Welcome to ADmyBRAND Support. I\'m here to help you with anything you need.',
            timestamp: new Date(),
            showOptions: true
          }])
          setConversationMode('welcome')
          setShowQuickReplies(true)
          setInputValue('')
        }, 300)
        return
      case 'restart':
        setMessages([{
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Hello! 👋 Welcome back to ADmyBRAND Support. How can I help you today?',
          timestamp: new Date(),
          showOptions: true
        }])
        setConversationMode('welcome')
        setShowQuickReplies(true)
        return
      default:
        // Handle other predefined actions by finding FAQ response
        const faqMatch = faqDatabase.find(faq => faq.keywords.includes(action))
        if (faqMatch) {
          response = faqMatch.response
          followUp = faqMatch.followUp || []
        } else {
          response = "I'm still learning about that topic. Let me connect you with our support team for detailed assistance."
          followUp = [
            { text: "Contact support", action: "contact" },
            { text: "Back to main menu", action: "main-menu" }
          ]
        }
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      showOptions: followUp.length > 0
    }

    setMessages(prev => [...prev, assistantMessage])
    setShowQuickReplies(false)
    setConversationMode('chatting')
  }

  const sendMessage = (message?: string) => {
    const messageText = message || inputValue.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setShowQuickReplies(false)
    setConversationMode('chatting')

    // Simulate a small delay for more natural feel
    setTimeout(() => {
      const faqMatch = findBestResponse(messageText)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: faqMatch.response,
        timestamp: new Date(),
        showOptions: true
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  const provideFeedback = (messageId: string, feedback: 'helpful' | 'not-helpful') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ))

    // Add follow-up message based on feedback
    setTimeout(() => {
      const followUpMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: feedback === 'helpful' 
          ? "Great! 😊 Is there anything else I can help you with?"
          : "I'm sorry that wasn't helpful. 😔 Let me try a different approach or connect you with a human agent.",
        timestamp: new Date(),
        showOptions: true
      }
      setMessages(prev => [...prev, followUpMessage])
    }, 500)
  }

  const resetConversation = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! 👋 Welcome to ADmyBRAND Support. I\'m here to help you with anything you need.',
      timestamp: new Date(),
      showOptions: true
    }])
    setConversationMode('welcome')
    setShowQuickReplies(true)
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[420px] h-[600px] shadow-2xl border-2 border-gradient-to-r from-blue-500 to-purple-600 z-50 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              ADmyBRAND Support
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-0">
                🟢 Online
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {messages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetConversation}
                  className="h-8 w-8 text-white hover:bg-white/20"
                  title="Start new conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-b from-gray-50 to-white">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    <div
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-xl p-4 shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-md">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Follow-up options for assistant messages */}
                    {message.role === 'assistant' && message.showOptions && (
                      <div className="ml-11 space-y-2">
                        {/* Feedback buttons */}
                        {!message.feedback && conversationMode === 'chatting' && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-gray-500">Was this helpful?</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => provideFeedback(message.id, 'helpful')}
                              className="h-6 px-2 text-xs border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Yes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => provideFeedback(message.id, 'not-helpful')}
                              className="h-6 px-2 text-xs border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              No
                            </Button>
                          </div>
                        )}

                        {/* Conversation options */}
                        {conversationMode === 'welcome' && (
                          <div className="grid grid-cols-1 gap-2">
                            {conversationStarters.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptionClick(option.action)}
                                className="justify-start text-left h-auto py-3 px-4 bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                              >
                                {option.text}
                              </Button>
                            ))}
                          </div>
                        )}

                        {conversationMode === 'chatting' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptionClick('more-help')}
                                className="justify-start text-left h-auto py-2 px-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700"
                              >
                                💡 Do you have any other questions?
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptionClick('contact')}
                                className="justify-start text-left h-auto py-2 px-3 bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 border-green-200 text-green-700"
                              >
                                📞 Talk to a human agent
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptionClick('end-chat')}
                                className="justify-start text-left h-auto py-2 px-3 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200 text-gray-700"
                              >
                                👋 Close chat
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Input Area */}
            <div className="p-4 bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Tip: Use the quick options above or type your question
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default FloatingChatWidget
