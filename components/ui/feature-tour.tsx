"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  BarChart3, 
  Users, 
  Hash, 
  BookOpen, 
  Settings,
  X,
  ArrowRight,
  CheckCircle
} from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  href: string
  category: 'core' | 'ai' | 'admin' | 'analytics'
  isNew?: boolean
}

const features: Feature[] = [
  {
    id: 'ai-stories',
    title: 'AI Story Builder',
    description: 'Generate compelling stories with AI assistance',
    icon: Sparkles,
    href: '/dashboard/ai-stories',
    category: 'ai',
    isNew: true
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Track performance with customizable metrics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    category: 'analytics'
  },
  {
    id: 'stories',
    title: 'Story Management',
    description: 'Create and manage your impact stories',
    icon: BookOpen,
    href: '/dashboard/stories',
    category: 'core'
  },
  {
    id: 'nmbrs',
    title: 'NMBR Management',
    description: 'Generate and track unique NMBRs',
    icon: Hash,
    href: '/dashboard/nmbrs',
    category: 'core'
  },
  {
    id: 'team',
    title: 'Team Management',
    description: 'Manage team members and permissions',
    icon: Users,
    href: '/admin/team',
    category: 'admin'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure your organization settings',
    icon: Settings,
    href: '/dashboard/settings',
    category: 'core'
  }
]

const categories = {
  core: { label: 'Core Features', color: 'bg-blue-100 text-blue-800' },
  ai: { label: 'AI Features', color: 'bg-purple-100 text-purple-800' },
  admin: { label: 'Admin Features', color: 'bg-red-100 text-red-800' },
  analytics: { label: 'Analytics', color: 'bg-green-100 text-green-800' }
}

export function FeatureTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [completedFeatures, setCompletedFeatures] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem('feature_tour_seen')
    if (!hasSeenTour) {
      setIsOpen(true)
    }

    // Load completed features
    const completed = localStorage.getItem('feature_tour_completed') || '[]'
    setCompletedFeatures(JSON.parse(completed))
  }, [])

  const handleFeatureClick = (feature: Feature) => {
    // Mark as completed
    const newCompleted = [...completedFeatures, feature.id]
    setCompletedFeatures(newCompleted)
    localStorage.setItem('feature_tour_completed', JSON.stringify(newCompleted))
    
    // Navigate to feature
    window.location.href = feature.href
  }

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('feature_tour_seen', 'true')
  }

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Welcome to NMBR Platform</CardTitle>
            <CardDescription>
              Discover the powerful features available to help you create compelling stories and track engagement
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Features
            </Button>
            {Object.entries(categories).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map((feature) => {
              const Icon = feature.icon
              const isCompleted = completedFeatures.includes(feature.id)
              
              return (
                <Card 
                  key={feature.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'hover:border-primary/20'
                  }`}
                  onClick={() => handleFeatureClick(feature)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isCompleted ? 'bg-green-100' : 'bg-primary/10'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isCompleted ? 'text-green-600' : 'text-primary'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {feature.title}
                            {feature.isNew && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                            {isCompleted && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge className={categories[feature.category].color}>
                        {categories[feature.category].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      {feature.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      {isCompleted ? 'View Again' : 'Explore'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Progress */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Feature Discovery Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedFeatures.length} of {features.length} explored
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedFeatures.length / features.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Maybe Later
            </Button>
            <Button onClick={handleClose}>
              Start Exploring
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
