import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import FloatingChatWidget from "@/components/floating-chat-widget-new"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ADmyBRAND Insights - Analytics Dashboard",
  description: "Modern analytics dashboard for digital marketing agencies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <FloatingChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
