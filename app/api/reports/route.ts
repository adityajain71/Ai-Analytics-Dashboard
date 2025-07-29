import { NextRequest, NextResponse } from 'next/server'

export interface ReportData {
  type: 'monthly' | 'campaign' | 'performance'
  dateRange: {
    from: string
    to: string
  }
  data: {
    summary: {
      totalImpressions: number
      totalClicks: number
      totalConversions: number
      totalRevenue: number
      averageCTR: number
      averageCPC: number
      averageROAS: number
    }
    campaigns: Array<{
      id: string
      name: string
      impressions: number
      clicks: number
      conversions: number
      spend: number
      revenue: number
      ctr: number
      cpc: number
      roas: number
    }>
    dailyMetrics: Array<{
      date: string
      impressions: number
      clicks: number
      conversions: number
      revenue: number
    }>
    topPerformers: Array<{
      metric: string
      campaign: string
      value: number
    }>
  }
}

// Mock data generator for reports
function generateMockReportData(type: ReportData['type'], from: string, to: string): ReportData {
  const campaigns = [
    { id: '1', name: 'Summer Sale 2025' },
    { id: '2', name: 'Brand Awareness Q3' },
    { id: '3', name: 'Product Launch Campaign' },
    { id: '4', name: 'Holiday Special' },
    { id: '5', name: 'Retargeting Campaign' }
  ]

  const campaignData = campaigns.map(campaign => ({
    ...campaign,
    impressions: Math.floor(Math.random() * 100000) + 50000,
    clicks: Math.floor(Math.random() * 5000) + 1000,
    conversions: Math.floor(Math.random() * 200) + 50,
    spend: Math.floor(Math.random() * 10000) + 2000,
    revenue: Math.floor(Math.random() * 25000) + 5000,
    ctr: Number((Math.random() * 3 + 1).toFixed(2)),
    cpc: Number((Math.random() * 2 + 0.5).toFixed(2)),
    roas: Number((Math.random() * 4 + 2).toFixed(2))
  }))

  const totalImpressions = campaignData.reduce((sum, c) => sum + c.impressions, 0)
  const totalClicks = campaignData.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = campaignData.reduce((sum, c) => sum + c.conversions, 0)
  const totalSpend = campaignData.reduce((sum, c) => sum + c.spend, 0)
  const totalRevenue = campaignData.reduce((sum, c) => sum + c.revenue, 0)

  // Generate daily metrics for the date range
  const startDate = new Date(from)
  const endDate = new Date(to)
  const dailyMetrics = []
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dailyMetrics.push({
      date: d.toISOString().split('T')[0],
      impressions: Math.floor(Math.random() * 5000) + 1000,
      clicks: Math.floor(Math.random() * 250) + 50,
      conversions: Math.floor(Math.random() * 15) + 3,
      revenue: Math.floor(Math.random() * 1500) + 300
    })
  }

  return {
    type,
    dateRange: { from, to },
    data: {
      summary: {
        totalImpressions,
        totalClicks,
        totalConversions,
        totalRevenue,
        averageCTR: Number((totalClicks / totalImpressions * 100).toFixed(2)),
        averageCPC: Number((totalSpend / totalClicks).toFixed(2)),
        averageROAS: Number((totalRevenue / totalSpend).toFixed(2))
      },
      campaigns: campaignData,
      dailyMetrics,
      topPerformers: [
        { metric: 'Highest ROAS', campaign: campaignData[0].name, value: Math.max(...campaignData.map(c => c.roas)) },
        { metric: 'Most Conversions', campaign: campaignData[1].name, value: Math.max(...campaignData.map(c => c.conversions)) },
        { metric: 'Highest Revenue', campaign: campaignData[2].name, value: Math.max(...campaignData.map(c => c.revenue)) }
      ]
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as ReportData['type'] || 'performance'
    const from = searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const to = searchParams.get('to') || new Date().toISOString().split('T')[0]

    // Validate report type
    if (!['monthly', 'campaign', 'performance'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid report type. Must be monthly, campaign, or performance.' },
        { status: 400 }
      )
    }

    const reportData = generateMockReportData(type, from, to)

    return NextResponse.json({
      success: true,
      report: reportData,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, dateRange, format = 'json' } = body

    if (!type || !dateRange?.from || !dateRange?.to) {
      return NextResponse.json(
        { error: 'Missing required fields: type, dateRange.from, dateRange.to' },
        { status: 400 }
      )
    }

    const reportData = generateMockReportData(type, dateRange.from, dateRange.to)

    if (format === 'csv') {
      // Generate CSV format
      const csvHeader = 'Campaign,Impressions,Clicks,Conversions,Spend,Revenue,CTR,CPC,ROAS\n'
      const csvData = reportData.data.campaigns.map(campaign => 
        `"${campaign.name}",${campaign.impressions},${campaign.clicks},${campaign.conversions},${campaign.spend},${campaign.revenue},${campaign.ctr}%,${campaign.cpc},${campaign.roas}`
      ).join('\n')
      
      return new NextResponse(csvHeader + csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-report-${reportData.dateRange.from}-to-${reportData.dateRange.to}.csv"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      report: reportData,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
