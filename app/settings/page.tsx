"use client"

import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { ArrowLeft, Sun, Moon, Bell, User, Globe, Shield, CreditCard, Palette, Monitor, Save, Check, X, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import Link from 'next/link'

interface UserSettings {
  // Profile
  name: string
  email: string
  company: string
  role: string
  avatar: string
  
  // Preferences
  theme: string
  language: string
  timezone: string
  currency: string
  dateFormat: string
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  reportNotifications: boolean
  
  // Privacy & Security
  twoFactorAuth: boolean
  sessionTimeout: string
  dataRetention: string
  shareAnalytics: boolean
  
  // Dashboard
  defaultView: string
  autoRefresh: boolean
  refreshInterval: string
  compactMode: boolean
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const [hasChanges, setHasChanges] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [settings, setSettings] = useState<UserSettings>({
    // Profile
    name: "Alex Johnson",
    email: "alex.johnson@admybrand.com",
    company: "ADmyBRAND",
    role: "Marketing Director",
    avatar: "/placeholder-user.jpg",
    
    // Preferences
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    currency: "USD",
    dateFormat: "MM/dd/yyyy",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    reportNotifications: true,
    
    // Privacy & Security
    twoFactorAuth: true,
    sessionTimeout: "8",
    dataRetention: "2years",
    shareAnalytics: false,
    
    // Dashboard
    defaultView: "overview",
    autoRefresh: true,
    refreshInterval: "30",
    compactMode: false
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSaving(false)
    setSaveSuccess(true)
    setHasChanges(false)
    
    // Reset success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-8 w-8 rounded-full border-2 border-accent-pink/20 border-t-accent-pink animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Button variant="ghost" size="icon" className="hover:bg-accent-pink/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold">Settings</h1>
                  <p className="text-xs text-muted-foreground">Manage your account preferences</p>
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                  Unsaved changes
                </Badge>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-gradient-to-r from-purple-primary to-accent-pink text-white hover:from-purple-primary/90 hover:to-accent-pink/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white mr-2"
                  />
                ) : saveSuccess ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {settingsSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <Button
                      variant={activeSection === section.id ? "default" : "ghost"}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full justify-start transition-all duration-200 ${
                        activeSection === section.id 
                          ? 'bg-accent-pink text-white hover:bg-accent-pink/90' 
                          : 'hover:bg-accent-pink/10'
                      }`}
                    >
                      <section.icon className="h-4 w-4 mr-3" />
                      {section.label}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-accent-pink" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information and profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-primary to-accent-pink p-0.5">
                        <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                          <User className="h-8 w-8 text-accent-pink" />
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={settings.name}
                          onChange={(e) => handleSettingChange('name', e.target.value)}
                          className="focus:ring-2 focus:ring-accent-pink/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleSettingChange('email', e.target.value)}
                          className="focus:ring-2 focus:ring-accent-pink/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={settings.company}
                          onChange={(e) => handleSettingChange('company', e.target.value)}
                          className="focus:ring-2 focus:ring-accent-pink/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={settings.role}
                          onChange={(e) => handleSettingChange('role', e.target.value)}
                          className="focus:ring-2 focus:ring-accent-pink/20"
                        />
                      </div>
                    </div>

                    {/* Password Section */}
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              className="focus:ring-2 focus:ring-accent-pink/20 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            className="focus:ring-2 focus:ring-accent-pink/20"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-accent-blue" />
                      Preferences
                    </CardTitle>
                    <CardDescription>Customize your app experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Theme */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Appearance</h3>
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select value={settings.theme} onValueChange={(value) => {
                          handleSettingChange('theme', value)
                          if (value !== 'system') {
                            setTheme(value)
                          }
                        }}>
                          <SelectTrigger className="focus:ring-2 focus:ring-accent-blue/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Dark
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4" />
                                System
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Localization */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Localization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-accent-blue/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="pt">Português</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-accent-blue/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">GMT</SelectItem>
                              <SelectItem value="Europe/Paris">CET</SelectItem>
                              <SelectItem value="Asia/Tokyo">JST</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-accent-blue/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="JPY">JPY (¥)</SelectItem>
                              <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date Format</Label>
                          <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-accent-blue/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                              <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                              <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                              <SelectItem value="dd MMM yyyy">dd MMM yyyy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-yellow-500" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Control how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional and marketing content' },
                      { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security and login notifications' },
                      { key: 'reportNotifications', label: 'Report Notifications', description: 'Weekly and monthly performance reports' },
                    ].map((notification, index) => (
                      <motion.div
                        key={notification.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{notification.label}</h4>
                            {notification.key === 'securityAlerts' && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <Switch
                          checked={settings[notification.key as keyof UserSettings] as boolean}
                          onCheckedChange={(checked) => handleSettingChange(notification.key as keyof UserSettings, checked)}
                          disabled={notification.key === 'securityAlerts'}
                        />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      Security & Privacy
                    </CardTitle>
                    <CardDescription>Manage your account security and privacy settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Two-Factor Auth */}
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {settings.twoFactorAuth && (
                          <Badge variant="outline" className="text-green-600 border-green-200">Enabled</Badge>
                        )}
                        <Switch
                          checked={settings.twoFactorAuth}
                          onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                        />
                      </div>
                    </div>

                    {/* Session Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Session Management</h3>
                      <div className="space-y-2">
                        <Label>Session Timeout</Label>
                        <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                          <SelectTrigger className="focus:ring-2 focus:ring-green-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Privacy</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Data Retention</Label>
                          <Select value={settings.dataRetention} onValueChange={(value) => handleSettingChange('dataRetention', value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-green-500/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1year">1 year</SelectItem>
                              <SelectItem value="2years">2 years</SelectItem>
                              <SelectItem value="5years">5 years</SelectItem>
                              <SelectItem value="indefinite">Indefinite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">Share Analytics</h4>
                            <p className="text-sm text-muted-foreground">Help improve our service by sharing anonymous usage data</p>
                          </div>
                          <Switch
                            checked={settings.shareAnalytics}
                            onCheckedChange={(checked) => handleSettingChange('shareAnalytics', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-blue-500" />
                      Dashboard Preferences
                    </CardTitle>
                    <CardDescription>Customize your dashboard experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Default View</Label>
                        <Select value={settings.defaultView} onValueChange={(value) => handleSettingChange('defaultView', value)}>
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="overview">Overview</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                            <SelectItem value="campaigns">Campaigns</SelectItem>
                            <SelectItem value="reports">Reports</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Auto Refresh Interval</Label>
                        <Select 
                          value={settings.refreshInterval} 
                          onValueChange={(value) => handleSettingChange('refreshInterval', value)}
                          disabled={!settings.autoRefresh}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium">Auto Refresh</h4>
                          <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                        </div>
                        <Switch
                          checked={settings.autoRefresh}
                          onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium">Compact Mode</h4>
                          <p className="text-sm text-muted-foreground">Use a more compact layout to show more data</p>
                        </div>
                        <Switch
                          checked={settings.compactMode}
                          onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Billing & Subscription
                    </CardTitle>
                    <CardDescription>Manage your subscription and billing information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Plan */}
                    <div className="p-6 border border-border rounded-lg bg-gradient-to-r from-purple-primary/5 to-accent-pink/5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Professional Plan</h3>
                          <p className="text-muted-foreground">Full access to all features</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-purple-primary to-accent-pink text-white">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">$99<span className="text-base font-normal text-muted-foreground">/month</span></span>
                        <Button variant="outline">Change Plan</Button>
                      </div>
                    </div>

                    {/* Usage */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Usage</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-border rounded-lg text-center">
                          <div className="text-2xl font-bold text-accent-pink">47</div>
                          <div className="text-sm text-muted-foreground">Active Campaigns</div>
                          <div className="text-xs text-muted-foreground mt-1">of 100 included</div>
                        </div>
                        <div className="p-4 border border-border rounded-lg text-center">
                          <div className="text-2xl font-bold text-accent-blue">156</div>
                          <div className="text-sm text-muted-foreground">Total Campaigns</div>
                          <div className="text-xs text-muted-foreground mt-1">Unlimited</div>
                        </div>
                        <div className="p-4 border border-border rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-500">98.5%</div>
                          <div className="text-sm text-muted-foreground">Uptime</div>
                          <div className="text-xs text-muted-foreground mt-1">SLA: 99.9%</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Method */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Method</h3>
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Billing History</h3>
                        <Button variant="outline" size="sm">View All</Button>
                      </div>
                      <div className="space-y-2">
                        {[
                          { date: "Jan 1, 2024", amount: "$99.00", status: "Paid" },
                          { date: "Dec 1, 2023", amount: "$99.00", status: "Paid" },
                          { date: "Nov 1, 2023", amount: "$99.00", status: "Paid" },
                        ].map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                              <p className="font-medium">{invoice.date}</p>
                              <p className="text-sm text-muted-foreground">Professional Plan</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{invoice.amount}</p>
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
