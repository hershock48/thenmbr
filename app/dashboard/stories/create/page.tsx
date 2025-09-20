"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Hash,
  ImageIcon,
  Video,
  FileText,
  Users,
  DollarSign,
  Target,
  Heart,
  Save,
  Share2,
  CheckCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useSubscription } from "@/contexts/SubscriptionContext"

interface StoryData {
  title: string
  description: string
  beneficiaryName: string
  beneficiaryAge?: number
  location: string
  fundingGoal: number
  currentAmount: number
  impactDescription: string
  media: Array<{
    type: "image" | "video" | "document"
    url: string
    name: string
  }>
}

const impactTemplates = [
  {
    id: "education",
    name: "Education & Youth",
    icon: Users,
    description: "Supporting students and educational programs",
    template: {
      title: "Supporting [Name]'s Educational Journey",
      description: "Help [Name] achieve their educational dreams and create a brighter future for themselves and their community.",
      impactDescription: "Your donation will directly fund [Name]'s education, including tuition, books, supplies, and living expenses. This investment in education creates a ripple effect that benefits entire communities."
    }
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: Heart,
    description: "Providing essential medical care and treatment",
    template: {
      title: "Medical Care for [Name]",
      description: "Help [Name] receive the critical medical care they need to recover and thrive.",
      impactDescription: "Your donation will cover medical expenses, treatments, medications, and follow-up care, giving [Name] the best chance at recovery and a healthy future."
    }
  },
  {
    id: "community",
    name: "Community Development",
    icon: Target,
    description: "Building stronger communities and infrastructure",
    template: {
      title: "Building Hope in [Location]",
      description: "Support community development projects that create lasting positive change.",
      impactDescription: "Your donation will fund community projects, infrastructure improvements, and programs that benefit hundreds of families in the area."
    }
  }
]

export default function CreateStoryPage() {
  const { terminology } = useOrganization()
  const { canCreateNmbr } = useSubscription()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  const [storyData, setStoryData] = useState<StoryData>({
    title: "",
    description: "",
    beneficiaryName: "",
    beneficiaryAge: undefined,
    location: "",
    fundingGoal: 0,
    currentAmount: 0,
    impactDescription: "",
    media: []
  })

  const totalSteps = 4

  const handleTemplateSelect = (templateId: string) => {
    const template = impactTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setStoryData(prev => ({
        ...prev,
        title: template.template.title,
        description: template.template.description,
        impactDescription: template.template.impactDescription
      }))
    }
  }

  const handleInputChange = (field: keyof StoryData, value: string | number) => {
    setStoryData(prev => ({ ...prev, [field]: value }))
  }

  const handleMediaUpload = (type: "image" | "video" | "document") => {
    // Simulate file upload
    const newMedia = {
      type,
      url: `https://via.placeholder.com/300x200?text=${type.toUpperCase()}`,
      name: `uploaded_${type}_${Date.now()}`
    }
    setStoryData(prev => ({
      ...prev,
      media: [...prev.media, newMedia]
    }))
  }

  const handlePublish = async () => {
    if (!canCreateNmbr) {
      // Show upgrade prompt
      return
    }

    setIsPublishing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsPublishing(false)
    setShowSuccess(true)
  }

  const getProgressPercentage = () => {
    let completed = 0
    if (storyData.title) completed++
    if (storyData.description) completed++
    if (storyData.beneficiaryName) completed++
    if (storyData.fundingGoal > 0) completed++
    if (storyData.impactDescription) completed++
    return (completed / 5) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Inspirational Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative border-b border-blue-100/50 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Create Your Impact Story
                    </h1>
                    <p className="text-slate-600 text-lg">Share your mission and inspire hearts to give</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowPreview(true)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Story
                </Button>
                <Button 
                  onClick={handlePublish} 
                  disabled={!canCreateNmbr || isPublishing}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing Your Story...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Publish & Inspire
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inspirational Progress Tracker */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Your Story Journey</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">
                        {Math.round(getProgressPercentage())}%
                      </span>
                      <p className="text-sm text-slate-600">Complete</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={getProgressPercentage()} 
                      className="h-3 bg-blue-100" 
                    />
                    <div className="absolute inset-0 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                         style={{ width: `${getProgressPercentage()}%` }} />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      storyData.title ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                    }`}>
                      <CheckCircle className={`h-5 w-5 ${storyData.title ? 'text-green-600' : 'text-slate-400'}`} />
                      <span className={`font-medium ${storyData.title ? 'text-green-800' : 'text-slate-600'}`}>
                        Story Title
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      storyData.description ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                    }`}>
                      <CheckCircle className={`h-5 w-5 ${storyData.description ? 'text-green-600' : 'text-slate-400'}`} />
                      <span className={`font-medium ${storyData.description ? 'text-green-800' : 'text-slate-600'}`}>
                        Description
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      storyData.beneficiaryName ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                    }`}>
                      <CheckCircle className={`h-5 w-5 ${storyData.beneficiaryName ? 'text-green-600' : 'text-slate-400'}`} />
                      <span className={`font-medium ${storyData.beneficiaryName ? 'text-green-800' : 'text-slate-600'}`}>
                        Beneficiary
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      storyData.fundingGoal > 0 ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                    }`}>
                      <CheckCircle className={`h-5 w-5 ${storyData.fundingGoal > 0 ? 'text-green-600' : 'text-slate-400'}`} />
                      <span className={`font-medium ${storyData.fundingGoal > 0 ? 'text-green-800' : 'text-slate-600'}`}>
                        Funding Goal
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Inspirational Template Selection */}
            {currentStep === 1 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Choose Your Impact Story
                      </CardTitle>
                      <CardDescription className="text-lg text-slate-600 mt-2">
                        Every great story starts with inspiration. Pick the template that best represents your mission.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {impactTemplates.map((template, index) => {
                      const gradients = [
                        "from-blue-50 to-indigo-100",
                        "from-green-50 to-emerald-100", 
                        "from-purple-50 to-pink-100"
                      ]
                      const iconGradients = [
                        "from-blue-500 to-indigo-600",
                        "from-green-500 to-emerald-600",
                        "from-purple-500 to-pink-600"
                      ]
                      
                      return (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-gradient-to-br ${gradients[index]} ${
                            selectedTemplate === template.id 
                              ? 'ring-2 ring-purple-500 shadow-xl scale-105' 
                              : 'hover:shadow-lg'
                          }`}
                        >
                          <div
                            className="w-full h-full cursor-pointer hover:bg-white/20 transition-all duration-200 rounded-lg"
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${iconGradients[index]} rounded-2xl flex items-center justify-center shadow-lg`}>
                                  <template.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-slate-800">{template.name}</h3>
                                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                                </div>
                              </div>
                              
                              {selectedTemplate === template.id ? (
                                <div className="bg-white/80 rounded-xl p-4 border border-purple-200">
                                  <div className="flex items-center gap-2 text-purple-700">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">Selected Template</span>
                                  </div>
                                  <p className="text-xs text-purple-600 mt-1">
                                    This template will help you create an inspiring story
                                  </p>
                                </div>
                              ) : (
                                <div className="text-center py-2">
                                  <span className="text-xs text-slate-500 bg-white/60 px-3 py-1 rounded-full border border-slate-200">
                                    Click to select
                                  </span>
                                </div>
                              )}
                            </div>
                            </CardContent>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
                
                {/* Continue Button */}
                {selectedTemplate && (
                  <div className="flex justify-center pt-6">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Continue with {impactTemplates.find(t => t.id === selectedTemplate)?.name}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {/* Step 2: Inspirational Story Builder */}
            {currentStep === 2 && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Tell Your Story
                      </CardTitle>
                      <CardDescription className="text-lg text-slate-600 mt-2">
                        Share the details that will touch hearts and inspire action. Every detail matters.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-blue-600" />
                        Story Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Supporting Maria's Educational Dreams"
                        value={storyData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <p className="text-sm text-slate-500">Make it personal and inspiring</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiaryName" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        Beneficiary Name *
                      </Label>
                      <Input
                        id="beneficiaryName"
                        placeholder="e.g., Maria Rodriguez"
                        value={storyData.beneficiaryName}
                        onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
                        className="h-12 text-lg border-2 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                      />
                      <p className="text-sm text-slate-500">The person who will benefit from donations</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Story Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell their story... What challenges are they facing? How will your support change their life? Be specific and heartfelt."
                      className="min-h-40 text-lg border-2 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                      value={storyData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                    <p className="text-sm text-slate-500">Share the details that will touch donors' hearts</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="e.g., San Francisco, CA"
                        value={storyData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="h-12 text-lg border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                      />
                      <p className="text-sm text-slate-500">Where is this impact happening?</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiaryAge" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-600" />
                        Age (Optional)
                      </Label>
                      <Input
                        id="beneficiaryAge"
                        type="number"
                        placeholder="e.g., 25"
                        value={storyData.beneficiaryAge || ""}
                        onChange={(e) => handleInputChange("beneficiaryAge", parseInt(e.target.value) || 0)}
                        className="h-12 text-lg border-2 border-slate-200 focus:border-pink-500 focus:ring-pink-500/20"
                      />
                      <p className="text-sm text-slate-500">Help donors connect with the person</p>
                    </div>
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Templates
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Continue to Funding
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Funding & Impact */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Funding & Impact</CardTitle>
                  <CardDescription>
                    Set your funding goal and explain the impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fundingGoal">Funding Goal ($) *</Label>
                      <Input
                        id="fundingGoal"
                        type="number"
                        placeholder="e.g., 5000"
                        value={storyData.fundingGoal || ""}
                        onChange={(e) => handleInputChange("fundingGoal", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentAmount">Current Amount ($)</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        placeholder="e.g., 0"
                        value={storyData.currentAmount || ""}
                        onChange={(e) => handleInputChange("currentAmount", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="impactDescription">Impact Description *</Label>
                    <Textarea
                      id="impactDescription"
                      placeholder="Explain how donations will be used and what impact they'll create..."
                      className="min-h-32"
                      value={storyData.impactDescription}
                      onChange={(e) => handleInputChange("impactDescription", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Media & Final Review */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Media (Optional)</CardTitle>
                  <CardDescription>
                    Photos and videos help donors connect with your story
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleMediaUpload("image")}
                    >
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-sm">Add Photo</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleMediaUpload("video")}
                    >
                      <Video className="h-6 w-6" />
                      <span className="text-sm">Add Video</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleMediaUpload("document")}
                    >
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Add Document</span>
                    </Button>
                  </div>

                  {storyData.media.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Uploaded Media</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {storyData.media.map((media, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                              {media.type === "image" ? (
                                <img 
                                  src={media.url} 
                                  alt={media.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-muted-foreground">
                                  {media.type === "video" ? <Video className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setStoryData(prev => ({
                                ...prev,
                                media: prev.media.filter((_, i) => i !== index)
                              }))}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps))}
                disabled={currentStep === totalSteps}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* NMBR Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Your NMBR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto mb-3">
                    NMBR
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your unique story code will be generated when you publish
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Story Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Story Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{storyData.title || "Your Story Title"}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {storyData.description || "Your story description will appear here..."}
                    </p>
                  </div>
                  
                  {storyData.fundingGoal > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Funding Progress</span>
                        <span>
                          ${storyData.currentAmount.toLocaleString()} / ${storyData.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(storyData.currentAmount / storyData.fundingGoal) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}

                  {storyData.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {storyData.media.slice(0, 4).map((media, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                          {media.type === "image" ? (
                            <img 
                              src={media.url} 
                              alt={media.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-muted-foreground">
                              {media.type === "video" ? <Video className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Story Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                  <p className="text-sm">Use real names and specific details to create emotional connection</p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm">Set realistic funding goals that donors can help achieve</p>
                </div>
                <div className="flex items-start gap-3">
                  <ImageIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <p className="text-sm">High-quality photos and videos increase engagement by 3x</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Story Preview</DialogTitle>
            <DialogDescription>
              This is how your story will appear to donors
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{storyData.title || "Your Story Title"}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {storyData.description || "Your story description will appear here..."}
              </p>
            </div>
            
            {storyData.fundingGoal > 0 && (
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Funding Goal</h3>
                  <span className="text-2xl font-bold text-primary">
                    ${storyData.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={(storyData.currentAmount / storyData.fundingGoal) * 100} 
                  className="h-3 mb-2" 
                />
                <p className="text-sm text-muted-foreground">
                  ${storyData.currentAmount.toLocaleString()} raised of ${storyData.fundingGoal.toLocaleString()} goal
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Impact</h3>
              <p className="text-muted-foreground">
                {storyData.impactDescription || "Your impact description will appear here..."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <DialogTitle className="text-3xl font-bold text-green-900 mb-4">
                🎉 Your Impact Story is Live!
              </DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground mb-6">
                Congratulations! Your story is now live and ready to connect with donors. 
                Here's what happens next:
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Get Your NMBR Code</h4>
                    <p className="text-sm text-muted-foreground">Your unique code will be generated and ready to share with donors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Customize Your Widget</h4>
                    <p className="text-sm text-muted-foreground">Embed the donation widget on your website to start receiving donations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Track Your Impact</h4>
                    <p className="text-sm text-muted-foreground">Monitor donations, engagement, and donor relationships in your dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90" 
                onClick={() => window.location.href = "/dashboard/stories"}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Your Story
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.location.href = "/dashboard/widget"}
              >
                <Hash className="w-4 h-4 mr-2" />
                Customize Widget
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
