"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

const data = [
  { date: "2024-01", impressions: 45000, clicks: 2250, conversions: 180 },
  { date: "2024-02", impressions: 52000, clicks: 2600, conversions: 208 },
  { date: "2024-03", impressions: 48000, clicks: 2400, conversions: 192 },
  { date: "2024-04", impressions: 61000, clicks: 3050, conversions: 244 },
  { date: "2024-05", impressions: 55000, clicks: 2750, conversions: 220 },
  { date: "2024-06", impressions: 67000, clicks: 3350, conversions: 268 },
  { date: "2024-07", impressions: 72000, clicks: 3600, conversions: 288 },
  { date: "2024-08", impressions: 69000, clicks: 3450, conversions: 276 },
  { date: "2024-09", impressions: 78000, clicks: 3900, conversions: 312 },
  { date: "2024-10", impressions: 84000, clicks: 4200, conversions: 336 },
  { date: "2024-11", impressions: 87000, clicks: 4350, conversions: 348 },
  { date: "2024-12", impressions: 92000, clicks: 4600, conversions: 368 },
]

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "hsl(var(--chart-4))",
  },
  clicks: {
    label: "Clicks",
    color: "hsl(var(--chart-5))",
  },
}

export function CampaignPerformanceChart() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Impressions and clicks over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => value.split("-")[1]}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [value.toLocaleString(), ""]}
                />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stackId="1"
                  stroke="var(--color-impressions)"
                  fill="var(--color-impressions)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stackId="2"
                  stroke="var(--color-clicks)"
                  fill="var(--color-clicks)"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
