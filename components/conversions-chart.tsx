"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

const data = [
  { channel: "Google Ads", conversions: 1247, rate: 3.2 },
  { channel: "Facebook", conversions: 892, rate: 2.8 },
  { channel: "Instagram", conversions: 654, rate: 4.1 },
  { channel: "LinkedIn", conversions: 423, rate: 5.2 },
  { channel: "Twitter", conversions: 287, rate: 2.1 },
  { channel: "Email", conversions: 1156, rate: 6.8 },
  { channel: "Organic", conversions: 2341, rate: 4.5 },
]

const chartConfig = {
  conversions: {
    label: "Conversions",
    color: "hsl(var(--chart-3))",
  },
}

export function ConversionsChart() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Conversions by Channel</CardTitle>
          <CardDescription>Total conversions across all marketing channels</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey="channel"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => [
                    name === "conversions" ? value.toLocaleString() : `${value}%`,
                    name === "conversions" ? "Conversions" : "Rate",
                  ]}
                />
                <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
