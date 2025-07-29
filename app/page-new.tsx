"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, RefreshCw, Moon, Sun, Bell, Settings, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { MetricsCards } from "@/components/metrics-cards"
import { RevenueChart } from "@/components/revenue-chart"
import { ConversionsChart } from "@/components/conversions-chart"
import { TrafficSourcesChart } from "@/components/traffic-sources-chart"
import { CampaignPerformanceChart } from "@/components/campaign-performance-chart"
import { DataTable } from "@/components/data-table"
import { DateRangePicker } from "@/components/date-range-picker"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)

    return () => {
      clearTimeout(timer)
      clearInterval(updateInterval)
    }
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 1000)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-card-bg/95 backdrop-blur supports-[backdrop-filter]:bg-card-bg/80">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-purple-gradient flex items-center justify-center card-glow">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-purple-gradient bg-clip-text text-transparent text-glow-purple">
                  ADmyBRAND
                </h1>
                <p className="text-xs text-muted-text">Insights</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text" />
              <Input placeholder="Search campaigns..." className="w-64 pl-10 bg-card-bg border-dark-border text-white-text placeholder:text-muted-text" />
            </div>

            <Button variant="outline" size="sm" onClick={handleRefresh} className="border-dark-border hover:bg-accent-pink/10 hover:border-accent-pink">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="border-dark-border hover:bg-accent-blue/10 hover:border-accent-blue">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="sm" className="border-dark-border hover:bg-chart-teal/10 hover:border-chart-teal">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" className="border-dark-border hover:bg-muted-text/10 hover:border-muted-text">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white-text text-glow-purple">Analytics Dashboard</h2>
            <p className="text-muted-text">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>

          <div className="flex items-center space-x-4">
            <DateRangePicker />
            <Button className="bg-hot-pink hover:bg-hot-pink/90 text-white-text card-glow-pink">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-purple-gradient hover:opacity-90 text-white-text card-glow font-semibold">
              ✨ Write Campaign
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <MetricsCards />

        {/* Charts Section */}
        <div className="grid gap-6 mt-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card-bg border border-dark-border">
              <TabsTrigger value="overview" className="data-[state=active]:bg-accent-pink data-[state=active]:text-white-text">Overview</TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-accent-blue data-[state=active]:text-white-text">Revenue</TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-chart-teal data-[state=active]:text-white-text">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-start data-[state=active]:text-white-text">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <RevenueChart />
                <ConversionsChart />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <TrafficSourcesChart />
                <CampaignPerformanceChart />
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <RevenueChart />
              <div className="grid gap-6 md:grid-cols-2">
                <ConversionsChart />
                <TrafficSourcesChart />
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <CampaignPerformanceChart />
              <div className="grid gap-6 md:grid-cols-2">
                <RevenueChart />
                <ConversionsChart />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TrafficSourcesChart />
                <CampaignPerformanceChart />
              </div>
              <RevenueChart />
            </TabsContent>
          </Tabs>
        </div>

        {/* Data Table */}
        <div className="mt-8">
          <DataTable />
        </div>
      </main>
    </div>
  )
}
