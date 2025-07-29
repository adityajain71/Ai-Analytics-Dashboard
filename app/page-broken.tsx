"use client"

import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { Sun, Moon, Search, Bell, Settings, User, Plus, Download, Filter, Zap, TrendingUp, Users, DollarSign, Target, Calendar, RefreshCw, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

// Realistic Digital Marketing Agency Data
const mockAnalytics = {
  metrics: [
    { title: "Monthly Ad Spend", value: "$847,392", change: "+24.3%", positive: true, icon: DollarSign },
    { title: "Active Clients", value: "47", change: "+6 this month", positive: true, icon: Users },
    { title: "Avg. ROAS", value: "4.2x", change: "+0.7x", positive: true, icon: TrendingUp },
    { title: "Total Campaigns", value: "156", change: "+18 this month", positive: true, icon: Target }
  ],
  revenueData: [
    { name: 'Jan', revenue: 720000, conversions: 15420 },
    { name: 'Feb', revenue: 780000, conversions: 16890 },
    { name: 'Mar', revenue: 650000, conversions: 14230 },
    { name: 'Apr', revenue: 890000, conversions: 19560 },
    { name: 'May', revenue: 760000, conversions: 16780 },
    { name: 'Jun', revenue: 950000, conversions: 21340 }
  ]
}

const mockCampaigns = [
  { id: 1, name: "TechStartup Q3 - Lead Gen", status: "Active", spend: 45000, conversions: 1247, ctr: 3.8, platform: "Google Ads", dateCreated: "2024-01-15" },
  { id: 2, name: "E-commerce Fashion - BFCM", status: "Active", spend: 78000, conversions: 2156, ctr: 4.2, platform: "Facebook Ads", dateCreated: "2024-02-01" },
  { id: 3, name: "SaaS Company - Free Trial", status: "Paused", spend: 32000, conversions: 892, ctr: 2.9, platform: "Google Ads", dateCreated: "2024-01-20" },
  { id: 4, name: "Local Restaurant Chain", status: "Active", spend: 23000, conversions: 1834, ctr: 6.1, platform: "Instagram Ads", dateCreated: "2024-03-01" },
  { id: 5, name: "Real Estate - Luxury", status: "Active", spend: 56000, conversions: 234, ctr: 1.8, platform: "LinkedIn Ads", dateCreated: "2024-02-15" },
  { id: 6, name: "Healthcare - Wellness", status: "Completed", spend: 41000, conversions: 1567, ctr: 4.7, platform: "Facebook Ads", dateCreated: "2024-01-10" }
]

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeUsers, setActiveUsers] = useState(47)
  const [lastActiveUserUpdate, setLastActiveUserUpdate] = useState(Date.now())
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false)
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState({
    status: "all",
    platform: "all",
    dateRange: "all",
    budget: "all",
    sortBy: "name"
  })
  
  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    platform: "Google Ads",
    budget: "",
    objective: "Conversions",
    targetAudience: "",
    duration: "30"
  })

  // Notifications data
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "Campaign Performance Alert", 
      message: "TechStartup Q3 - Lead Gen has exceeded budget threshold", 
      time: "5 min ago", 
      type: "warning", 
      read: false 
    },
    { 
      id: 2, 
      title: "New Conversion", 
      message: "E-commerce Fashion campaign generated 15 new conversions", 
      time: "12 min ago", 
      type: "success", 
      read: false 
    },
    { 
      id: 3, 
      title: "Campaign Paused", 
      message: "SaaS Company - Free Trial was automatically paused due to low performance", 
      time: "1 hour ago", 
      type: "info", 
      read: false 
    },
    { 
      id: 4, 
      title: "Weekly Report Ready", 
      message: "Your weekly performance report is now available for download", 
      time: "2 hours ago", 
      type: "info", 
      read: true 
    },
    { 
      id: 5, 
      title: "Budget Alert", 
      message: "Real Estate - Luxury campaign is 80% through monthly budget", 
      time: "4 hours ago", 
      type: "warning", 
      read: true 
    }
  ])

  // Static metrics (won't change)
  const staticMetrics = [
    { title: "Monthly Ad Spend", value: "$847,392", change: "+24.3%", positive: true, icon: DollarSign },
    { title: "Avg. ROAS", value: "4.2x", change: "+0.7x", positive: true, icon: TrendingUp },
    { title: "Total Campaigns", value: "156", change: "+18 this month", positive: true, icon: Target }
  ]

  // Dynamic Active Clients metric
  const [activeClientsMetric, setActiveClientsMetric] = useState({
    title: "Active Clients", 
    value: "47", 
    change: "+6 this month", 
    positive: true, 
    icon: Users
  })

  // Base value for Active Users fluctuations
  const baseActiveUsers = 47

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading) return
    
    // Update timestamp every 30 seconds
    const timestampInterval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)

    // Update live metrics every 5 seconds
    const metricsInterval = setInterval(() => {
      // Generate realistic fluctuations only for Active Users
      const newActiveUsers = Math.max(40, Math.min(55, baseActiveUsers + Math.floor(Math.random() * 9) - 4))

      setActiveUsers(newActiveUsers)
      setLastActiveUserUpdate(Date.now())
      
      // Update only the Active Clients metric
      setActiveClientsMetric({
        title: "Active Clients", 
        value: newActiveUsers.toString(), 
        change: newActiveUsers > baseActiveUsers ? `+${newActiveUsers - baseActiveUsers} this month` : `${newActiveUsers - baseActiveUsers} this month`, 
        positive: newActiveUsers >= baseActiveUsers, 
        icon: Users
      })
    }, 5000)

    return () => {
      clearInterval(timestampInterval)
      clearInterval(metricsInterval)
    }
  }, [mounted, isLoading])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as Element
        if (!target.closest('.notifications-container')) {
          setShowNotifications(false)
        }
      }
      if (showFilters) {
        const target = event.target as Element
        if (!target.closest('.filters-container')) {
          setShowFilters(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications, showFilters])

  const handleRefresh = () => {
    setIsLoading(true)
    setLastUpdated(new Date())
    setTimeout(() => setIsLoading(false), 500)
  }

  // Filter campaigns based on search query and filters
  const filteredCampaigns = campaigns.filter(campaign => {
    // Search filter
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.platform.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    const matchesStatus = filters.status === "all" || campaign.status.toLowerCase() === filters.status.toLowerCase()
    
    // Platform filter
    const matchesPlatform = filters.platform === "all" || campaign.platform === filters.platform
    
    // Budget filter
    let matchesBudget = true
    if (filters.budget === "low") matchesBudget = campaign.spend < 30000
    else if (filters.budget === "medium") matchesBudget = campaign.spend >= 30000 && campaign.spend < 60000
    else if (filters.budget === "high") matchesBudget = campaign.spend >= 60000
    
    // Date range filter
    let matchesDate = true
    if (filters.dateRange === "recent") {
      const campaignDate = new Date(campaign.dateCreated)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      matchesDate = campaignDate >= thirtyDaysAgo
    } else if (filters.dateRange === "older") {
      const campaignDate = new Date(campaign.dateCreated)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      matchesDate = campaignDate < thirtyDaysAgo
    }
    
    return matchesSearch && matchesStatus && matchesPlatform && matchesBudget && matchesDate
  }).sort((a, b) => {
    // Sort campaigns
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "spend":
        return b.spend - a.spend
      case "conversions":
        return b.conversions - a.conversions
      case "ctr":
        return b.ctr - a.ctr
      case "date":
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      default:
        return 0
    }
  })

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSearchResults(value.length > 0)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setShowSearchResults(false)
  }

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    if (showMobileSearch) {
      clearSearch()
    }
  }

  // Handle new campaign form
  const handleNewCampaignChange = (field: string, value: string) => {
    setNewCampaign(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.budget || !newCampaign.targetAudience) {
      alert("Please fill in all required fields")
      return
    }

    const campaign = {
      id: campaigns.length + 1,
      name: newCampaign.name,
      status: "Active",
      spend: 0,
      conversions: 0,
      ctr: 0,
      platform: newCampaign.platform,
      budget: parseInt(newCampaign.budget),
      objective: newCampaign.objective,
      targetAudience: newCampaign.targetAudience,
      duration: parseInt(newCampaign.duration)
    }

    setCampaigns(prev => [campaign, ...prev])
    setShowNewCampaignModal(false)
    
    // Reset form
    setNewCampaign({
      name: "",
      platform: "Google Ads",
      budget: "",
      objective: "Conversions",
      targetAudience: "",
      duration: "30"
    })

    // Show success message
    alert("Campaign created successfully!")
  }

  const openNewCampaignModal = () => {
    setShowNewCampaignModal(true)
  }

  // Filter functions
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

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

  // Notification functions
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(notif => !notif.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning": return "⚠️"
      case "success": return "✅"
      case "info": return "ℹ️"
      default: return "🔔"
    }
  }

  // Simulate new notifications (for demo purposes)
  useEffect(() => {
    if (!mounted || isLoading) return

    const addRandomNotification = () => {
      const newNotifications = [
        { 
          title: "Budget Alert", 
          message: "Campaign spend is approaching daily limit", 
          type: "warning" 
        },
        { 
          title: "New Lead", 
          message: "Healthcare campaign generated a new qualified lead", 
          type: "success" 
        },
        { 
          title: "System Update", 
          message: "Platform maintenance scheduled for tonight", 
          type: "info" 
        },
        { 
          title: "Performance Milestone", 
          message: "Restaurant campaign reached 1000 clicks!", 
          type: "success" 
        }
      ]

      const randomNotif = newNotifications[Math.floor(Math.random() * newNotifications.length)]
      const newNotification = {
        id: Date.now(),
        title: randomNotif.title,
        message: randomNotif.message,
        time: "Just now",
        type: randomNotif.type,
        read: false
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 8)]) // Keep only last 9 notifications
    }

    // Add a new notification every 2 minutes (for demo)
    const notificationInterval = setInterval(addRandomNotification, 120000)

    return () => clearInterval(notificationInterval)
  }, [mounted, isLoading])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="relative mb-8">
            {/* Main spinning circle */}
            <motion.div
              className="h-16 w-16 rounded-full border-4 border-accent-pink/20 border-t-accent-pink mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner pulsing dot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="h-2 w-2 rounded-full bg-accent-pink" />
            </motion.div>
            {/* Outer ring */}
            <motion.div
              className="absolute -inset-2 rounded-full border border-accent-blue/30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.p 
              className="text-muted-foreground mb-2 text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading dashboard...
            </motion.p>
            <motion.div className="flex items-center justify-center space-x-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="h-1 w-1 rounded-full bg-accent-pink"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Test content */}
      <div>Dashboard loading...</div>
    </div>
  )
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-accent-pink/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`blue-${i}`}
            className="absolute h-1 w-1 bg-accent-blue/20 rounded-full"
            animate={{
              x: [0, -80, 0],
              y: [0, 120, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut"
            }}
            style={{
              right: `${15 + i * 20}%`,
              bottom: `${20 + i * 15}%`,
            }}
          />
        ))}
      </div>
      {/* Header */}
      <header className="sticky top-0 z-[60] w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-primary via-accent-blue to-accent-pink p-0.5">
                <div className="h-full w-full rounded-lg bg-background flex items-center justify-center">
                  <Zap className="h-4 w-4 text-accent-pink" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-accent-pink">ADmyBRAND</h1>
                <p className="text-xs text-muted-foreground">Insights</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 md:space-x-4"
          >
            {/* Desktop Search Bar */}
            <div className="relative hidden lg:block group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-accent-pink transition-colors duration-300" />
                <Input 
                  type="search" 
                  placeholder="Search campaigns..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-64 xl:w-72 pl-9 pr-8 bg-background/50 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-accent-pink/20 border-border hover:border-accent-pink/50" 
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={clearSearch}
                    className="absolute right-2 top-2 h-6 w-6 rounded-full bg-muted hover:bg-accent-pink/20 flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-xs">×</span>
                  </motion.button>
                )}
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-[70] max-h-80 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="text-xs text-muted-foreground px-2 py-1 mb-2 font-medium">
                        Search Results ({filteredCampaigns.length})
                      </div>
                      {filteredCampaigns.length > 0 ? (
                        filteredCampaigns.map((campaign) => (
                          <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                            className="p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-accent/50"
                            onClick={() => {
                              clearSearch()
                              // You can add navigation logic here
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{campaign.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ${campaign.spend.toLocaleString()} • {campaign.conversions} conversions
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                campaign.status === 'Active' 
                                  ? 'bg-emerald-500/10 text-emerald-500' 
                                  : campaign.status === 'Paused' 
                                  ? 'bg-yellow-500/10 text-yellow-500' 
                                  : 'bg-gray-500/10 text-gray-500'
                              }`}>
                                {campaign.status}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                          No campaigns found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Tablet Search Bar */}
            <div className="relative hidden md:block lg:hidden group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-accent-pink transition-colors duration-300" />
                <Input 
                  type="search" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-48 pl-9 pr-8 bg-background/50 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-accent-pink/20 border-border hover:border-accent-pink/50" 
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={clearSearch}
                    className="absolute right-2 top-2 h-6 w-6 rounded-full bg-muted hover:bg-accent-pink/20 flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-xs">×</span>
                  </motion.button>
                )}
                
                {/* Search Results Dropdown - Tablet */}
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-[70] max-h-80 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="text-xs text-muted-foreground px-2 py-1 mb-2 font-medium">
                        Results ({filteredCampaigns.length})
                      </div>
                      {filteredCampaigns.length > 0 ? (
                        filteredCampaigns.slice(0, 3).map((campaign) => (
                          <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                            className="p-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-accent/50"
                            onClick={() => clearSearch()}
                          >
                            <p className="font-medium text-sm truncate">{campaign.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {campaign.status} • {campaign.conversions} conv.
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-muted-foreground text-sm">
                          No results
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Mobile Search Icon */}
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="md:hidden"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileSearch}
                className="hover:bg-accent-pink/10 transition-all duration-300"
              >
                <Search className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Desktop Filter Button - Next to Search */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden lg:block">
              <div className="relative filters-container">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleFilters}
                  className="hover:bg-accent-blue/10 hover:border-accent-blue transition-all duration-300 relative"
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                  </motion.div>
                  Filter
                  {getActiveFilterCount() > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 h-5 w-5 bg-accent-blue rounded-full flex items-center justify-center text-xs text-white font-medium"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      {getActiveFilterCount()}
                    </motion.span>
                  )}
                </Button>

                {/* Filter Dropdown - Positioned directly below button */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-[100] max-h-96 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">Filters</h3>
                        {getActiveFilterCount() > 0 && (
                          <span className="bg-accent-blue text-white text-xs px-2 py-1 rounded-full">
                            {getActiveFilterCount()} active
                          </span>
                        )}
                      </div>
                      {getActiveFilterCount() > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={clearFilters}
                          className="text-xs hover:bg-accent-blue/10 hover:text-accent-blue"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Filters Content */}
                    <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                      {/* Status Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Campaign Status</label>
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
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
                        <label className="text-sm font-medium text-foreground">Platform</label>
                        <Select value={filters.platform} onValueChange={(value) => handleFilterChange("platform", value)}>
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                            <SelectValue placeholder="All platforms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="Google Ads">Google Ads</SelectItem>
                            <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                            <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                            <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
                            <SelectItem value="Twitter Ads">Twitter Ads</SelectItem>
                            <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Budget Range Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Budget Range</label>
                        <Select value={filters.budget} onValueChange={(value) => handleFilterChange("budget", value)}>
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                            <SelectValue placeholder="All budgets" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Budgets</SelectItem>
                            <SelectItem value="low">Low (&lt; $30k)</SelectItem>
                            <SelectItem value="medium">Medium ($30k - $60k)</SelectItem>
                            <SelectItem value="high">High (&gt; $60k)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date Range Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Date Created</label>
                        <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                            <SelectValue placeholder="All dates" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            <SelectItem value="recent">Last 30 Days</SelectItem>
                            <SelectItem value="older">Older than 30 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort By */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Sort By</label>
                        <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                          <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                            <SelectValue placeholder="Sort by name" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Campaign Name</SelectItem>
                            <SelectItem value="spend">Ad Spend</SelectItem>
                            <SelectItem value="conversions">Conversions</SelectItem>
                            <SelectItem value="ctr">Click-through Rate</SelectItem>
                            <SelectItem value="date">Date Created</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Results Summary */}
                      <div className="bg-accent/20 rounded-lg p-3 border border-accent-blue/20">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">Showing Results</p>
                          <p className="text-xl font-bold text-foreground">
                            {filteredCampaigns.length}
                          </p>
                          <p className="text-xs text-muted-foreground">campaigns match your filters</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-border bg-accent/10">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full text-xs hover:bg-accent-blue/10 hover:text-accent-blue"
                        onClick={toggleFilters}
                      >
                        Close Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="hover:bg-accent-pink/10 hover:border-accent-pink transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                Refresh
              </Button>
            </motion.div>

            {/* Mobile Filter Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="lg:hidden">
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleFilters}
                className="hover:bg-accent-blue/10 hover:border-accent-blue transition-all duration-300 relative"
              >
                <Filter className="h-4 w-4" />
                {getActiveFilterCount() > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 h-4 w-4 bg-accent-blue rounded-full flex items-center justify-center text-xs text-white font-medium"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    {getActiveFilterCount()}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <div className="relative notifications-container">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleNotifications}
                  className="relative hover:bg-accent-pink/10 transition-all duration-300"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut"
                    }}
                  >
                    <Bell className="h-4 w-4" />
                  </motion.div>
                  {unreadCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 h-5 w-5 bg-accent-pink rounded-full flex items-center justify-center text-xs text-white font-medium"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-[80] max-h-96 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="bg-accent-pink text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs hover:bg-accent-pink/10 hover:text-accent-pink"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 border-b border-border/50 hover:bg-accent/30 transition-colors duration-200 cursor-pointer group ${
                              !notification.read ? 'bg-accent-pink/5' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-lg mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className={`font-medium text-sm ${
                                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <motion.div
                                      className="h-2 w-2 rounded-full bg-accent-pink"
                                      animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7]
                                      }}
                                      transition={{ 
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                      }}
                                    />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    {notification.time}
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteNotification(notification.id)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all duration-200"
                                  >
                                    <span className="text-xs">×</span>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-border bg-accent/10">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full text-xs hover:bg-accent-pink/10 hover:text-accent-pink"
                          onClick={() => setShowNotifications(false)}
                        >
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="hover:bg-accent-blue/10 transition-all duration-300 relative"
              >
                <motion.div
                  className="relative flex items-center justify-center w-4 h-4"
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
                </motion.div>
              </Button>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-purple-primary/10 transition-all duration-300"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="min-w-[200px] bg-card/95 backdrop-blur-sm border-border/50"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem className="hover:bg-accent-pink/10 transition-colors duration-300 cursor-pointer">
                    <motion.div 
                      className="flex items-center w-full"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </motion.div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="hover:bg-red-500/10 transition-colors duration-300 cursor-pointer text-red-500">
                    <motion.div 
                      className="flex items-center w-full"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      Logout
                    </motion.div>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </header>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[85] md:hidden"
          onClick={toggleMobileSearch}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-card border-b border-border p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 h-12 bg-background focus:ring-2 focus:ring-accent-pink/20"
                  autoFocus
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMobileSearch}
                className="h-12 w-12"
              >
                <span className="text-lg">×</span>
              </Button>
            </div>
            
            {/* Mobile Search Results */}
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-2 max-h-80 overflow-y-auto"
              >
                <div className="text-xs text-muted-foreground px-2 py-1 font-medium">
                  {filteredCampaigns.length} results
                </div>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 rounded-lg bg-background hover:bg-accent/50 cursor-pointer transition-colors duration-200"
                      onClick={() => {
                        toggleMobileSearch()
                        // Add navigation logic here
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${campaign.spend.toLocaleString()} • {campaign.conversions} conversions
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                          campaign.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : campaign.status === 'Paused' 
                            ? 'bg-yellow-500/10 text-yellow-500' 
                            : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No campaigns found for "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Mobile Filter Modal */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90] md:hidden"
          onClick={toggleFilters}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-accent-blue text-white text-xs px-2 py-1 rounded-full">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getActiveFilterCount() > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs hover:bg-accent-blue/10 hover:text-accent-blue"
                  >
                    Clear
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleFilters}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Filter Content */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Status Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Campaign Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="w-full h-12 focus:ring-2 focus:ring-accent-blue/20">
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
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Platform</label>
                <Select value={filters.platform} onValueChange={(value) => handleFilterChange("platform", value)}>
                  <SelectTrigger className="w-full h-12 focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="All platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                    <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                    <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
                    <SelectItem value="Twitter Ads">Twitter Ads</SelectItem>
                    <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Range Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Budget Range</label>
                <Select value={filters.budget} onValueChange={(value) => handleFilterChange("budget", value)}>
                  <SelectTrigger className="w-full h-12 focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="All budgets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Budgets</SelectItem>
                    <SelectItem value="low">Low (&lt; $30k)</SelectItem>
                    <SelectItem value="medium">Medium ($30k - $60k)</SelectItem>
                    <SelectItem value="high">High (&gt; $60k)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Date Created</label>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                  <SelectTrigger className="w-full h-12 focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="recent">Last 30 Days</SelectItem>
                    <SelectItem value="older">Older than 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                  <SelectTrigger className="w-full h-12 focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="Sort by name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Campaign Name</SelectItem>
                    <SelectItem value="spend">Budget (High to Low)</SelectItem>
                    <SelectItem value="conversions">Conversions (High to Low)</SelectItem>
                    <SelectItem value="ctr">CTR (High to Low)</SelectItem>
                    <SelectItem value="date">Date Created (Newest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Summary */}
              <div className="bg-accent/20 rounded-lg p-4 border border-accent-blue/20">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Showing Results</p>
                  <p className="text-xl font-bold text-foreground">
                    {filteredCampaigns.length} <span className="text-sm font-normal text-muted-foreground">of {campaigns.length}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">campaigns match your filters</p>
                </div>
              </div>
            </div>

            {/* Mobile Filter Footer */}
            <div className="p-4 border-t border-border bg-card sticky bottom-0">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-accent-blue to-purple-primary text-white hover:from-accent-blue/90 hover:to-purple-primary/90 shadow-lg"
                  onClick={toggleFilters}
                >
                  Apply Filters ({filteredCampaigns.length} results)
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* New Campaign Modal */}
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-accent-blue text-white text-xs px-2 py-1 rounded-full">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              {getActiveFilterCount() > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs hover:bg-accent-blue/10 hover:text-accent-blue"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Filters Content */}
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Campaign Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
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
                <label className="text-sm font-medium text-foreground">Platform</label>
                <Select value={filters.platform} onValueChange={(value) => handleFilterChange("platform", value)}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="All platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                    <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                    <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
                    <SelectItem value="Twitter Ads">Twitter Ads</SelectItem>
                    <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Budget Range</label>
                <Select value={filters.budget} onValueChange={(value) => handleFilterChange("budget", value)}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="All budgets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Budgets</SelectItem>
                    <SelectItem value="low">Low (&lt; $30k)</SelectItem>
                    <SelectItem value="medium">Medium ($30k - $60k)</SelectItem>
                    <SelectItem value="high">High (&gt; $60k)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date Created</label>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="recent">Last 30 Days</SelectItem>
                    <SelectItem value="older">Older than 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-blue/20">
                    <SelectValue placeholder="Sort by name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Campaign Name</SelectItem>
                    <SelectItem value="spend">Budget (High to Low)</SelectItem>
                    <SelectItem value="conversions">Conversions (High to Low)</SelectItem>
                    <SelectItem value="ctr">CTR (High to Low)</SelectItem>
                    <SelectItem value="date">Date Created (Newest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Summary */}
              <div className="bg-accent/20 rounded-lg p-3 border border-accent-blue/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Showing Results:</span>
                  <span className="text-foreground font-medium">
                    {filteredCampaigns.length} of {campaigns.length} campaigns
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-accent/10">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-xs hover:bg-accent-blue/10 hover:text-accent-blue"
                onClick={toggleFilters}
              >
                Close Filters
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[95] flex items-center justify-center p-4"
          onClick={() => setShowNewCampaignModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Create New Campaign</h2>
                <p className="text-muted-foreground mt-1">Set up your advertising campaign</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNewCampaignModal(false)}
                className="hover:bg-accent/50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Campaign Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Campaign Name *</label>
                <Input
                  type="text"
                  placeholder="e.g., Q4 Holiday Sale - Facebook Ads"
                  value={newCampaign.name}
                  onChange={(e) => handleNewCampaignChange("name", e.target.value)}
                  className="w-full focus:ring-2 focus:ring-accent-pink/20"
                />
              </div>

              {/* Platform & Budget Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Platform</label>
                  <Select value={newCampaign.platform} onValueChange={(value) => handleNewCampaignChange("platform", value)}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-pink/20">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                      <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                      <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
                      <SelectItem value="Twitter Ads">Twitter Ads</SelectItem>
                      <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Budget (USD) *</label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={newCampaign.budget}
                    onChange={(e) => handleNewCampaignChange("budget", e.target.value)}
                    className="w-full focus:ring-2 focus:ring-accent-pink/20"
                  />
                </div>
              </div>

              {/* Objective & Duration Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Campaign Objective</label>
                  <Select value={newCampaign.objective} onValueChange={(value) => handleNewCampaignChange("objective", value)}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-accent-pink/20">
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conversions">Conversions</SelectItem>
                      <SelectItem value="Traffic">Traffic</SelectItem>
                      <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                      <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                      <SelectItem value="App Installs">App Installs</SelectItem>
                      <SelectItem value="Video Views">Video Views</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Duration (Days)</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={newCampaign.duration}
                    onChange={(e) => handleNewCampaignChange("duration", e.target.value)}
                    className="w-full focus:ring-2 focus:ring-accent-pink/20"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Audience *</label>
                <Input
                  type="text"
                  placeholder="e.g., Tech professionals aged 25-45 in North America"
                  value={newCampaign.targetAudience}
                  onChange={(e) => handleNewCampaignChange("targetAudience", e.target.value)}
                  className="w-full focus:ring-2 focus:ring-accent-pink/20"
                />
              </div>

              {/* Preview Card */}
              <div className="bg-accent/20 rounded-lg p-4 border border-accent-pink/20">
                <h3 className="text-sm font-medium text-foreground mb-3">Campaign Preview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">{newCampaign.name || "Untitled Campaign"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="text-foreground">{newCampaign.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="text-foreground">${newCampaign.budget ? parseInt(newCampaign.budget).toLocaleString() : "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objective:</span>
                    <span className="text-foreground">{newCampaign.objective}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => setShowNewCampaignModal(false)}
                className="hover:bg-accent/50"
              >
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleCreateCampaign}
                  className="bg-gradient-to-r from-purple-primary to-accent-pink text-white hover:from-purple-primary/90 hover:to-accent-pink/90 shadow-lg hover:shadow-xl hover:shadow-accent-pink/25 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your advertising performance
              <span className="text-xs ml-2 text-accent-blue">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <motion.span 
                className="inline-flex items-center gap-1 ml-3 text-xs text-emerald-500"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                Live Data • {activeUsers} active clients
              </motion.span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="sm"
                className="hover:bg-accent-pink/10 hover:border-accent-pink transition-all duration-300"
              >
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Download className="h-4 w-4 mr-2" />
                </motion.div>
                Export
              </Button>
            </motion.div>

            {/* Mobile Filter Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="md:hidden">
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleFilters}
                className="hover:bg-accent-blue/10 hover:border-accent-blue transition-all duration-300 relative"
              >
                <Filter className="h-4 w-4" />
                {getActiveFilterCount() > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 h-4 w-4 bg-accent-blue rounded-full flex items-center justify-center text-xs text-white font-medium"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    {getActiveFilterCount()}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm" 
                onClick={openNewCampaignModal}
                className="bg-gradient-to-r from-purple-primary to-accent-pink text-white hover:from-purple-primary/90 hover:to-accent-pink/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent-pink/25"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                </motion.div>
                New Campaign
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {/* First three static metrics */}
          {staticMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-accent-pink/20 cursor-pointer group overflow-hidden relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-accent-pink/5 to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {metric.title}
                  </CardTitle>
                  <motion.div 
                    className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-primary/20 to-accent-pink/20 flex items-center justify-center group-hover:from-purple-primary/30 group-hover:to-accent-pink/30 transition-all duration-300"
                    whileHover={{ 
                      rotate: 5,
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                    >
                      <metric.icon className="h-4 w-4 text-accent-pink group-hover:text-accent-blue transition-colors duration-300" />
                    </motion.div>
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <p className={`text-xs flex items-center gap-1 transition-colors duration-300 ${
                    metric.positive ? 'text-emerald-500 group-hover:text-emerald-400' : 'text-red-500 group-hover:text-red-400'
                  }`}>
                    <motion.div
                      animate={{ 
                        y: [0, -2, 0],
                        rotate: metric.positive ? 0 : 180
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                    >
                      <TrendingUp className="h-3 w-3" />
                    </motion.div>
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Active Clients - Live updating metric */}
          <motion.div
            key="active-clients"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.1 * 1, // Position as second card
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-accent-pink/20 cursor-pointer group overflow-hidden relative">
              {/* Update pulse effect for Active Clients only */}
              <motion.div
                key={lastActiveUserUpdate}
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-accent-blue/10 opacity-0"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.8 }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-accent-pink/5 to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />
              {/* Live indicator for Active Clients */}
              <motion.div 
                className="absolute top-2 right-2 flex items-center gap-1 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-xs text-emerald-500 font-medium">LIVE</span>
              </motion.div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {activeClientsMetric.title}
                </CardTitle>
                <motion.div 
                  className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-primary/20 to-accent-pink/20 flex items-center justify-center group-hover:from-purple-primary/30 group-hover:to-accent-pink/30 transition-all duration-300"
                  whileHover={{ 
                    rotate: 5,
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut"
                    }}
                  >
                    <activeClientsMetric.icon className="h-4 w-4 text-accent-pink group-hover:text-accent-blue transition-colors duration-300" />
                  </motion.div>
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div 
                  className="text-2xl font-bold text-foreground"
                  key={activeClientsMetric.value} // Force re-render on value change
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeClientsMetric.value}
                </motion.div>
                <motion.p 
                  className={`text-xs flex items-center gap-1 transition-colors duration-300 ${
                    activeClientsMetric.positive ? 'text-emerald-500 group-hover:text-emerald-400' : 'text-red-500 group-hover:text-red-400'
                  }`}
                  key={activeClientsMetric.change} // Force re-render on change
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      rotate: activeClientsMetric.positive ? 0 : 180
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: 1 * 0.2
                    }}
                  >
                    <TrendingUp className="h-3 w-3" />
                  </motion.div>
                  {activeClientsMetric.change}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid gap-6 mt-8"
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card border border-border/50">
              {["overview", "analytics", "campaigns", "reports"].map((tab, index) => (
                <motion.div key={tab} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <TabsTrigger 
                    value={tab} 
                    className="data-[state=active]:bg-accent-pink data-[state=active]:text-white transition-all duration-300 hover:bg-accent-pink/10 capitalize relative overflow-hidden"
                  >
                    <motion.span
                      initial={{ y: 0 }}
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tab}
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent-pink/20 to-accent-blue/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-card hover:shadow-lg hover:shadow-accent-pink/10 transition-all duration-500 group">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg group-hover:text-accent-pink transition-colors duration-300">Revenue Trends</CardTitle>
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="h-2 w-2 rounded-full bg-accent-pink"
                        />
                      </div>
                      <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">Monthly revenue performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockAnalytics.revenueData}>
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF1FB4" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FF1FB4" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                          <XAxis dataKey="name" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#FF1FB4" 
                            strokeWidth={2} 
                            fill="url(#revenueGradient)"
                            animationDuration={2000}
                            animationBegin={0}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-card hover:shadow-lg hover:shadow-accent-blue/10 transition-all duration-500 group">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg group-hover:text-accent-blue transition-colors duration-300">Conversions</CardTitle>
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: 1,
                            ease: "easeInOut"
                          }}
                          className="h-2 w-2 rounded-full bg-accent-blue"
                        />
                      </div>
                      <CardDescription className="group-hover:text-muted-foreground/80 transition-colors duration-300">Daily conversion tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockAnalytics.revenueData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                          <XAxis dataKey="name" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="conversions" 
                            stroke="#00B9FF" 
                            strokeWidth={3}
                            dot={{ fill: '#00B9FF', strokeWidth: 2, r: 4 }}
                            activeDot={{ 
                              r: 6, 
                              stroke: '#00B9FF', 
                              strokeWidth: 2, 
                              fill: '#00B9FF',
                              style: { filter: 'drop-shadow(0 0 6px rgba(0, 185, 255, 0.6))' }
                            }}
                            animationDuration={2000}
                            animationBegin={500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>Manage your advertising campaigns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {campaigns.map((campaign, index) => (
                        <motion.div 
                          key={campaign.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ 
                            scale: 1.02, 
                            x: 4,
                            transition: { duration: 0.2 }
                          }}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-all duration-300 hover:shadow-md hover:border-accent-pink/50 cursor-pointer group"
                        >
                          <div>
                            <motion.h4 
                              className="font-medium group-hover:text-accent-pink transition-colors duration-300"
                              whileHover={{ x: 2 }}
                              transition={{ duration: 0.2 }}
                            >
                              {campaign.name}
                            </motion.h4>
                            <motion.p 
                              className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300"
                              initial={{ opacity: 0.8 }}
                              whileHover={{ opacity: 1 }}
                            >
                              Spend: ${campaign.spend.toLocaleString()} • CTR: {campaign.ctr}%
                            </motion.p>
                          </div>
                          <div className="text-right">
                            <motion.p 
                              className="font-medium group-hover:text-accent-blue transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              {campaign.conversions} conversions
                            </motion.p>
                            <motion.p 
                              className={`text-sm ${
                                campaign.status === 'Active' 
                                  ? 'text-emerald-500' 
                                  : campaign.status === 'Paused' 
                                  ? 'text-yellow-500' 
                                  : 'text-gray-500'
                              }`}
                              animate={{
                                opacity: campaign.status === 'Active' ? [1, 0.7, 1] : 1
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: campaign.status === 'Active' ? Infinity : 0 
                              }}
                            >
                              {campaign.status}
                            </motion.p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create detailed performance reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { icon: Calendar, label: "Monthly Report", color: "accent-pink" },
                      { icon: Target, label: "Campaign Report", color: "accent-blue" },
                      { icon: TrendingUp, label: "Performance Report", color: "purple-primary" }
                    ].map((report, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ 
                          scale: 1.05,
                          y: -4,
                          transition: { duration: 0.2 }
                        }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          className="h-24 flex flex-col items-center justify-center space-y-2 w-full hover:bg-accent-pink/10 hover:border-accent-pink transition-all duration-300 group relative overflow-hidden"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-accent-pink/5 to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            initial={false}
                          />
                          <motion.div
                            whileHover={{ 
                              rotate: [0, -10, 10, 0],
                              transition: { duration: 0.5 }
                            }}
                            className="relative z-10"
                          >
                            <report.icon className="h-5 w-5 group-hover:text-accent-pink transition-colors duration-300" />
                          </motion.div>
                          <motion.span 
                            className="relative z-10 group-hover:text-accent-pink transition-colors duration-300"
                            whileHover={{ y: -1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {report.label}
                          </motion.span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </motion.div>
  )
}
