"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReportData } from '@/app/api/reports/route'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Download, Mail, Calendar, TrendingUp, Target, Users, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

interface ReportPreviewProps {
  reportData: ReportData
  onDownload: () => void
  onEmail?: () => void
  onSchedule?: () => void
}

export function ReportPreview({ reportData, onDownload, onEmail, onSchedule }: ReportPreviewProps) {
  const { data, dateRange, type } = reportData

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(value)

  const getReportIcon = () => {
    switch (type) {
      case 'monthly': return Calendar
      case 'campaign': return Target
      case 'performance': return TrendingUp
      default: return TrendingUp
    }
  }

  const ReportIcon = getReportIcon()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-pink/10 rounded-lg">
                <ReportIcon className="h-6 w-6 text-accent-pink" />
              </div>
              <div>
                <CardTitle className="text-2xl capitalize">{type} Report</CardTitle>
                <CardDescription>
                  {dateRange.from} to {dateRange.to}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {onEmail && (
                <Button variant="outline" size="sm" onClick={onEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              )}
              {onSchedule && (
                <Button variant="outline" size="sm" onClick={onSchedule}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
              <Button onClick={onDownload} className="bg-accent-pink hover:bg-accent-pink/90">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</div>
            <div className="text-xs text-muted-foreground">
              Avg ROAS: {data.summary.averageROAS}x
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium text-muted-foreground">Total Conversions</div>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data.summary.totalConversions)}</div>
            <div className="text-xs text-muted-foreground">
              CTR: {data.summary.averageCTR}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium text-muted-foreground">Total Clicks</div>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data.summary.totalClicks)}</div>
            <div className="text-xs text-muted-foreground">
              CPC: {formatCurrency(data.summary.averageCPC)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium text-muted-foreground">Total Impressions</div>
            </div>
            <div className="text-2xl font-bold">{formatNumber(data.summary.totalImpressions)}</div>
            <div className="text-xs text-muted-foreground">
              Daily avg: {Math.round(data.summary.totalImpressions / data.dailyMetrics.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance Trend</CardTitle>
          <CardDescription>Revenue and conversions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversions"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Top performing campaigns by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.campaigns} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(Number(value)) : formatNumber(Number(value)),
                  name === 'revenue' ? 'Revenue' : 'Conversions'
                ]} />
                <Bar dataKey="revenue" fill="#8b5cf6" name="revenue" />
                <Bar dataKey="conversions" fill="#06b6d4" name="conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Best performing campaigns by key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{performer.metric}</div>
                  <div className="text-sm text-muted-foreground">{performer.campaign}</div>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold">
                  {performer.metric.includes('Revenue') || performer.metric.includes('Spend') 
                    ? formatCurrency(performer.value)
                    : performer.metric.includes('ROAS')
                    ? `${performer.value}x`
                    : formatNumber(performer.value)
                  }
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Complete campaign performance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Campaign</th>
                  <th className="text-right p-2">Impressions</th>
                  <th className="text-right p-2">Clicks</th>
                  <th className="text-right p-2">CTR</th>
                  <th className="text-right p-2">Conversions</th>
                  <th className="text-right p-2">Spend</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((campaign, index) => (
                  <tr key={campaign.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{campaign.name}</td>
                    <td className="p-2 text-right">{formatNumber(campaign.impressions)}</td>
                    <td className="p-2 text-right">{formatNumber(campaign.clicks)}</td>
                    <td className="p-2 text-right">{campaign.ctr}%</td>
                    <td className="p-2 text-right">{formatNumber(campaign.conversions)}</td>
                    <td className="p-2 text-right">{formatCurrency(campaign.spend)}</td>
                    <td className="p-2 text-right font-medium">{formatCurrency(campaign.revenue)}</td>
                    <td className="p-2 text-right">
                      <Badge variant={campaign.roas > 3 ? "default" : "secondary"}>
                        {campaign.roas}x
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
