"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

const metrics = [
  {
    title: "Total Revenue",
    value: "$847,392",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-accent-pink",
    bgColor: "bg-accent-pink/10 border border-accent-pink/20",
    glowColor: "card-glow-pink"
  },
  {
    title: "Active Users",
    value: "24,847",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-accent-blue",
    bgColor: "bg-accent-blue/10 border border-accent-blue/20",
    glowColor: "hover:shadow-lg hover:shadow-accent-blue/20"
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    trend: "down",
    icon: Target,
    color: "text-chart-teal",
    bgColor: "bg-chart-teal/10 border border-chart-teal/20",
    glowColor: "hover:shadow-lg hover:shadow-chart-teal/20"
  },
  {
    title: "Campaign ROI",
    value: "284%",
    change: "+15.3%",
    trend: "up",
    icon: BarChart3,
    color: "text-purple-start",
    bgColor: "bg-purple-gradient/10 border border-purple-start/20",
    glowColor: "card-glow"
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`relative overflow-hidden transition-all duration-300 bg-card backdrop-blur-sm ${metric.glowColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2 text-foreground">{metric.value}</div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={metric.trend === "up" ? "default" : "destructive"} 
                  className={`text-xs ${metric.trend === "up" ? "bg-accent-pink/20 text-accent-pink border-accent-pink/40" : "bg-red-500/20 text-red-400 border-red-500/40"}`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-pink/5 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
