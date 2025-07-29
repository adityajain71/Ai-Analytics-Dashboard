"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown } from "lucide-react"
import { motion } from "framer-motion"

const campaigns = [
  {
    id: 1,
    name: "Summer Sale 2024",
    status: "Active",
    budget: 15000,
    spent: 12450,
    impressions: 245000,
    clicks: 12250,
    conversions: 489,
    ctr: 5.0,
    cpc: 1.02,
    roas: 3.2,
  },
  {
    id: 2,
    name: "Brand Awareness Q4",
    status: "Active",
    budget: 25000,
    spent: 18750,
    impressions: 450000,
    clicks: 18000,
    conversions: 720,
    ctr: 4.0,
    cpc: 1.04,
    roas: 2.8,
  },
  {
    id: 3,
    name: "Holiday Promotion",
    status: "Paused",
    budget: 30000,
    spent: 28900,
    impressions: 380000,
    clicks: 15200,
    conversions: 608,
    ctr: 4.0,
    cpc: 1.9,
    roas: 2.1,
  },
  {
    id: 4,
    name: "Product Launch",
    status: "Active",
    budget: 20000,
    spent: 16800,
    impressions: 320000,
    clicks: 16000,
    conversions: 640,
    ctr: 5.0,
    cpc: 1.05,
    roas: 3.8,
  },
  {
    id: 5,
    name: "Retargeting Campaign",
    status: "Active",
    budget: 8000,
    spent: 7200,
    impressions: 120000,
    clicks: 7200,
    conversions: 432,
    ctr: 6.0,
    cpc: 1.0,
    roas: 4.2,
  },
]

export function DataTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCampaigns = sortedCampaigns.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Detailed performance metrics for all active campaigns</CardDescription>

          {/* Filters */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
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
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                    <div className="flex items-center space-x-2">
                      <span>Campaign</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("budget")}>
                    <div className="flex items-center space-x-2">
                      <span>Budget</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("impressions")}>
                    <div className="flex items-center space-x-2">
                      <span>Impressions</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("clicks")}>
                    <div className="flex items-center space-x-2">
                      <span>Clicks</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("ctr")}>
                    <div className="flex items-center space-x-2">
                      <span>CTR</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("roas")}>
                    <div className="flex items-center space-x-2">
                      <span>ROAS</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCampaigns.map((campaign, index) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={campaign.status === "Active" ? "default" : "secondary"}
                        className={
                          campaign.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : ""
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell>{campaign.ctr}%</TableCell>
                    <TableCell>
                      <span
                        className={
                          campaign.roas >= 3
                            ? "text-green-600 font-medium"
                            : campaign.roas >= 2
                              ? "text-yellow-600 font-medium"
                              : "text-red-600 font-medium"
                        }
                      >
                        {campaign.roas}x
                      </span>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedCampaigns.length)} of{" "}
              {sortedCampaigns.length} campaigns
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
