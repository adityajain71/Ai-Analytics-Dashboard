"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-64 hidden md:block" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Header Skeleton */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Metrics Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid gap-6 mt-8">
          <div className="space-y-6">
            {/* Tabs Skeleton */}
            <div className="grid w-full grid-cols-4 gap-2 bg-card rounded-lg p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>

            {/* Charts Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-card">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-2 w-2 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table Skeleton */}
        <div className="mt-8">
          <Card className="bg-card">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Table Header */}
                <div className="flex items-center space-x-4 p-2 bg-muted/50 rounded">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                  ))}
                </div>
                {/* Table Rows */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-2">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 flex-1" />
                    ))}
                  </div>
                ))}
              </div>
              {/* Pagination Skeleton */}
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8" />
                  ))}
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
