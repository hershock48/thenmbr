"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Eye,
  Hash,
  Coffee,
  Shirt,
  Mountain,
  X,
  ImageIcon,
  Video,
  FileText,
  Users,
  GraduationCap,
  Stethoscope,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useOrganization } from "@/contexts/OrganizationContext"

const industryTemplates = [
  // Business templates
  {
    id: "coffee",
    name: "Coffee & Beverages",
    icon: Coffee,
    description: "Perfect for coffee roasters, tea companies, and beverage brands",
    orgTypes: ["business"],
    template: {
      title: "From Bean to Cup: [Product Name]",
      content:
        "Discover the journey of your coffee from the farm where it was grown to the cup in your hands. Meet the farmers who carefully cultivated these beans and learn about the sustainable practices that make each sip meaningful.",
    },
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    icon: Shirt,
    description: "Ideal for clothing brands, accessories, and fashion retailers",
    orgTypes: ["business"],
    template: {
      title: "Crafted with Care: [Product Name]",
      content:
        "Every thread tells a story. Learn about the artisans who created this piece, the sustainable materials used, and the positive impact your purchase makes on communities around the world.",
    },
  },
  {
    id: "outdoor",
    name: "Outdoor & Adventure",
    icon: Mountain,
    description: "Great for outdoor gear, sports equipment, and adventure brands",
    orgTypes: ["business"],
    template: {
      title: "Built for Adventure: [Product Name]",
      content:
        "This gear was designed by adventurers, for adventurers. Discover the testing process, meet the athletes who helped develop it, and see how your purchase supports conservation efforts.",
    },
  },
  {
    id: "education",
    name: "Education & Learning",
    icon: GraduationCap,
    description: "Perfect for education nonprofits, scholarship programs, and learning initiatives",
    orgTypes: ["nonprofit"],
    template: {
      title: "[Student Name]'s Educational Journey",
      content:
        "Meet [Student Name], whose life is being transformed through education. Follow their journey from the classroom to their dreams, and see how your donation is making a real difference in their future. Every dollar helps provide books, supplies, and opportunities that change lives.",
    },
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: Stethoscope,
    description: "Ideal for medical nonprofits, health programs, and patient care initiatives",
    orgTypes: ["nonprofit"],
    template: {
      title: "Healing Hope: [Patient Name]'s Story",
      content:
        "This is [Patient Name]'s story of courage and recovery. Thanks to donors like you, they're receiving the medical care they desperately need. Follow their healing journey and see the direct impact of your generosity on their path to wellness.",
    },
  },
  {
    id: "housing",
    name: "Housing & Shelter",
    icon: Home,
    description: "Great for housing nonprofits, homeless shelters, and community development",
    orgTypes: ["nonprofit"],
    template: {
      title: "A Place to Call Home: [Family Name]'s Story",
      content:
        "Meet the [Family Name] family, who are building a new life with your help. From homelessness to hope, follow their journey as they work toward stable housing and a brighter future. Your support provides more than shelter—it provides dignity and opportunity.",
    },
  },
  {
    id: "community",
    name: "Community Impact",
    icon: Users,
    description: "Perfect for community development, social services, and local impact programs",
    orgTypes: ["nonprofit", "grassroots"],
    template: {
      title: "Transforming Our Community: [Project Name]",
      content:
        "See how your support is creating lasting change in our community. This project brings together neighbors, volunteers, and supporters like you to address real needs and build a stronger, more connected community for everyone.",
    },
  },
]

export default function CreateStoryPage() {
  const { orgType } = useOrganization()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [storyData, setStoryData] = useState({
    title: "",
    content: "",
    productName: "",
    productSku: "",
    industry: "",
    beneficiaryName: "",
    impactGoal: "",
    fundingGoal: "",
    currentFunding: "",
    media: [] as { type: string; name: string; url: string }[],
  })
  const [showPreview, setShowPreview] = useState(false)
  const [nmbrCode, setNmbrCode] = useState<string | null>(null)

  const availableTemplates = industryTemplates.filter((template) => template.orgTypes.includes(orgType || "business"))

  const handleTemplateSelect = (templateId: string) => {
    const template = availableTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setStoryData((prev) => ({
        ...prev,
        title: template.template.title,
        content: template.template.content,
        industry: template.name,
      }))
    }
  }

  const handleMediaUpload = (type: string) => {
    // Simulate file upload
    const newMedia = {
      type,
      name: `${type}-${Date.now()}.${type === "image" ? "jpg" : type === "video" ? "mp4" : "pdf"}`,
      url: `/placeholder.svg?height=200&width=300&query=${type} placeholder`,
    }
    setStoryData((prev) => ({
      ...prev,
      media: [...prev.media, newMedia],
    }))
  }

  const removeMedia = (index: number) => {
    setStoryData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }))
  }

  const generateNmbrCode = () => {
    // Simulate NMBR generation
    const itemName = orgType === "nonprofit" ? storyData.beneficiaryName || "impact story" : storyData.productName
    setNmbrCode(`/placeholder.svg?height=200&width=200&query=NMBR for ${itemName}`)
  }

  const handleSave = () => {
    console.log("[v0] Saving story:", storyData)
    // Implement save functionality
  }

  const handlePublish = () => {
    console.log("[v0] Publishing story:", storyData)
    // Implement publish functionality
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                  {orgType === "nonprofit" ? "Create Impact Story" : "Create Product Story"}
                </h1>
                <p className="text-muted-foreground">
                  {orgType === "nonprofit"
                    ? "Build compelling stories that connect donors to the people they help"
                    : "Build engaging stories that connect customers to your products"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleSave}>
                Save Draft
              </Button>
              <Button onClick={handlePublish}>Publish Story</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="details">{orgType === "nonprofit" ? "Impact" : "Product"}</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose a Template</CardTitle>
                    <CardDescription>
                      {orgType === "nonprofit"
                        ? "Start with a template designed for nonprofit impact stories"
                        : "Start with an industry-specific template to create compelling stories faster"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <template.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-card-foreground">{template.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Story Content</CardTitle>
                    <CardDescription>
                      {orgType === "nonprofit"
                        ? "Craft your impact story that will inspire donors and show real change"
                        : "Craft your product story that will engage customers and drive sales"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Story Title</Label>
                      <Input
                        id="title"
                        placeholder={
                          orgType === "nonprofit"
                            ? "Enter a compelling title for your impact story"
                            : "Enter a compelling title for your story"
                        }
                        value={storyData.title}
                        onChange={(e) => setStoryData((prev) => ({ ...prev, title: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Story Content</Label>
                      <Textarea
                        id="content"
                        placeholder={
                          orgType === "nonprofit"
                            ? "Tell the story of impact and transformation..."
                            : "Tell the story behind your product..."
                        }
                        value={storyData.content}
                        onChange={(e) => setStoryData((prev) => ({ ...prev, content: e.target.value }))}
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Media Assets</CardTitle>
                    <CardDescription>
                      Add images, videos, and documents to make your story more engaging
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2 bg-transparent"
                        onClick={() => handleMediaUpload("image")}
                      >
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-sm">Add Image</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2 bg-transparent"
                        onClick={() => handleMediaUpload("video")}
                      >
                        <Video className="h-6 w-6" />
                        <span className="text-sm">Add Video</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2 bg-transparent"
                        onClick={() => handleMediaUpload("document")}
                      >
                        <FileText className="h-6 w-6" />
                        <span className="text-sm">Add Document</span>
                      </Button>
                    </div>

                    {storyData.media.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Uploaded Media</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {storyData.media.map((media, index) => (
                            <div key={index} className="relative group">
                              <Card>
                                <CardContent className="p-3">
                                  <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center">
                                    {media.type === "image" && <ImageIcon className="h-8 w-8 text-muted-foreground" />}
                                    {media.type === "video" && <Video className="h-8 w-8 text-muted-foreground" />}
                                    {media.type === "document" && (
                                      <FileText className="h-8 w-8 text-muted-foreground" />
                                    )}
                                  </div>
                                  <p className="text-sm font-medium truncate">{media.name}</p>
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {media.type}
                                  </Badge>
                                </CardContent>
                              </Card>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMedia(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{orgType === "nonprofit" ? "Impact Information" : "Product Information"}</CardTitle>
                    <CardDescription>
                      {orgType === "nonprofit"
                        ? "Add details about the beneficiary and impact goals"
                        : "Link this story to specific products and generate NMBRs"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orgType === "nonprofit" ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                            <Input
                              id="beneficiaryName"
                              placeholder="Enter beneficiary name"
                              value={storyData.beneficiaryName}
                              onChange={(e) => setStoryData((prev) => ({ ...prev, beneficiaryName: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="impactGoal">Impact Goal</Label>
                            <Input
                              id="impactGoal"
                              placeholder="e.g., 12 months of education"
                              value={storyData.impactGoal}
                              onChange={(e) => setStoryData((prev) => ({ ...prev, impactGoal: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
                            <Input
                              id="fundingGoal"
                              type="number"
                              placeholder="Enter funding goal"
                              value={storyData.fundingGoal}
                              onChange={(e) => setStoryData((prev) => ({ ...prev, fundingGoal: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="currentFunding">Current Funding ($)</Label>
                            <Input
                              id="currentFunding"
                              type="number"
                              placeholder="Enter current funding"
                              value={storyData.currentFunding}
                              onChange={(e) => setStoryData((prev) => ({ ...prev, currentFunding: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="category">Impact Category</Label>
                          <Select
                            value={storyData.industry}
                            onValueChange={(value) => setStoryData((prev) => ({ ...prev, industry: value }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select impact category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Education & Learning">Education & Learning</SelectItem>
                              <SelectItem value="Healthcare & Medical">Healthcare & Medical</SelectItem>
                              <SelectItem value="Housing & Shelter">Housing & Shelter</SelectItem>
                              <SelectItem value="Community Impact">Community Impact</SelectItem>
                              <SelectItem value="Food & Nutrition">Food & Nutrition</SelectItem>
                              <SelectItem value="Environmental">Environmental</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      // Business product fields remain the same
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                              id="productName"
                              placeholder="Enter product name"
                              value={storyData.productName}
                              onChange={(e) => setStoryData((prev) => ({ ...prev, productName: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="productSku">Product SKU</Label>
                            <Input
                              id="productSku"
                              placeholder="Enter product SKU"
                              value={storyData.productSku}
                              onChange={(e) => setStoryData((prev) => ({ ...prev, productSku: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            value={storyData.industry}
                            onValueChange={(value) => setStoryData((prev) => ({ ...prev, industry: value }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Coffee & Beverages">Coffee & Beverages</SelectItem>
                              <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                              <SelectItem value="Outdoor & Adventure">Outdoor & Adventure</SelectItem>
                              <SelectItem value="Food & Grocery">Food & Grocery</SelectItem>
                              <SelectItem value="Beauty & Personal Care">Beauty & Personal Care</SelectItem>
                              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  NMBR Generation
                </CardTitle>
                <CardDescription>
                  {orgType === "nonprofit"
                    ? "Generate NMBRs for fundraising materials and events"
                    : "Generate NMBRs for your products"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nmbrCode ? (
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border inline-block">
                      <img src={nmbrCode || "/placeholder.svg"} alt="Generated NMBR" className="h-32 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Download NMBR
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => setNmbrCode(null)}
                      >
                        Generate New
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={generateNmbrCode}
                    className="w-full"
                    disabled={orgType === "nonprofit" ? !storyData.beneficiaryName : !storyData.productName}
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Generate NMBR
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{orgType === "nonprofit" ? "Impact Analytics" : "Story Analytics"}</CardTitle>
                <CardDescription>Track performance once published</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {orgType === "nonprofit" ? (
                    <>
                      <div className="flex justify-between">
                        <span>Story Views</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Donations</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Donor Engagement</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Funds Raised</span>
                        <span>-</span>
                      </div>
                    </>
                  ) : (
                    // Business analytics remain the same
                    <>
                      <div className="flex justify-between">
                        <span>NMBR Searches</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Story Views</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion Rate</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue Generated</span>
                        <span>-</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Story Preview</DialogTitle>
            <DialogDescription>
              {orgType === "nonprofit"
                ? "This is how donors will see your impact story"
                : "This is how customers will see your story when they search the NMBR"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">{storyData.title || "Your Story Title"}</h2>
              <Badge variant="secondary">{storyData.industry || "Category"}</Badge>
            </div>

            {storyData.media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {storyData.media.slice(0, 4).map((media, index) => (
                  <div key={index} className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    {media.type === "image" && <ImageIcon className="h-8 w-8 text-muted-foreground" />}
                    {media.type === "video" && <Video className="h-8 w-8 text-muted-foreground" />}
                    {media.type === "document" && <FileText className="h-8 w-8 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            )}

            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">
                {storyData.content || "Your story content will appear here..."}
              </p>
            </div>

            {orgType === "nonprofit"
              ? storyData.beneficiaryName && (
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold text-card-foreground mb-1">
                      Beneficiary: {storyData.beneficiaryName}
                    </h3>
                    {storyData.impactGoal && (
                      <p className="text-sm text-muted-foreground mb-2">Goal: {storyData.impactGoal}</p>
                    )}
                    {storyData.fundingGoal && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Funding Progress</span>
                          <span>
                            ${storyData.currentFunding || 0} / ${storyData.fundingGoal}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, ((Number(storyData.currentFunding) || 0) / (Number(storyData.fundingGoal) || 1)) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              : // Business preview remains the same
                storyData.productName && (
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold text-card-foreground mb-1">Product: {storyData.productName}</h3>
                    {storyData.productSku && (
                      <p className="text-sm text-muted-foreground">SKU: {storyData.productSku}</p>
                    )}
                  </div>
                )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
