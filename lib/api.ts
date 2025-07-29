// API utility functions for the frontend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : '/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
}

export interface MetricsData {
  totalRevenue: number
  activeUsers: number
  conversionRate: number
  campaignROI: number
  lastUpdated: string
}

export interface RevenueData {
  month: string
  revenue: number
  target: number
}

export interface Campaign {
  id: number
  name: string
  status: 'Active' | 'Paused' | 'Completed'
  budget: number
  spent: number
  conversions: number
  roi: number
  createdAt: string
  updatedAt: string
}

// Generic API caller with error handling
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Analytics API functions
export const analyticsApi = {
  // Get all analytics data
  getAll: () => apiCall<{
    metrics: MetricsData
    revenue: RevenueData[]
    campaigns: Campaign[]
  }>('/analytics'),

  // Get specific metrics
  getMetrics: () => apiCall<MetricsData>('/analytics?type=metrics'),

  // Get revenue data
  getRevenue: () => apiCall<RevenueData[]>('/analytics?type=revenue'),

  // Get campaigns for analytics
  getCampaigns: () => apiCall<Campaign[]>('/analytics?type=campaigns'),

  // Post analytics event
  trackEvent: (eventData: any) => apiCall('/analytics', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
}

// Campaigns API functions
export const campaignsApi = {
  // Get all campaigns
  getAll: (status?: string) => apiCall<Campaign[]>(
    `/campaigns${status ? `?status=${status}` : ''}`
  ),

  // Get single campaign
  getById: (id: number) => apiCall<Campaign>(`/campaigns/${id}`),

  // Create new campaign
  create: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'spent' | 'conversions' | 'roi'>) => 
    apiCall<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    }),

  // Update campaign
  update: (id: number, campaignData: Partial<Campaign>) => 
    apiCall<Campaign>('/campaigns', {
      method: 'PUT',
      body: JSON.stringify({ id, ...campaignData }),
    }),

  // Delete campaign
  delete: (id: number) => apiCall<Campaign>(`/campaigns?id=${id}`, {
    method: 'DELETE',
  }),
}

// React hooks for data fetching
export const useApi = {
  // Custom hook for analytics data
  useAnalytics: () => {
    const [data, setData] = useState<MetricsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
      setLoading(true)
      const result = await analyticsApi.getMetrics()
      
      if (result.success && result.data) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to fetch analytics data')
      }
      
      setLoading(false)
    }

    return { data, loading, error, refetch: fetchData }
  },

  // Custom hook for campaigns data
  useCampaigns: (status?: string) => {
    const [data, setData] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
      setLoading(true)
      const result = await campaignsApi.getAll(status)
      
      if (result.success && result.data) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to fetch campaigns data')
      }
      
      setLoading(false)
    }

    return { data, loading, error, refetch: fetchData }
  }
}

// Import React if not already imported
import { useState } from 'react'
