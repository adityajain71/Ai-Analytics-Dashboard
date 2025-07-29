"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

const data = [
  { source: "Google Ads", spend: 356000, conversions: 7240, roas: 4.8, color: "#4285F4" },
  { source: "Facebook Ads", spend: 234000, conversions: 5180, roas: 4.1, color: "#1877F2" },
  { source: "Instagram Ads", spend: 145000, conversions: 3420, roas: 3.9, color: "#E4405F" },
  { source: "LinkedIn Ads", spend: 78000, conversions: 890, roas: 3.2, color: "#0A66C2" },
  { source: "TikTok Ads", spend: 34000, conversions: 1217, roas: 5.1, color: "#000000" },
]

export function TrafficSourcesBarChart() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
      <Card className="bg-card backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            Ad Platform Performance
            <div className="h-2 w-2 rounded-full bg-chart-teal animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">Ad spend and ROAS by platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              spend: { label: "Ad Spend ($)", color: "#FF1FB4" },
              conversions: { label: "Conversions", color: "#00B9FF" },
              roas: { label: "ROAS", color: "#2CD5C4" },
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="source" 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  content={<ChartTooltipContent className="bg-card border-border text-card-foreground" />}
                  formatter={(value: number, name: string) => [
                    name === "spend" ? `$${value.toLocaleString()} spend` : `${value} conversions`,
                    name === "spend" ? "Ad Spend" : "Conversions"
                  ]}
                />
                <Bar 
                  dataKey="spend" 
                  fill="#FF1FB4" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
                <Bar 
                  dataKey="conversions" 
                  fill="#00B9FF" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.9}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
