import { NextRequest, NextResponse } from 'next/server'

interface Campaign {
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

// Mock database - Replace with real database
let campaigns: Campaign[] = [
  {
    id: 1,
    name: "Summer Sale 2025",
    status: "Active",
    budget: 15000,
    spent: 12300,
    conversions: 1247,
    roi: 312,
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-07-29T00:00:00Z"
  },
  {
    id: 2,
    name: "Brand Awareness Q3",
    status: "Active",
    budget: 25000,
    spent: 18900,
    conversions: 2156,
    roi: 289,
    createdAt: "2025-07-01T00:00:00Z",
    updatedAt: "2025-07-29T00:00:00Z"
  },
  {
    id: 3,
    name: "Product Launch",
    status: "Paused",
    budget: 30000,
    spent: 22100,
    conversions: 1823,
    roi: 267,
    createdAt: "2025-05-15T00:00:00Z",
    updatedAt: "2025-07-20T00:00:00Z"
  }
]

// GET /api/campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let filteredCampaigns = campaigns
    
    if (status) {
      filteredCampaigns = campaigns.filter(
        campaign => campaign.status.toLowerCase() === status.toLowerCase()
      )
    }
    
    return NextResponse.json({
      success: true,
      data: filteredCampaigns,
      total: filteredCampaigns.length
    })
  } catch (error) {
    console.error('Campaigns GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

// POST /api/campaigns
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newCampaign: Campaign = {
      id: campaigns.length + 1,
      name: body.name,
      status: body.status || 'Active',
      budget: body.budget,
      spent: 0,
      conversions: 0,
      roi: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    campaigns.push(newCampaign)
    
    return NextResponse.json({
      success: true,
      data: newCampaign,
      message: 'Campaign created successfully'
    })
  } catch (error) {
    console.error('Campaigns POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

// PUT /api/campaigns
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const campaignIndex = campaigns.findIndex(c => c.id === id)
    
    if (campaignIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }
    
    campaigns[campaignIndex] = {
      ...campaigns[campaignIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: campaigns[campaignIndex],
      message: 'Campaign updated successfully'
    })
  } catch (error) {
    console.error('Campaigns PUT Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      )
    }
    
    const campaignIndex = campaigns.findIndex(c => c.id === parseInt(id))
    
    if (campaignIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }
    
    const deletedCampaign = campaigns.splice(campaignIndex, 1)[0]
    
    return NextResponse.json({
      success: true,
      data: deletedCampaign,
      message: 'Campaign deleted successfully'
    })
  } catch (error) {
    console.error('Campaigns DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
