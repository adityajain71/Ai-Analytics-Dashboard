import { NextRequest, NextResponse } from 'next/server'

// Realistic Digital Marketing Agency Mock Data
const mockMetrics = {
  monthlyAdSpend: 847392,
  activeClients: 47,
  averageROAS: 4.2,
  totalCampaigns: 156,
  totalConversions: 18947,
  avgCPC: 2.34,
  avgCTR: 3.8,
  lastUpdated: new Date().toISOString()
}

const mockRevenueData = [
  { month: "Jan", adSpend: 720000, revenue: 3024000, roas: 4.2, leads: 15420 },
  { month: "Feb", adSpend: 780000, revenue: 3354000, roas: 4.3, leads: 16890 },
  { month: "Mar", adSpend: 650000, revenue: 2730000, roas: 4.2, leads: 14230 },
  { month: "Apr", adSpend: 890000, revenue: 3738000, roas: 4.2, leads: 19560 },
  { month: "May", adSpend: 760000, revenue: 3192000, roas: 4.2, leads: 16780 },
  { month: "Jun", adSpend: 950000, revenue: 3990000, roas: 4.2, leads: 21340 },
  { month: "Jul", adSpend: 847000, revenue: 3557400, roas: 4.2, leads: 18947 },
]

const mockTrafficSources = [
  { source: "Google Ads", spend: 356000, conversions: 7240, roas: 4.8, color: "#4285F4" },
  { source: "Facebook Ads", spend: 234000, conversions: 5180, roas: 4.1, color: "#1877F2" },
  { source: "Instagram Ads", spend: 145000, conversions: 3420, roas: 3.9, color: "#E4405F" },
  { source: "LinkedIn Ads", spend: 78000, conversions: 890, roas: 3.2, color: "#0A66C2" },
  { source: "TikTok Ads", spend: 34000, conversions: 1217, roas: 5.1, color: "#000000" },
]

const mockDeviceBreakdown = [
  { device: "Desktop", percentage: 45, conversions: 8526, color: "#FF1FB4" },
  { device: "Mobile", percentage: 42, conversions: 7958, color: "#00B9FF" },
  { device: "Tablet", percentage: 13, conversions: 2463, color: "#2CD5C4" },
]

const mockCampaigns = [
  { 
    id: 1, 
    name: "TechStartup Q3 Lead Generation", 
    client: "InnovateAI Solutions",
    status: "Active", 
    budget: 50000, 
    spent: 35680, 
    conversions: 1247, 
    roi: 420,
    platform: "Google Ads",
    objective: "Lead Generation"
  },
  { 
    id: 2, 
    name: "E-commerce Fashion BFCM Campaign", 
    client: "StyleHub Boutique",
    status: "Active", 
    budget: 85000, 
    spent: 72450, 
    conversions: 2156, 
    roi: 380,
    platform: "Facebook + Instagram",
    objective: "Purchase Conversion"
  },
  { 
    id: 3, 
    name: "SaaS Free Trial Campaign", 
    client: "DataFlow Pro",
    status: "Paused", 
    budget: 40000, 
    spent: 28900, 
    conversions: 892, 
    roi: 340,
    platform: "LinkedIn Ads",
    objective: "Trial Signup"
  },
  { 
    id: 4, 
    name: "Local Restaurant Chain Promotion", 
    client: "Bistro Milano",
    status: "Active", 
    budget: 25000, 
    spent: 18760, 
    conversions: 1834, 
    roi: 520,
    platform: "Facebook + Google Local",
    objective: "Store Visits"
  },
  { 
    id: 5, 
    name: "Luxury Real Estate Campaign", 
    client: "Premier Properties Group",
    status: "Active", 
    budget: 75000, 
    spent: 52340, 
    conversions: 234, 
    roi: 890,
    platform: "Google Ads + YouTube",
    objective: "High-Value Leads"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    switch (type) {
      case 'metrics':
        return NextResponse.json({ 
          success: true, 
          data: mockMetrics 
        })
      
      case 'revenue':
        return NextResponse.json({ 
          success: true, 
          data: mockRevenueData 
        })
      
      case 'campaigns':
        return NextResponse.json({ 
          success: true, 
          data: mockCampaigns 
        })
      
      default:
        return NextResponse.json({ 
          success: true, 
          data: {
            metrics: mockMetrics,
            revenue: mockRevenueData,
            campaigns: mockCampaigns
          }
        })
    }
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Analytics event received:', body)
    
    // Here you would typically save to database
    // await saveAnalyticsEvent(body)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Analytics event recorded' 
    })
  } catch (error) {
    console.error('Analytics POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics event' },
      { status: 500 }
    )
  }
}
