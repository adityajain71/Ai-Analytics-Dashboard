"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Download, FileText, TrendingUp, Target, CalendarIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ReportData } from '@/app/api/reports/route'
import { useToast } from '@/hooks/use-toast'
import { ReportPreview } from './report-preview'

interface ReportGeneratorProps {
  isOpen: boolean
  onClose: () => void
  reportType?: 'monthly' | 'campaign' | 'performance'
}

const reportTypes = [
  {
    value: 'monthly',
    label: 'Monthly Report',
    description: 'Comprehensive monthly performance analysis',
    icon: Calendar,
    color: 'text-accent-pink'
  },
  {
    value: 'campaign',
    label: 'Campaign Report',
    description: 'Detailed campaign-specific metrics',
    icon: Target,
    color: 'text-accent-blue'
  },
  {
    value: 'performance',
    label: 'Performance Report',
    description: 'Overall performance and trend analysis',
    icon: TrendingUp,
    color: 'text-purple-primary'
  }
] as const

const formatOptions = [
  { value: 'json', label: 'JSON Data', description: 'Raw data for further processing' },
  { value: 'csv', label: 'CSV Export', description: 'Spreadsheet-compatible format' },
  { value: 'pdf', label: 'PDF Report', description: 'Professional formatted report' }
] as const

export function ReportGenerator({ isOpen, onClose, reportType }: ReportGeneratorProps) {
  const [selectedType, setSelectedType] = useState<string>(reportType || 'performance')
  const [selectedFormat, setSelectedFormat] = useState<string>('json')
  const [dateFrom, setDateFrom] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const [dateTo, setDateTo] = useState<Date>(new Date())
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    try {
      // Always download the ADmyBRAND Insights PDF regardless of format or type
      const pdfUrl = '/pdf/admybrand-insights.pdf'
      const fileName = `ADmyBRAND-Insights-${selectedType || 'report'}-${format(dateFrom || new Date(), 'yyyy-MM-dd')}-to-${format(dateTo || new Date(), 'yyyy-MM-dd')}.pdf`
      
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = pdfUrl
      a.download = fileName
      a.target = '_blank' // Fallback to open in new tab if download fails
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      toast({
        title: "Report Downloaded",
        description: "Your ADmyBRAND Insights report has been downloaded successfully.",
      })

      onClose()
    } catch (error) {
      console.error('Error downloading report:', error)
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedReportType = reportTypes.find(type => type.value === selectedType)

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent-pink" />
            Generate Report
          </DialogTitle>
          <DialogDescription>
            Create detailed performance reports for your campaigns
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className={cn("h-4 w-4", type.color)} />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => date && setDateFrom(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => date && setDateTo(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs text-muted-foreground">{format.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Preview */}
          <AnimatePresence>
            {selectedReportType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border p-4 bg-muted/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <selectedReportType.icon className={cn("h-4 w-4", selectedReportType.color)} />
                  <span className="font-medium">{selectedReportType.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedReportType.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Date range: {format(dateFrom, "MMM dd, yyyy")} - {format(dateTo, "MMM dd, yyyy")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Download className="h-4 w-4" />
              </motion.div>
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Report Preview Dialog */}
    {showPreview && reportData && (
      <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent-pink" />
              Report Preview - {selectedType} Report
            </DialogTitle>
            <DialogDescription>
              Preview your report before downloading
            </DialogDescription>
          </DialogHeader>
          
          <ReportPreview 
            reportData={reportData!}
            onDownload={() => {
              // Download the ADmyBRAND Insights PDF
              const pdfUrl = '/pdf/admybrand-insights.pdf'
              const fileName = `ADmyBRAND-Insights-${selectedType}-report-${format(dateFrom, 'yyyy-MM-dd')}-to-${format(dateTo, 'yyyy-MM-dd')}.pdf`
              
              const a = document.createElement('a')
              a.style.display = 'none'
              a.href = pdfUrl
              a.download = fileName
              a.target = '_blank'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              
              toast({
                title: "PDF Downloaded",
                description: "Your ADmyBRAND Insights report has been downloaded successfully.",
              })
              setShowPreview(false)
              onClose()
            }}
            onEmail={() => {
              toast({
                title: "Email Sent",
                description: "Report has been sent to your email address.",
              })
            }}
            onSchedule={() => {
              toast({
                title: "Report Scheduled",
                description: "This report will be generated weekly.",
              })
            }}
          />
        </DialogContent>
      </Dialog>
    )}
    </>
  )
}
