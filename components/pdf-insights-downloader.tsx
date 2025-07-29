"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Calendar, TrendingUp, BarChart3, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

interface PDFInsight {
  id: string
  title: string
  description: string
  fileName: string
  fileSize: string
  lastUpdated: string
  category: 'monthly' | 'quarterly' | 'annual' | 'campaign'
  icon: React.ComponentType<any>
  color: string
}

const availableInsights: PDFInsight[] = [
  {
    id: '1',
    title: 'ADmyBRAND Insights - Q3 2025',
    description: 'Comprehensive quarterly performance analysis with actionable insights',
    fileName: 'admybrand-insights.pdf',
    fileSize: '2.4 MB',
    lastUpdated: '2025-07-29',
    category: 'quarterly',
    icon: TrendingUp,
    color: 'text-accent-pink'
  },
  {
    id: '2',
    title: 'Monthly Performance Report',
    description: 'July 2025 detailed campaign performance and ROI analysis',
    fileName: 'monthly-report-july-2025.pdf',
    fileSize: '1.8 MB',
    lastUpdated: '2025-07-29',
    category: 'monthly',
    icon: Calendar,
    color: 'text-accent-blue'
  },
  {
    id: '3',
    title: 'Campaign Analytics Deep Dive',
    description: 'Detailed analysis of top performing campaigns and optimization strategies',
    fileName: 'campaign-analytics-deep-dive.pdf',
    fileSize: '3.1 MB',
    lastUpdated: '2025-07-28',
    category: 'campaign',
    icon: BarChart3,
    color: 'text-chart-teal'
  }
]

export function PDFInsightsDownloader() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDownload = async (insight: PDFInsight) => {
    setDownloadingId(insight.id)
    
    try {
      // Check if file exists
      const response = await fetch(`/pdf/${insight.fileName}`)
      
      if (response.ok) {
        // File exists, download it
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = insight.fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: "Download Started",
          description: `${insight.title} is being downloaded.`,
        })
      } else {
        // File doesn't exist, generate a placeholder
        await generatePlaceholderPDF(insight)
      }
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download Error",
        description: "Failed to download the PDF. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDownloadingId(null)
    }
  }

  const generatePlaceholderPDF = async (insight: PDFInsight) => {
    // Generate a simple PDF content as placeholder
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
50 750 Td
(${insight.title}) Tj
0 -30 Td
/F1 12 Tf
(Generated on: ${new Date().toLocaleDateString()}) Tj
0 -20 Td
(This is a placeholder PDF for demonstration.) Tj
0 -20 Td
(Upload your actual PDF to /public/pdf/ folder.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000057 00000 n 
0000000114 00000 n 
0000000266 00000 n 
0000000518 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
598
%%EOF`

    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = insight.fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast({
      title: "PDF Generated",
      description: "A placeholder PDF has been generated. Replace with your actual file.",
    })
  }

  const handlePreview = (insight: PDFInsight) => {
    // Open PDF in new tab for preview
    window.open(`/pdf/${insight.fileName}`, '_blank')
  }

  const getCategoryBadge = (category: PDFInsight['category']) => {
    const styles = {
      monthly: 'bg-blue-100 text-blue-800 border-blue-200',
      quarterly: 'bg-purple-100 text-purple-800 border-purple-200',
      annual: 'bg-green-100 text-green-800 border-green-200',
      campaign: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    
    return (
      <Badge variant="outline" className={styles[category]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">📈 ADmyBRAND Insights Library</h2>
        <p className="text-muted-foreground">
          Download comprehensive analytics reports and insights documents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-accent-pink/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-gradient-to-r from-accent-pink/10 to-accent-blue/10`}>
                    <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                  {getCategoryBadge(insight.category)}
                </div>
                <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
                <CardDescription className="text-sm">
                  {insight.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Size: {insight.fileSize}</span>
                    <span>Updated: {new Date(insight.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownload(insight)}
                      disabled={downloadingId === insight.id}
                      className="flex-1 bg-accent-pink hover:bg-accent-pink/90 text-white"
                      size="sm"
                    >
                      {downloadingId === insight.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Download className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {downloadingId === insight.id ? 'Downloading...' : 'Download'}
                    </Button>
                    
                    <Button
                      onClick={() => handlePreview(insight)}
                      variant="outline"
                      size="sm"
                      className="px-3"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Custom Reports Available</h3>
              <p className="text-sm text-blue-700">
                Need a custom analysis? Contact our team to generate specialized insights reports.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
