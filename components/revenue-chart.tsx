"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

const data = [
  { month: "Jan", revenue: 1850000, target: 1800000 },
  { month: "Feb", revenue: 2150000, target: 2000000 },
  { month: "Mar", revenue: 1980000, target: 1900000 },
  { month: "Apr", revenue: 2520000, target: 2300000 },
  { month: "May", revenue: 2280000, target: 2200000 },
  { month: "Jun", revenue: 2750000, target: 2500000 },
  { month: "Jul", revenue: 2960000, target: 2700000 },
  { month: "Aug", revenue: 2840000, target: 2800000 },
  { month: "Sep", revenue: 3210000, target: 3000000 },
  { month: "Oct", revenue: 3450000, target: 3200000 },
  { month: "Nov", revenue: 3580000, target: 3400000 },
  { month: "Dec", revenue: 3780000, target: 3600000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#FF1FB4", // accent-pink
  },
  target: {
    label: "Target",
    color: "#00B9FF", // accent-blue
  },
}

export function RevenueChart() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
      <Card className="bg-card backdrop-blur-sm card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            Client Revenue Generated
            <div className="h-2 w-2 rounded-full bg-accent-pink animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">Revenue generated for clients vs monthly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent className="bg-card border-border text-card-foreground" />}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF1FB4"
                  strokeWidth={3}
                  dot={{ fill: "#FF1FB4", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#FF1FB4", strokeWidth: 2, fill: "#FF1FB4" }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#00B9FF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
