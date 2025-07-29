"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mx-auto"
        >
          <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            ADmyBRAND Insights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Loading your analytics dashboard...
          </motion.p>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto max-w-xs"
        />
      </div>
    </div>
  )
}
