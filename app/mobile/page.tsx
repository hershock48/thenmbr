"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Smartphone,
  Download,
  QrCode,
  Camera,
  Bell,
  Heart,
  Share2,
  Settings,
  User,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Globe,
  Zap,
  Shield,
  Lock,
  Fingerprint,
  Wifi,
  Battery,
  Signal,
  MoreHorizontal,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  Menu,
  Search,
  Filter,
  Sort,
  RefreshCw,
  Star,
  Bookmark,
  Flag,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock as ClockIcon,
  Activity,
  Award,
  Gift,
  Sparkles
} from "lucide-react"

interface MobileFeature {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'available' | 'coming-soon' | 'beta'
  category: 'core' | 'analytics' | 'social' | 'automation'
  priority: 'high' | 'medium' | 'low'
}

interface AppVersion {
  version: string
  releaseDate: string
  features: string[]
  bugFixes: string[]
  improvements: string[]
}

export default function MobilePage() {
  // Use default terminology if not in organization context
  const terminology = {
    donations: 'donations',
    subscribers: 'subscribers', 
    fundraising: 'fundraising',
    campaigns: 'campaigns',
    supporters: 'supporters',
    stories: 'stories',
    analytics: 'analytics',
    engagement: 'engagement'
  }
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | 'web'>('ios')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<MobileFeature | null>(null)

  const mobileFeatures: MobileFeature[] = [
    // Core Features
    {
      id: '1',
      name: 'Story Creation',
      description: 'Create and edit impact stories on the go',
      icon: Heart,
      status: 'available',
      category: 'core',
      priority: 'high'
    },
    {
      id: '2',
      name: 'QR Code Scanner',
      description: 'Scan NMBR codes to view stories instantly',
      icon: QrCode,
      status: 'available',
      category: 'core',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Donation Processing',
      description: 'Accept donations directly through the app',
      icon: DollarSign,
      status: 'available',
      category: 'core',
      priority: 'high'
    },
    {
      id: '4',
      name: 'Push Notifications',
      description: 'Real-time updates and engagement alerts',
      icon: Bell,
      status: 'available',
      category: 'core',
      priority: 'high'
    },
    {
      id: '5',
      name: 'Offline Mode',
      description: 'View stories and basic features without internet',
      icon: Wifi,
      status: 'coming-soon',
      category: 'core',
      priority: 'medium'
    },
    // Analytics Features
    {
      id: '6',
      name: 'Real-time Analytics',
      description: 'Track performance and engagement in real-time',
      icon: BarChart3,
      status: 'available',
      category: 'analytics',
      priority: 'high'
    },
    {
      id: '7',
      name: 'Geographic Insights',
      description: 'See where your donors are located',
      icon: Globe,
      status: 'available',
      category: 'analytics',
      priority: 'medium'
    },
    {
      id: '8',
      name: 'Predictive Analytics',
      description: 'AI-powered insights and recommendations',
      icon: TrendingUp,
      status: 'beta',
      category: 'analytics',
      priority: 'medium'
    },
    // Social Features
    {
      id: '9',
      name: 'Social Sharing',
      description: 'Share stories across social media platforms',
      icon: Share2,
      status: 'available',
      category: 'social',
      priority: 'high'
    },
    {
      id: '10',
      name: 'Community Feed',
      description: 'Connect with other nonprofits and share success',
      icon: Users,
      status: 'available',
      category: 'social',
      priority: 'medium'
    },
    {
      id: '11',
      name: 'Donor Comments',
      description: 'Allow donors to comment and interact with stories',
      icon: MessageSquare,
      status: 'coming-soon',
      category: 'social',
      priority: 'low'
    },
    // Automation Features
    {
      id: '12',
      name: 'Auto-responders',
      description: 'Automatically respond to donor interactions',
      icon: Zap,
      status: 'available',
      category: 'automation',
      priority: 'medium'
    },
    {
      id: '13',
      name: 'Smart Scheduling',
      description: 'AI-powered content scheduling and optimization',
      icon: Calendar,
      status: 'beta',
      category: 'automation',
      priority: 'low'
    },
    {
      id: '14',
      name: 'Voice Commands',
      description: 'Control the app using voice commands',
      icon: Volume2,
      status: 'coming-soon',
      category: 'automation',
      priority: 'low'
    }
  ]

  const appVersions: AppVersion[] = [
    {
      version: '2.1.0',
      releaseDate: '2024-03-15',
      features: [
        'Enhanced QR code scanning with AR overlay',
        'Real-time collaboration on story creation',
        'Advanced analytics dashboard',
        'Dark mode support'
      ],
      bugFixes: [
        'Fixed crash when scanning certain QR codes',
        'Resolved notification delivery issues',
        'Improved app performance on older devices'
      ],
      improvements: [
        'Faster story loading times',
        'Improved user interface',
        'Better accessibility support'
      ]
    },
    {
      version: '2.0.0',
      releaseDate: '2024-02-01',
      features: [
        'Complete UI redesign',
        'Offline story viewing',
        'Push notification system',
        'Social sharing integration'
      ],
      bugFixes: [
        'Fixed login issues on Android',
        'Resolved data sync problems',
        'Improved memory usage'
      ],
      improvements: [
        'Better user experience',
        'Faster app startup',
        'Improved security'
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'coming-soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'beta': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Heart className="w-4 h-4" />
      case 'analytics': return <BarChart3 className="w-4 h-4" />
      case 'social': return <Users className="w-4 h-4" />
      case 'automation': return <Zap className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">NMBR Mobile App</h1>
              <p className="text-muted-foreground mt-2">
                Take your {terminology.fundraising.toLowerCase()} on the go with our powerful mobile app
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview App
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Platform</CardTitle>
                <CardDescription>Download NMBR for your preferred platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'ios', name: 'iOS', icon: Smartphone, description: 'iPhone & iPad' },
                    { id: 'android', name: 'Android', icon: Smartphone, description: 'Phone & Tablet' },
                    { id: 'web', name: 'Web App', icon: Globe, description: 'Progressive Web App' }
                  ].map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id as any)}
                      className={`p-6 border rounded-lg text-left transition-colors ${
                        selectedPlatform === platform.id
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <platform.icon className="w-8 h-8 mb-3" />
                      <h3 className="font-semibold mb-1">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>App Features</CardTitle>
                <CardDescription>Everything you need to manage your {terminology.fundraising.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="core" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="core">Core</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="automation">Automation</TabsTrigger>
                  </TabsList>

                  {['core', 'analytics', 'social', 'automation'].map((category) => (
                    <TabsContent key={category} value={category} className="space-y-3">
                      {mobileFeatures
                        .filter(feature => feature.category === category)
                        .map((feature) => (
                          <div
                            key={feature.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedFeature(feature)}
                          >
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <feature.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{feature.name}</h3>
                                <Badge className={getStatusColor(feature.status)}>
                                  {feature.status}
                                </Badge>
                                <span className={`text-xs ${getPriorityColor(feature.priority)}`}>
                                  {feature.priority} priority
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* App Versions */}
            <Card>
              <CardHeader>
                <CardTitle>Release Notes</CardTitle>
                <CardDescription>Latest updates and improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {appVersions.map((version, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Version {version.version}</h3>
                        <Badge variant="outline">{version.releaseDate}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-green-600 mb-1">New Features</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {version.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-blue-600 mb-1">Bug Fixes</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {version.bugFixes.map((fix, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <RotateCcw className="w-3 h-3 text-blue-600 mt-1 flex-shrink-0" />
                                {fix}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-purple-600 mb-1">Improvements</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {version.improvements.map((improvement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <TrendingUp className="w-3 h-3 text-purple-600 mt-1 flex-shrink-0" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Download Stats</CardTitle>
                <CardDescription>App performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">50K+</div>
                    <div className="text-xs text-muted-foreground">iOS Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">75K+</div>
                    <div className="text-xs text-muted-foreground">Android Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4.8★</div>
                    <div className="text-xs text-muted-foreground">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">95%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>Your data is protected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Biometric authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Touch ID / Face ID</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="text-sm">GDPR compliant</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Story
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feature Detail Dialog */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFeature && <selectedFeature.icon className="w-5 h-5" />}
              {selectedFeature?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedFeature?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeature && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(selectedFeature.status)}>
                  {selectedFeature.status}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(selectedFeature.priority)}>
                  {selectedFeature.priority} priority
                </Badge>
                <Badge variant="outline">
                  {getCategoryIcon(selectedFeature.category)}
                  <span className="ml-1 capitalize">{selectedFeature.category}</span>
                </Badge>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Feature Details</h4>
                <p className="text-sm text-muted-foreground">
                  This feature allows you to {selectedFeature.description.toLowerCase()}. 
                  It's designed to enhance your {terminology.fundraising.toLowerCase()} experience 
                  and help you connect with donors more effectively.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">How it works:</h5>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Access the feature from the main menu</li>
                    <li>2. Follow the intuitive interface</li>
                    <li>3. Save your changes automatically</li>
                    <li>4. Share with your donors</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* App Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>App Preview</DialogTitle>
            <DialogDescription>
              See how NMBR looks and works on your device
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              <Button size="sm" variant={selectedPlatform === 'ios' ? 'default' : 'outline'}>
                <Smartphone className="w-4 h-4 mr-2" />
                iOS
              </Button>
              <Button size="sm" variant={selectedPlatform === 'android' ? 'default' : 'outline'}>
                <Smartphone className="w-4 h-4 mr-2" />
                Android
              </Button>
              <Button size="sm" variant={selectedPlatform === 'web' ? 'default' : 'outline'}>
                <Globe className="w-4 h-4 mr-2" />
                Web
              </Button>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-96 bg-black rounded-3xl p-2">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                    <div className="h-8 bg-gray-100 flex items-center justify-center">
                      <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full"></div>
                        <div>
                          <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                          <div className="h-2 bg-gray-100 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-20 bg-gray-100 rounded"></div>
                        <div className="h-20 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}