"use client"

import { useState } from 'react'
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    platform: "all",
    dateRange: "all",
    budget: "all",
    sortBy: "name"
  })

  const toggleFilters = () => setShowFilters(!showFilters)
  
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      platform: "all", 
      dateRange: "all",
      budget: "all",
      sortBy: "name"
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.status !== "all") count++
    if (filters.platform !== "all") count++
    if (filters.dateRange !== "all") count++
    if (filters.budget !== "all") count++
    if (filters.sortBy !== "name") count++
    return count
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard - Filter Dropdown Demo</h1>
      
      {/* Filter Button Demo */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-64 h-10 bg-gray-200 rounded flex items-center px-3">
          Search Bar Placeholder
        </div>
        
        {/* Filter Button with Dropdown */}
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFilters}
            className="hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>

          {/* Filter Dropdown - Positioned directly below button */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Filters</h3>
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFilterCount()} active
                    </span>
                  )}
                </div>
                {getActiveFilterCount() > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs hover:bg-blue-50"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Filters Content */}
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Status</label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={filters.platform} onValueChange={(value) => handleFilterChange("platform", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                      <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                      <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Summary */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Filter Demo</p>
                    <p className="text-xl font-bold">
                      ✅ Working!
                    </p>
                    <p className="text-xs text-gray-600">Dropdown appears below button</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full text-xs hover:bg-blue-50"
                  onClick={toggleFilters}
                >
                  Close Filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
        
        <Button variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Filter Positioning Demo</h2>
        <p className="text-gray-600 mb-4">
          Click the "Filter" button above to see the dropdown appear directly below it.
        </p>
        <p className="text-sm text-gray-500">
          Current filters: {JSON.stringify(filters, null, 2)}
        </p>
      </div>
    </div>
  )
}
