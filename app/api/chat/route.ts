import { NextRequest, NextResponse } from 'next/server'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatRequest {
  messages: ChatMessage[]
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  model?: string
  apiKey: string
  maxTokens?: number
  temperature?: number
}

// OpenAI API integration
async function callOpenAI(messages: ChatMessage[], apiKey: string, model = 'gpt-3.5-turbo', maxTokens = 1000, temperature = 0.7) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'OpenAI API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Anthropic Claude API integration
async function callAnthropic(messages: ChatMessage[], apiKey: string, model = 'claude-3-haiku-20240307', maxTokens = 1000) {
  const systemMessage = messages.find(msg => msg.role === 'system')
  const conversationMessages = messages.filter(msg => msg.role !== 'system')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemMessage?.content || 'You are a helpful AI assistant.',
      messages: conversationMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Anthropic API error')
  }

  const data = await response.json()
  return data.content[0].text
}

// Google Gemini API integration
async function callGoogle(messages: ChatMessage[], apiKey: string, model = 'gemini-pro', temperature = 0.7) {
  const contents = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: 1000,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Google API error')
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// Custom API integration (for other providers)
async function callCustomAPI(messages: ChatMessage[], apiKey: string, customEndpoint?: string) {
  // This is a placeholder for custom API integrations
  // Users can modify this function for their specific API
  if (!customEndpoint) {
    throw new Error('Custom endpoint required for custom provider')
  }

  const response = await fetch(customEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
    }),
  })

  if (!response.ok) {
    throw new Error('Custom API error')
  }

  const data = await response.json()
  return data.response || data.content || data.message
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, provider, model, apiKey, maxTokens = 1000, temperature = 0.7 } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    let responseContent: string

    switch (provider) {
      case 'openai':
        responseContent = await callOpenAI(messages, apiKey, model, maxTokens, temperature)
        break
      
      case 'anthropic':
        responseContent = await callAnthropic(messages, apiKey, model, maxTokens)
        break
      
      case 'google':
        responseContent = await callGoogle(messages, apiKey, model, temperature)
        break
      
      case 'custom':
        const customEndpoint = request.nextUrl.searchParams.get('endpoint')
        responseContent = await callCustomAPI(messages, apiKey, customEndpoint || undefined)
        break
      
      default:
        return NextResponse.json(
          { error: 'Unsupported provider' },
          { status: 400 }
        )
    }

    const responseMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date()
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      usage: {
        provider,
        model: model || 'default',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Chat API',
    supportedProviders: ['openai', 'anthropic', 'google', 'custom'],
    endpoints: {
      chat: 'POST /api/chat',
      example: {
        messages: [
          { role: 'user', content: 'Hello!' }
        ],
        provider: 'openai',
        apiKey: 'your-api-key',
        model: 'gpt-3.5-turbo'
      }
    }
  })
}
