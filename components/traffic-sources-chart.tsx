"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

const data = [
  { name: "Google Ads", value: 42, color: "#FF1FB4", spend: 356822 },
  { name: "Facebook Ads", value: 28, color: "#00B9FF", spend: 237548 },
  { name: "LinkedIn Ads", value: 13, color: "#7B30E3", spend: 110347 },
  { name: "TikTok Ads", value: 8, color: "#2CD5C4", spend: 67892 },
  { name: "Twitter Ads", value: 5, color: "#F97316", spend: 42456 },
  { name: "YouTube Ads", value: 4, color: "#EF4444", spend: 33927 },
]

const chartConfig = {
  value: {
    label: "Traffic %",
  },
}

export function TrafficSourcesChart() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Ad Platform Distribution</CardTitle>
          <CardDescription>Client ad spend distribution across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value}%`, "Traffic"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
