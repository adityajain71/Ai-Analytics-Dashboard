"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Search, Download, Filter } from "lucide-react"
import { motion } from "framer-motion"

interface Campaign {
  id: number
  name: string
  client: string
  status: 'Active' | 'Paused' | 'Completed'
  budget: number
  spent: number
  conversions: number
  roi: number
  platform: string
  objective: string
  cpc: number
  ctr: number
  impressions: number
  clicks: number
}

const mockCampaigns: Campaign[] = [
  { id: 1, name: "TechStartup Q3 Lead Generation", client: "InnovateAI Solutions", status: "Active", budget: 50000, spent: 35680, conversions: 1247, roi: 420, platform: "Google Ads", objective: "Lead Generation", cpc: 2.86, ctr: 3.8, impressions: 890456, clicks: 33837 },
  { id: 2, name: "E-commerce Fashion BFCM Campaign", client: "StyleHub Boutique", status: "Active", budget: 85000, spent: 72450, conversions: 2156, roi: 380, platform: "Facebook + Instagram", objective: "Purchase Conversion", cpc: 1.92, ctr: 4.2, impressions: 1567890, clicks: 65831 },
  { id: 3, name: "SaaS Free Trial Campaign", client: "DataFlow Pro", status: "Paused", budget: 40000, spent: 28900, conversions: 892, roi: 340, platform: "LinkedIn Ads", objective: "Trial Signup", cpc: 4.12, ctr: 2.9, impressions: 234567, clicks: 6803 },
  { id: 4, name: "Local Restaurant Chain Promotion", client: "Bistro Milano", status: "Active", budget: 25000, spent: 18760, conversions: 1834, roi: 520, platform: "Facebook + Google Local", objective: "Store Visits", cpc: 1.45, ctr: 6.1, impressions: 456789, clicks: 27864 },
  { id: 5, name: "Luxury Real Estate Campaign", client: "Premier Properties Group", status: "Active", budget: 75000, spent: 52340, conversions: 234, roi: 890, platform: "Google Ads + YouTube", objective: "High-Value Leads", cpc: 12.67, ctr: 1.8, impressions: 234567, clicks: 4223 },
  { id: 6, name: "Healthcare Wellness Campaign", client: "VitalLife Medical Center", status: "Completed", budget: 45000, spent: 43200, conversions: 1567, roi: 310, platform: "Facebook + Google Search", objective: "Appointment Booking", cpc: 2.78, ctr: 4.7, impressions: 623456, clicks: 29303 },
  { id: 7, name: "B2B Software Demo Campaign", client: "CloudSync Enterprise", status: "Active", budget: 60000, spent: 41890, conversions: 567, roi: 450, platform: "LinkedIn + Google Ads", objective: "Demo Requests", cpc: 7.89, ctr: 2.1, impressions: 198765, clicks: 4174 },
  { id: 8, name: "E-learning Course Promotion", client: "SkillMaster Academy", status: "Active", budget: 30000, spent: 24670, conversions: 1890, roi: 280, platform: "YouTube + Facebook", objective: "Course Enrollment", cpc: 1.89, ctr: 5.2, impressions: 567890, clicks: 29530 },
]

type SortKey = keyof Campaign
type SortOrder = 'asc' | 'desc'

export function EnhancedDataTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("roi")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredAndSortedData = useMemo(() => {
    let filtered = mockCampaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      return 0
    })

    return filtered
  }, [searchTerm, statusFilter, sortKey, sortOrder])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedData, currentPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-accent-pink/20 text-accent-pink border-accent-pink/40'
      case 'Paused': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/40'
      case 'Completed': return 'bg-chart-teal/20 text-chart-teal border-chart-teal/40'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const exportToCSV = () => {
    const headers = ['Campaign Name', 'Status', 'Budget', 'Spent', 'Conversions', 'ROI %', 'Clicks', 'Impressions', 'CTR %', 'CPC $']
    const csvData = [
      headers.join(','),
      ...filteredAndSortedData.map(campaign => [
        `"${campaign.name}"`,
        campaign.status,
        campaign.budget,
        campaign.spent,
        campaign.conversions,
        campaign.roi,
        campaign.clicks,
        campaign.impressions,
        campaign.ctr,
        campaign.cpc
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'campaigns-data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
      <Card className="bg-card backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-card-foreground">Campaign Performance</CardTitle>
              <CardDescription className="text-muted-foreground">
                Detailed analytics for all marketing campaigns
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} className="bg-hot-pink hover:bg-hot-pink/90 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">
                      Campaign & Client
                      {sortKey === 'name' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('platform')}>
                    <div className="flex items-center gap-2">
                      Platform
                      {sortKey === 'platform' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-2">
                      Status
                      {sortKey === 'status' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/70 text-right" onClick={() => handleSort('budget')}>
                    <div className="flex items-center justify-end gap-2">
                      Budget
                      {sortKey === 'budget' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/70 text-right" onClick={() => handleSort('spent')}>
                    <div className="flex items-center justify-end gap-2">
                      Spent
                      {sortKey === 'spent' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/70 text-right" onClick={() => handleSort('conversions')}>
                    <div className="flex items-center justify-end gap-2">
                      Conversions
                      {sortKey === 'conversions' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/70 text-right" onClick={() => handleSort('roi')}>
                    <div className="flex items-center justify-end gap-2">
                      ROAS
                      {sortKey === 'roi' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/70 text-right" onClick={() => handleSort('ctr')}>
                    <div className="flex items-center justify-end gap-2">
                      CTR %
                      {sortKey === 'ctr' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((campaign, index) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium text-card-foreground">
                      <div>
                        <div className="font-semibold">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.client}</div>
                        <div className="text-xs text-accent-blue">{campaign.objective}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{campaign.platform}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${campaign.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${campaign.spent.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-accent-pink">{(campaign.roi / 100).toFixed(1)}x</TableCell>
                    <TableCell className="text-right">{campaign.ctr.toFixed(1)}%</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} campaigns
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-accent-pink hover:bg-accent-pink/90" : ""}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
