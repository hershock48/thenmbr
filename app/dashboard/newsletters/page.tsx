'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Mail,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Copy,
  Trash2,
  BarChart3,
  Users,
  Calendar,
  Palette,
  Image,
  Settings,
  Download,
  Upload,
  ArrowLeft,
  Save,
  MousePointer,
  Type,
  GripVertical,
  Move,
  Heart,
  DollarSign,
  Phone,
  Globe,
  MapPin,
  HandHeart,
  Gift,
  CreditCard,
  X,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface Newsletter {
  id: string
  name: string
  type: 'story_update' | 'milestone' | 'completion' | 'welcome' | 'custom'
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  storyId: string
  storyTitle: string
  theme: string
  recipients: number
  sentAt?: string
  scheduledAt?: string
  openRate?: number
  clickRate?: number
  createdAt: string
}

interface NewsletterBlock {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'divider' | 'story' | 'stats' | 'contact' | 'donation' | 'action'
  content: any
  order: number
}

const blockTypes = [
  { 
    type: 'heading', 
    label: 'Heading', 
    icon: Type, 
    color: 'bg-blue-500',
    description: 'Add a heading or title'
  },
  { 
    type: 'text', 
    label: 'Text Block', 
    icon: Type, 
    color: 'bg-green-500',
    description: 'Add text content'
  },
  { 
    type: 'image', 
    label: 'Image', 
    icon: Image, 
    color: 'bg-purple-500',
    description: 'Add an image'
  },
  { 
    type: 'button', 
    label: 'Button', 
    icon: MousePointer, 
    color: 'bg-orange-500',
    description: 'Add a call-to-action button'
  },
  { 
    type: 'divider', 
    label: 'Divider', 
    icon: Move, 
    color: 'bg-gray-500',
    description: 'Add a visual separator'
  },
  { 
    type: 'story', 
    label: 'Story Block', 
    icon: Heart, 
    color: 'bg-pink-500',
    description: 'Add a story highlight'
  },
  { 
    type: 'stats', 
    label: 'Statistics', 
    icon: BarChart3, 
    color: 'bg-indigo-500',
    description: 'Add impact statistics'
  },
  { 
    type: 'contact', 
    label: 'Contact Info', 
    icon: Phone, 
    color: 'bg-indigo-500',
    description: 'Add contact details'
  },
  { 
    type: 'donation', 
    label: 'Donation Button', 
    icon: Heart, 
    color: 'bg-red-500',
    description: 'Add donation call-to-action'
  }
]

export default function NewslettersPage() {
  const { user, org } = useAuth()
  const { terminology, orgType } = useOrganization()
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showBuilder, setShowBuilder] = useState(false)
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const [blocks, setBlocks] = useState<NewsletterBlock[]>([])
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [newsletterName, setNewsletterName] = useState("")

  useEffect(() => {
    if (org?.id) {
      fetchNewsletters()
    }
  }, [org?.id])

  const fetchNewsletters = async () => {
    try {
      // Mock data for now
      const mockNewsletters: Newsletter[] = [
        {
          id: "1",
          name: "Monthly Impact Update",
          type: "story_update",
          status: "sent",
          storyId: "story-1",
          storyTitle: "Clean Water Project",
          theme: "modern",
          recipients: 1250,
          sentAt: "2024-01-15T10:00:00Z",
          openRate: 68.5,
          clickRate: 23.2,
          createdAt: "2024-01-15T09:00:00Z"
        },
        {
          id: "2",
          name: "Project Milestone Reached",
          type: "milestone",
          status: "draft",
          storyId: "story-2",
          storyTitle: "Education Initiative",
          theme: "classic",
          recipients: 0,
          createdAt: "2024-01-20T14:30:00Z"
        }
      ]
      setNewsletters(mockNewsletters)
    } catch (error) {
      console.error("Failed to fetch newsletters:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newBlocks = Array.from(blocks)
    const [reorderedItem] = newBlocks.splice(result.source.index, 1)
    newBlocks.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }))

    setBlocks(updatedBlocks)
  }

  const addBlock = (type: string) => {
    const newBlock: NewsletterBlock = {
      id: `block-${Date.now()}`,
      type: type as any,
      content: getDefaultBlockContent(type),
      order: blocks.length
    }
    setBlocks([...blocks, newBlock])
  }

  const getDefaultBlockContent = (type: string) => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', level: 2 }
      case 'text':
        return { text: 'Enter your text here...' }
      case 'image':
        return { src: '', alt: 'Image description', width: '100%' }
      case 'button':
        return { text: 'Click Here', url: '#', style: 'primary' }
      case 'divider':
        return { style: 'solid', thickness: 1 }
      case 'story':
        return { 
          title: 'Story Title',
          excerpt: 'Story excerpt...',
          image: '',
          link: '#'
        }
      case 'stats':
        return { 
          title: 'Impact Statistics',
          stats: [
            { label: 'People Helped', value: '1,250' },
            { label: 'Funds Raised', value: '$25,000' }
          ]
        }
      case 'contact':
        return {
          name: 'Your Organization',
          email: 'contact@yourorg.org',
          phone: '(555) 123-4567',
          address: '123 Main St, City, State 12345',
          website: 'www.yourorg.org'
        }
      case 'donation':
        return {
          title: 'Make a Difference Today',
          description: 'Your donation helps us continue our important work and make a real impact in the community.',
          buttonText: 'Donate Now',
          suggestedAmounts: [25, 50, 100, 250],
          customAmount: true,
          urgency: 'normal',
          impact: 'Your $50 donation provides meals for 10 families',
          showDonorInfo: true,
          allowRecurring: false,
          minimumAmount: 5
        }
      default:
        return {}
    }
  }

  const updateBlock = (blockId: string, updates: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content: { ...block.content, ...updates } } : block
    ))
  }

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId))
    if (selectedBlock === blockId) {
      setSelectedBlock(null)
    }
  }

  const duplicateBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (block) {
      const newBlock = {
        ...block,
        id: `block-${Date.now()}`,
        order: blocks.length
      }
      setBlocks([...blocks, newBlock])
    }
  }

  const renderBlock = (block: NewsletterBlock, index: number) => {
    const IconComponent = blockTypes.find(bt => bt.type === block.type)?.icon || Type

    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-4 ${snapshot.isDragging ? 'opacity-50' : ''}`}
          >
            <Card className={`group hover:shadow-md transition-all duration-200 ${
              selectedBlock === block.id ? 'ring-2 ring-blue-500' : ''
            }`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div {...provided.dragHandleProps} className="cursor-grab">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium capitalize">{block.type}</span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateBlock(block.id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBlock(block.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderBlockContent(block)}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    )
  }

  const renderBlockContent = (block: NewsletterBlock) => {
    switch (block.type) {
      case 'heading':
        return (
          <div>
            <h2 className="text-2xl font-bold">{block.content.text}</h2>
          </div>
        )
      case 'text':
        return (
          <div>
            <p className="text-gray-700">{block.content.text}</p>
          </div>
        )
      case 'image':
        return (
          <div>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {block.content.src ? (
                <img src={block.content.src} alt={block.content.alt} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center text-gray-500">
                  <Image className="w-8 h-8 mx-auto mb-2" />
                  <p>Click to add image</p>
                </div>
              )}
            </div>
          </div>
        )
      case 'button':
        return (
          <div className="text-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              {block.content.text}
            </Button>
          </div>
        )
      case 'divider':
        return <Separator />
      case 'story':
        return (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{block.content.title}</h3>
            <p className="text-gray-600 mb-3">{block.content.excerpt}</p>
            {block.content.image && (
              <div className="w-full h-32 bg-gray-100 rounded mb-3"></div>
            )}
            <Button variant="outline" size="sm">Read More</Button>
          </div>
        )
      case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            {block.content.stats?.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )
      case 'contact':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold">{block.content.name}</h4>
            <p className="text-sm text-gray-600">{block.content.email}</p>
            <p className="text-sm text-gray-600">{block.content.phone}</p>
            <p className="text-sm text-gray-600">{block.content.address}</p>
            <p className="text-sm text-blue-600">{block.content.website}</p>
          </div>
        )
      case 'donation':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">{block.content.title}</h3>
            <p className="mb-4">{block.content.description}</p>
            <div className="flex justify-center space-x-2 mb-4">
              {block.content.suggestedAmounts?.map((amount: number) => (
                <Button key={amount} variant="secondary" size="sm">
                  ${amount}
                </Button>
              ))}
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              {block.content.buttonText}
            </Button>
          </div>
        )
      default:
        return <div>Unknown block type</div>
    }
  }

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         newsletter.storyTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || newsletter.status === statusFilter
    const matchesType = typeFilter === "all" || newsletter.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  if (showBuilder) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowBuilder(false)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Newsletters</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Input
                placeholder="Newsletter name..."
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                className="border-0 text-lg font-semibold focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Newsletter
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Add Blocks</h3>
            <div className="grid grid-cols-2 gap-2">
              {blockTypes.map((blockType) => {
                const IconComponent = blockType.icon
                return (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center space-y-2"
                    onClick={() => addBlock(blockType.type)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs">{blockType.label}</span>
                  </Button>
                )
              })}
            </div>

            {selectedBlock && (
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Block Settings</h3>
                {renderBlockSettings(selectedBlock)}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="newsletter-blocks">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {blocks.length === 0 ? (
                      <div className="text-center py-12">
                        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Newsletter</h3>
                        <p className="text-gray-600 mb-4">Add blocks from the sidebar to create your newsletter</p>
                        <Button onClick={() => addBlock('heading')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Block
                        </Button>
                      </div>
                    ) : (
                      blocks.map((block, index) => renderBlock(block, index))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletters</h1>
            <p className="text-gray-600">Manage your email campaigns and newsletters</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletters</h1>
          <p className="text-gray-600">Manage your email campaigns and newsletters</p>
        </div>
        <Button onClick={() => setShowBuilder(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Newsletter
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search newsletters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sending">Sending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="story_update">Story Update</SelectItem>
            <SelectItem value="milestone">Milestone</SelectItem>
            <SelectItem value="completion">Completion</SelectItem>
            <SelectItem value="welcome">Welcome</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Newsletters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNewsletters.map((newsletter) => (
          <Card key={newsletter.id} className="group hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold truncate">{newsletter.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    {newsletter.storyTitle}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowBuilder(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={newsletter.status === 'sent' ? 'default' : 'secondary'}>
                    {newsletter.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {newsletter.recipients.toLocaleString()} recipients
                  </span>
                </div>
                
                {newsletter.status === 'sent' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Open Rate:</span>
                      <span className="ml-1 font-semibold">{newsletter.openRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Click Rate:</span>
                      <span className="ml-1 font-semibold">{newsletter.clickRate}%</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(newsletter.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNewsletters.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No newsletters found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters to see more results"
              : "Create your first newsletter to get started"}
          </p>
          <Button onClick={() => setShowBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Newsletter
          </Button>
        </div>
      )}
    </div>
  )

  function renderBlockSettings(blockId: string) {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return null

    return (
      <div className="space-y-4">
        {block.type === 'heading' && (
          <>
            <div>
              <Label>Text</Label>
              <Input
                value={block.content.text}
                onChange={(e) => updateBlock(blockId, { text: e.target.value })}
              />
            </div>
            <div>
              <Label>Level</Label>
              <Select
                value={block.content.level.toString()}
                onValueChange={(value) => updateBlock(blockId, { level: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select heading level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        {block.type === 'text' && (
          <div>
            <Label>Text</Label>
            <Textarea
              value={block.content.text}
              onChange={(e) => updateBlock(blockId, { text: e.target.value })}
              rows={4}
            />
          </div>
        )}

        {block.type === 'button' && (
          <>
            <div>
              <Label>Button Text</Label>
              <Input
                value={block.content.text}
                onChange={(e) => updateBlock(blockId, { text: e.target.value })}
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) => updateBlock(blockId, { url: e.target.value })}
              />
            </div>
            <div>
              <Label>Style</Label>
              <Select
                value={block.content.style}
                onValueChange={(value) => updateBlock(blockId, { style: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select button style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Add more block settings as needed */}
      </div>
    )
  }
}