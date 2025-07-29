"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

const data = [
  { name: "Mobile", value: 42, color: "#FF1FB4", spend: 356822, conversions: 7958 },
  { name: "Desktop", value: 45, color: "#00B9FF", spend: 381670, conversions: 8526 },
  { name: "Tablet", value: 13, color: "#2CD5C4", spend: 108900, conversions: 2463 },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function DeviceBreakdownChart() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
      <Card className="bg-card backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            Device Breakdown
            <div className="h-2 w-2 rounded-full bg-accent-pink animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">Ad spend distribution by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              mobile: { label: "Mobile", color: "#FF1FB4" },
              desktop: { label: "Desktop", color: "#00B9FF" },
              tablet: { label: "Tablet", color: "#2CD5C4" },
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent className="bg-card border-border text-card-foreground" />}
                  formatter={(value: number, name: string, props: any) => [
                    `${value}%`,
                    `Spend: $${props.payload.spend.toLocaleString()}`,
                    `Conversions: ${props.payload.conversions.toLocaleString()}`
                  ]}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    fontSize: '12px',
                    color: 'hsl(var(--muted-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
