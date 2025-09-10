'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  FileText,
  Save,
  MousePointer,
  Type,
  GripVertical,
  Move,
  Target,
  Heart,
  DollarSign,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  XCircle,
  CheckCircle,
  HandHeart,
  Gift,
  CreditCard,
  X,
  HelpCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useAIUsage } from "@/contexts/AIUsageContext"
import { aiService, type AISuggestion } from "@/lib/ai-service"
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
  unsubscribes?: number
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
  const { usage, canUseAI, checkUsage } = useAIUsage()
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
  const [isSending, setIsSending] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [recipients, setRecipients] = useState<any[]>([])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [sendProgress, setSendProgress] = useState(0)
  const [showRecipientSelector, setShowRecipientSelector] = useState(false)
  const [recipientFilter, setRecipientFilter] = useState('all')
  const [stories, setStories] = useState<any[]>([])
  const [showStoryPicker, setShowStoryPicker] = useState(false)
  const [selectedStoryForBlock, setSelectedStoryForBlock] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom')
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<string>('')
  const [scheduleTime, setScheduleTime] = useState<string>('')
  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now')
  const [showStoryNewsletterCreator, setShowStoryNewsletterCreator] = useState(false)
  const [selectedStoryForNewsletter, setSelectedStoryForNewsletter] = useState<string>('')
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [showAIReview, setShowAIReview] = useState(false)
  const [aiReviewStep, setAiReviewStep] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [currentSuggestion, setCurrentSuggestion] = useState<any>(null)
  const [highlightedBlock, setHighlightedBlock] = useState<string | null>(null)
  const [aiReviewComplete, setAiReviewComplete] = useState(false)
  const [showAITour, setShowAITour] = useState(false)
  const [aiTourStep, setAiTourStep] = useState(0)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [errorAI, setErrorAI] = useState<string | null>(null)

  const newsletterTemplates = [
    {
      id: 'story_update',
      name: 'Story Update',
      description: 'Update donors on story progress and milestones',
      icon: FileText,
      blocks: [
        { type: 'heading', content: { text: 'Story Update', level: 1 } },
        { type: 'text', content: { text: 'We have exciting news to share about our story!' } },
        { type: 'story', content: { storyId: '', title: '', excerpt: '', image: '' } },
        { type: 'text', content: { text: 'Thank you for your continued support. Every donation makes a difference!' } },
        { type: 'button', content: { text: 'View Full Story', url: '#' } }
      ]
    },
    {
      id: 'milestone',
      name: 'Milestone Reached',
      description: 'Celebrate reaching funding milestones',
      icon: Target,
      blocks: [
        { type: 'heading', content: { text: '🎉 Milestone Reached!', level: 1 } },
        { type: 'text', content: { text: 'We\'ve reached an important milestone in our story!' } },
        { type: 'story', content: { storyId: '', title: '', excerpt: '', image: '' } },
        { type: 'stats', content: { stats: [{ label: 'Raised', value: '$0' }, { label: 'Goal', value: '$0' }] } },
        { type: 'text', content: { text: 'Thank you to everyone who made this possible!' } }
      ]
    },
    {
      id: 'thank_you',
      name: 'Thank You',
      description: 'Express gratitude to donors',
      icon: Heart,
      blocks: [
        { type: 'heading', content: { text: 'Thank You!', level: 1 } },
        { type: 'text', content: { text: 'Your generosity means the world to us and those we help.' } },
        { type: 'story', content: { storyId: '', title: '', excerpt: '', image: '' } },
        { type: 'text', content: { text: 'Because of you, we can continue making a difference in our community.' } }
      ]
    },
    {
      id: 'welcome',
      name: 'Welcome',
      description: 'Welcome new subscribers to your cause',
      icon: Users,
      blocks: [
        { type: 'heading', content: { text: 'Welcome to Our Community!', level: 1 } },
        { type: 'text', content: { text: 'Thank you for joining us in making a difference.' } },
        { type: 'story', content: { storyId: '', title: '', excerpt: '', image: '' } },
        { type: 'text', content: { text: 'We\'ll keep you updated on our progress and impact.' } }
      ]
    },
    {
      id: 'impact_report',
      name: 'Impact Report',
      description: 'Share the impact of your organization',
      icon: BarChart3,
      blocks: [
        { type: 'heading', content: { text: 'Impact Report', level: 1 } },
        { type: 'text', content: { text: 'Here\'s how your support is making a difference:' } },
        { type: 'stats', content: { stats: [{ label: 'Lives Changed', value: '0' }, { label: 'Stories Funded', value: '0' }] } },
        { type: 'text', content: { text: 'Thank you for being part of our mission!' } }
      ]
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Start with a blank newsletter',
      icon: Plus,
      blocks: []
    }
  ]

  useEffect(() => {
    if (org?.id) {
      fetchNewsletters()
      fetchRecipients()
      fetchStories()
    }
  }, [org?.id])

  const fetchRecipients = async () => {
    try {
      // Mock recipients data - in real app, fetch from API
      const mockRecipients = [
        { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', status: 'active', lastDonation: '2024-01-15', totalDonated: 150 },
        { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', status: 'active', lastDonation: '2024-01-10', totalDonated: 75 },
        { id: '3', email: 'bob@example.com', firstName: 'Bob', lastName: 'Johnson', status: 'active', lastDonation: '2024-01-05', totalDonated: 200 },
        { id: '4', email: 'alice@example.com', firstName: 'Alice', lastName: 'Brown', status: 'unsubscribed', lastDonation: '2023-12-20', totalDonated: 50 },
        { id: '5', email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Wilson', status: 'active', lastDonation: '2024-01-12', totalDonated: 300 }
      ]
      setRecipients(mockRecipients)
    } catch (error) {
      console.error('Error fetching recipients:', error)
    }
  }

  const fetchStories = async () => {
    try {
      // Mock stories data - in real app, fetch from API
      const mockStories = [
        { 
          id: '1', 
          title: 'Help Sarah Get Her Surgery', 
          nmbr_code: 'SARAH001',
          current_amount: 2500,
          goal_amount: 5000,
          photo_url: '/api/placeholder/300/200',
          excerpt: 'Sarah needs life-saving surgery but can\'t afford it. Every donation brings her closer to recovery.',
          status: 'active'
        },
        { 
          id: '2', 
          title: 'School Supplies for Kids', 
          nmbr_code: 'SCHOOL001',
          current_amount: 800,
          goal_amount: 1200,
          photo_url: '/api/placeholder/300/200',
          excerpt: 'Help us provide essential school supplies to children in need this semester.',
          status: 'active'
        },
        { 
          id: '3', 
          title: 'Community Garden Project', 
          nmbr_code: 'GARDEN001',
          current_amount: 1500,
          goal_amount: 2000,
          photo_url: '/api/placeholder/300/200',
          excerpt: 'Building a community garden to provide fresh vegetables for local families.',
          status: 'completed'
        }
      ]
      setStories(mockStories)
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  const fetchNewsletters = async () => {
    try {
      // Start with empty array - users will create their own newsletters
      setNewsletters([])
    } catch (error) {
      console.error("Failed to fetch newsletters:", error)
    } finally {
      setLoading(false)
    }
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

  const applyTemplate = (templateId: string) => {
    const template = newsletterTemplates.find(t => t.id === templateId)
    if (template) {
      const templateBlocks = template.blocks.map((block, index) => ({
        id: `block-${Date.now()}-${index}`,
        type: block.type as any,
        content: block.content,
        order: index
      }))
      setBlocks(templateBlocks)
      setSelectedTemplate(templateId)
      setShowTemplateSelector(false)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }))

    setBlocks(updatedItems)
  }

  const handleStartEdit = (blockId: string, currentText: string) => {
    setEditingBlock(blockId)
    // If it's placeholder text, start with empty string
    const isPlaceholder = currentText === 'Click to edit heading' || 
                         currentText === 'Click to edit text' || 
                         currentText === 'Click to edit button text'
    setEditingText(isPlaceholder ? '' : currentText)
  }

  const handleSaveEdit = (blockId: string) => {
    // Always save the text, even if empty (will show placeholder)
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, content: { ...block.content, text: editingText } }
        : block
    ))
    setEditingBlock(null)
    setEditingText('')
  }

  const handleCancelEdit = () => {
    setEditingBlock(null)
    setEditingText('')
  }

  const generateAISuggestions = (blocks: NewsletterBlock[]) => {
    // Mock AI suggestions - in real implementation, this would call an AI service
    const suggestions: Array<{
      id: string
      blockId: string
      type: string
      issue: string
      current: string
      suggestion: string
      reason: string
      priority: 'high' | 'medium' | 'low'
    }> = []
    
    blocks.forEach((block, index) => {
      if (block.type === 'heading') {
        if (block.content.text.length < 10) {
          suggestions.push({
            id: `suggestion-${index}`,
            blockId: block.id,
            type: 'heading',
            issue: 'Title too short',
            current: block.content.text,
            suggestion: `${block.content.text} - A More Compelling Title`,
            reason: 'Longer, more descriptive titles perform better in email marketing',
            priority: 'high'
          })
        }
        if (!block.content.text.includes('!') && !block.content.text.includes('?')) {
          suggestions.push({
            id: `suggestion-${index}-2`,
            blockId: block.id,
            type: 'heading',
            issue: 'Missing emotional hook',
            current: block.content.text,
            suggestion: `${block.content.text}!`,
            reason: 'Adding punctuation can increase engagement and urgency',
            priority: 'medium'
          })
        }
      }
      
      if (block.type === 'text') {
        if (block.content.text.length < 50) {
          suggestions.push({
            id: `suggestion-${index}`,
            blockId: block.id,
            type: 'text',
            issue: 'Content too brief',
            current: block.content.text,
            suggestion: `${block.content.text} This additional context helps donors understand the full impact of their support.`,
            reason: 'Longer content provides more context and builds stronger emotional connection',
            priority: 'medium'
          })
        }
        if (!block.content.text.includes('you') || !block.content.text.includes('your')) {
          suggestions.push({
            id: `suggestion-${index}-2`,
            blockId: block.id,
            type: 'text',
            issue: 'Not donor-focused',
            current: block.content.text,
            suggestion: block.content.text.replace(/we|our|us/g, 'you/your'),
            reason: 'Using "you" language makes donors feel more personally connected to the impact',
            priority: 'high'
          })
        }
      }
      
      if (block.type === 'button') {
        if (!block.content.text.toLowerCase().includes('donate') && !block.content.text.toLowerCase().includes('support')) {
          suggestions.push({
            id: `suggestion-${index}`,
            blockId: block.id,
            type: 'button',
            issue: 'Unclear call-to-action',
            current: block.content.text,
            suggestion: 'Donate Now',
            reason: 'Clear, action-oriented buttons increase conversion rates',
            priority: 'high'
          })
        }
      }
    })
    
    return suggestions
  }

  const startAIReview = () => {
    // Check if user can use AI Review
    if (!canUseAI) {
      setErrorAI(`You've reached your monthly limit of ${usage?.monthlyLimit || 0} AI reviews. Upgrade your plan for unlimited access.`)
      return
    }

    // Check if this is the first time using AI Review
    const hasUsedAIReview = localStorage.getItem('hasUsedAIReview')
    if (!hasUsedAIReview) {
      setShowAITour(true)
      setAiTourStep(0)
    } else {
      startActualAIReview()
    }
  }

  const startActualAIReview = async () => {
    setIsLoadingAI(true)
    setErrorAI(null)
    
    try {
      // Prepare content for AI analysis
      const content = {
        subject: newsletterName || 'Untitled Newsletter',
        blocks: blocks.map(block => ({
          id: block.id,
          type: block.type,
          content: block.content.text || block.content.title || ''
        }))
      }

      // Use professional AI service with usage tracking
      const result = await aiService.analyzeNewsletterContent(content, 'current-user')
      
      setAiSuggestions(result.suggestions)
      setAiReviewStep(0)
      setShowAIReview(true)
      setAiReviewComplete(false)
      
      // Refresh usage stats
      await checkUsage()
      
      if (result.suggestions.length > 0) {
        setCurrentSuggestion(result.suggestions[0])
        setHighlightedBlock(result.suggestions[0].blockId)
      } else {
        setErrorAI("AI couldn't generate suggestions. Please try again or adjust your content.")
      }
    } catch (error) {
      console.error("AI Review failed:", error)
      setErrorAI(error instanceof Error ? error.message : "AI Review is temporarily unavailable. Please try again later.")
    } finally {
      setIsLoadingAI(false)
    }
  }

  const nextTourStep = () => {
    if (aiTourStep < 3) {
      setAiTourStep(aiTourStep + 1)
    } else {
      // Tour complete, start actual review
      localStorage.setItem('hasUsedAIReview', 'true')
      setShowAITour(false)
      startActualAIReview()
    }
  }

  const skipTour = () => {
    localStorage.setItem('hasUsedAIReview', 'true')
    setShowAITour(false)
    startActualAIReview()
  }

  const nextAISuggestion = () => {
    if (aiReviewStep < aiSuggestions.length - 1) {
      const nextStep = aiReviewStep + 1
      setAiReviewStep(nextStep)
      setCurrentSuggestion(aiSuggestions[nextStep])
      setHighlightedBlock(aiSuggestions[nextStep].blockId)
    } else {
      setAiReviewComplete(true)
      setHighlightedBlock(null)
    }
  }

  const applyAISuggestion = (suggestionId: string) => {
    const suggestion = aiSuggestions.find(s => s.id === suggestionId)
    if (suggestion) {
      setBlocks(prev => prev.map(block => 
        block.id === suggestion.blockId 
          ? { ...block, content: { ...block.content, text: suggestion.suggestion } }
          : block
      ))
    }
  }

  const skipAISuggestion = () => {
    nextAISuggestion()
  }

  const handleSendNewsletter = async () => {
    if (!newsletterName.trim()) {
      alert('Please enter a newsletter name')
      return
    }
    
    if (blocks.length === 0) {
      alert('Please add some content to your newsletter')
      return
    }

    setShowSendDialog(true)
  }

  const confirmSendNewsletter = async () => {
    setIsSending(true)
    setSendProgress(0)
    
    try {
      // Calculate scheduled time if scheduling
      let scheduledAt = null
      if (sendMode === 'schedule' && scheduleDate && scheduleTime) {
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`)
        if (scheduledDateTime > new Date()) {
          scheduledAt = scheduledDateTime.toISOString()
        } else {
          alert('Please select a future date and time')
          setIsSending(false)
          return
        }
      }

      // Create newsletter via API
      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newsletterName,
          type: 'custom',
          storyId: 'custom-newsletter', // For custom newsletters
          organizationId: org?.id,
          customContent: generateNewsletterHTML(),
          scheduledAt: scheduledAt
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send newsletter')
      }

      const result = await response.json()
      
      // Update progress
      setSendProgress(100)
      
      // Save newsletter to local state
      const newNewsletter: Newsletter = {
        id: `newsletter-${Date.now()}`,
        name: newsletterName,
        type: 'custom',
        status: scheduledAt ? 'scheduled' : 'sent',
        storyId: '',
        storyTitle: '',
        theme: 'default',
        recipients: result.recipients || 0,
        sentAt: scheduledAt ? undefined : new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      
      setNewsletters(prev => [newNewsletter, ...prev])
      setShowSendDialog(false)
      setShowBuilder(false)
      
      if (scheduledAt) {
        const scheduledDate = new Date(scheduledAt).toLocaleString()
        alert(`Newsletter scheduled successfully for ${scheduledDate} to ${result.recipients} recipients!`)
      } else {
        alert(`Newsletter sent successfully to ${result.recipients} recipients!`)
      }
      
    } catch (error) {
      console.error('Error sending newsletter:', error)
      alert(`Failed to send newsletter: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSending(false)
      setSendProgress(0)
    }
  }

  const generateNewsletterHTML = () => {
    // Convert blocks to HTML
    let html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">'
    
    blocks.forEach(block => {
      switch (block.type) {
        case 'heading':
          html += `<h${block.content.level} style="color: #333; margin: 20px 0;">${block.content.text}</h${block.content.level}>`
          break
        case 'text':
          html += `<p style="color: #666; line-height: 1.6; margin: 15px 0;">${block.content.text}</p>`
          break
        case 'button':
          html += `<div style="text-align: center; margin: 20px 0;">
            <a href="${block.content.url}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">${block.content.text}</a>
          </div>`
          break
        case 'divider':
          html += '<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">'
          break
        case 'story':
          html += `<div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${block.content.title}</h3>
            <p style="color: #666; margin: 0 0 15px 0;">${block.content.excerpt}</p>
            <a href="#" style="color: #007bff; text-decoration: none;">Read More</a>
          </div>`
          break
        case 'donation':
          html += `<div style="background: linear-gradient(135deg, #007bff, #6f42c1); color: white; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center;">
            <h3 style="margin: 0 0 15px 0; font-size: 24px;">${block.content.title}</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.9;">${block.content.description}</p>
            <div style="margin: 20px 0;">
              ${block.content.suggestedAmounts?.map((amount: number) => 
                `<button style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; margin: 5px; border-radius: 4px; cursor: pointer;">$${amount}</button>`
              ).join('')}
            </div>
            <a href="#" style="background: white; color: #007bff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">${block.content.buttonText}</a>
          </div>`
          break
      }
    })
    
    html += '</div>'
    return html
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
    const isHighlighted = highlightedBlock === block.id
    const highlightClass = isHighlighted ? 'ring-2 ring-purple-400 bg-purple-50 shadow-lg' : ''
    
    switch (block.type) {
      case 'heading':
        return (
          <div className={highlightClass}>
            {editingBlock === block.id ? (
              <div className="space-y-2">
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="text-2xl font-bold"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(block.id)
                    } else if (e.key === 'Escape') {
                      handleCancelEdit()
                    }
                  }}
                  onBlur={() => handleSaveEdit(block.id)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(block.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <h3 
                  className="text-2xl font-bold cursor-text hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200"
                  onClick={() => handleStartEdit(block.id, block.content.text)}
                >
                  {block.content.text || 'Click to edit heading'}
                </h3>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        )
      case 'text':
        return (
          <div className={highlightClass}>
            {editingBlock === block.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="text-gray-700 min-h-20"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSaveEdit(block.id)
                    } else if (e.key === 'Escape') {
                      handleCancelEdit()
                    }
                  }}
                  onBlur={() => handleSaveEdit(block.id)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(block.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <p 
                  className="text-gray-700 cursor-text hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 min-h-8"
                  onClick={() => handleStartEdit(block.id, block.content.text)}
                >
                  {block.content.text || 'Click to edit text'}
                </p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}
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
          <div className={`text-center ${highlightClass}`}>
            {editingBlock === block.id ? (
              <div className="space-y-2">
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="text-center"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(block.id)
                    } else if (e.key === 'Escape') {
                      handleCancelEdit()
                    }
                  }}
                  onBlur={() => handleSaveEdit(block.id)}
                />
                <div className="flex gap-2 justify-center">
                  <Button size="sm" onClick={() => handleSaveEdit(block.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group relative inline-block">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 cursor-text"
                  onClick={() => handleStartEdit(block.id, block.content.text)}
                >
                  {block.content.text || 'Click to edit button text'}
                </Button>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-4 h-4 text-gray-400 bg-white rounded-full p-1 shadow-sm" />
                </div>
              </div>
            )}
          </div>
        )
      case 'divider':
        return <Separator />
        case 'story':
          const selectedStory = stories.find(s => s.id === block.content.storyId)
          return (
            <div className="border rounded-lg p-4">
              {selectedStory ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{selectedStory.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedStoryForBlock(block.id)
                        setShowStoryPicker(true)
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-gray-600 mb-3">{selectedStory.excerpt}</p>
                  <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                    <span className="text-gray-500">Story Image</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">Read More</Button>
                    <span className="text-sm text-gray-500">NMBR: {selectedStory.nmbr_code}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">No story selected</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedStoryForBlock(block.id)
                      setShowStoryPicker(true)
                    }}
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Select Story
                  </Button>
                </div>
              )}
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
            <h3 className="font-semibold">{block.content.name}</h3>
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={startAIReview}
                    disabled={isLoadingAI || !canUseAI}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100 disabled:opacity-50"
                  >
                    {isLoadingAI ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Review
                      </>
                    )}
                  </Button>
                  
                  {/* Usage indicator */}
                  {usage && (
                    <div className="text-xs text-muted-foreground">
                      {usage.monthlyUsage}/{usage.monthlyLimit === 999999 ? '∞' : usage.monthlyLimit} used
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('Help button clicked!')
                    setShowAITour(true)
                    setAiTourStep(0)
                  }}
                  className="text-purple-600 hover:text-purple-700 cursor-pointer"
                  title="Show AI Review Tour"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </div>
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
              <Button 
                onClick={handleSendNewsletter}
                disabled={isSending}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Newsletter'}
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery || statusFilter !== "all" || typeFilter !== "all"
              ? "No newsletters found"
              : "No newsletters yet"
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters to see more results"
              : "Create your first newsletter to keep donors updated on your impact stories and build stronger relationships."
            }
          </p>
          {!searchQuery && statusFilter === "all" && typeFilter === "all" && (
            <div className="space-y-3">
              <Button onClick={() => setShowBuilder(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Newsletter
              </Button>
              <p className="text-sm text-muted-foreground">
                Use our drag-and-drop builder to create beautiful, professional newsletters
              </p>
            </div>
          )}
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

  // Add the send confirmation dialog outside the main component
  return (
    <>
      {showBuilder ? (
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
                  onClick={() => setShowTemplateSelector(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                </Button>
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
                <Button 
                  onClick={handleSendNewsletter}
                  disabled={isSending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send Newsletter'}
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
                  {renderBlockSettings(selectedBlock!)}
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
      ) : (
        <div className="space-y-6">
          {/* Rest of the newsletter list component */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Newsletters</h1>
              <p className="text-gray-600">Manage your email campaigns and newsletters</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => setShowBuilder(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Newsletter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowStoryNewsletterCreator(true)}
                className="w-full sm:w-auto"
              >
                <FileText className="w-4 h-4 mr-2" />
                Story Newsletter
              </Button>
            </div>
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

          {/* Newsletter List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNewsletters.map((newsletter) => (
              <Card key={newsletter.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{newsletter.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {newsletter.storyTitle || 'Custom Newsletter'}
                      </CardDescription>
                    </div>
                    <Badge variant={newsletter.status === 'sent' ? 'default' : 'secondary'}>
                      {newsletter.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Recipients</span>
                      <span>{newsletter.recipients}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Type</span>
                      <span className="capitalize">{newsletter.type.replace('_', ' ')}</span>
                    </div>
                    {newsletter.sentAt && (
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Sent</span>
                        <span>{new Date(newsletter.sentAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Open Rate</span>
                      <span>{newsletter.openRate ? `${newsletter.openRate}%` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Click Rate</span>
                      <span>{newsletter.clickRate ? `${newsletter.clickRate}%` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Unsubscribes</span>
                      <span>{newsletter.unsubscribes || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" title="View Analytics">
                        <BarChart3 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Preview">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Send">
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNewsletters.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "No newsletters found"
                  : "No newsletters yet"
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "Create your first newsletter to keep donors updated on your impact stories and build stronger relationships."
                }
              </p>
              {!searchQuery && statusFilter === "all" && typeFilter === "all" && (
                <div className="space-y-3">
                  <Button onClick={() => setShowBuilder(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Newsletter
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Use our drag-and-drop builder to create beautiful, professional newsletters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Send Confirmation Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Newsletter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Newsletter: <strong>{newsletterName}</strong>
              </p>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Recipients: <strong>{selectedRecipients.length} donors</strong>
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRecipientSelector(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Select Recipients
                </Button>
              </div>
              
              {/* Send Mode Selection */}
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="now"
                      checked={sendMode === 'now'}
                      onChange={(e) => setSendMode(e.target.value as 'now' | 'schedule')}
                      className="rounded"
                    />
                    <span className="text-sm">Send Now</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="schedule"
                      checked={sendMode === 'schedule'}
                      onChange={(e) => setSendMode(e.target.value as 'now' | 'schedule')}
                      className="rounded"
                    />
                    <span className="text-sm">Schedule for Later</span>
                  </label>
                </div>
                
                {sendMode === 'schedule' && (
                  <div className="flex space-x-3">
                    <div>
                      <label className="text-xs text-gray-600">Date</label>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Time</label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {isSending ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Sending newsletter...</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{sendProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${sendProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to send this newsletter to {selectedRecipients.length} recipients?
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSendDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmSendNewsletter}
                    className="flex-1"
                  >
                    Send Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recipient Selector Dialog */}
      <Dialog open={showRecipientSelector} onOpenChange={setShowRecipientSelector}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Recipients</DialogTitle>
            <DialogDescription>
              Choose which donors will receive this newsletter
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recipients</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  <SelectItem value="high-value">High Value Donors ($100+)</SelectItem>
                  <SelectItem value="recent-donors">Recent Donors (30 days)</SelectItem>
                  <SelectItem value="lapsed-donors">Lapsed Donors (90+ days)</SelectItem>
                  <SelectItem value="first-time">First Time Donors</SelectItem>
                  <SelectItem value="recurring">Recurring Donors</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1">
                <Input placeholder="Search by name or email..." />
              </div>
            </div>

            {/* Recipient List */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {recipients
                .filter(recipient => {
                  const now = new Date()
                  const lastDonationDate = new Date(recipient.lastDonation)
                  const daysSinceLastDonation = Math.floor((now.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24))
                  
                  switch (recipientFilter) {
                    case 'active':
                      return recipient.status === 'active'
                    case 'unsubscribed':
                      return recipient.status === 'unsubscribed'
                    case 'high-value':
                      return recipient.totalDonated >= 100
                    case 'recent-donors':
                      return daysSinceLastDonation <= 30
                    case 'lapsed-donors':
                      return daysSinceLastDonation >= 90
                    case 'first-time':
                      return recipient.totalDonated > 0 && recipient.totalDonated < 50
                    case 'recurring':
                      return recipient.totalDonated >= 200 // Assuming recurring donors have higher totals
                    default:
                      return true
                  }
                })
                .map((recipient) => (
                  <div key={recipient.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients(prev => [...prev, recipient.id])
                          } else {
                            setSelectedRecipients(prev => prev.filter(id => id !== recipient.id))
                          }
                        }}
                        className="rounded"
                      />
                      <div>
                        <p className="font-medium">{recipient.firstName} {recipient.lastName}</p>
                        <p className="text-sm text-gray-600">{recipient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${recipient.totalDonated}</p>
                      <p className="text-xs text-gray-500">{recipient.status}</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                {selectedRecipients.length} of {recipients.length} recipients selected
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRecipients(recipients.map(r => r.id))}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRecipients([])}
                >
                  Clear All
                </Button>
                <Button onClick={() => setShowRecipientSelector(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Story Picker Dialog */}
      <Dialog open={showStoryPicker} onOpenChange={setShowStoryPicker}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Story</DialogTitle>
            <DialogDescription>
              Choose a story to feature in your newsletter
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Story List */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {stories.map((story) => (
                <div 
                  key={story.id} 
                  className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    if (selectedStoryForBlock) {
                      updateBlock(selectedStoryForBlock, { 
                        storyId: story.id,
                        title: story.title,
                        excerpt: story.excerpt,
                        image: story.photo_url
                      })
                    }
                    setShowStoryPicker(false)
                    setSelectedStoryForBlock(null)
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">IMG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{story.title}</h3>
                      <p className="text-sm text-gray-600">{story.excerpt}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">NMBR: {story.nmbr_code}</span>
                        <span className="text-xs text-gray-500">${story.current_amount.toLocaleString()} / ${story.goal_amount.toLocaleString()}</span>
                        <Badge variant={story.status === 'active' ? 'default' : 'secondary'}>
                          {story.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.round((story.current_amount / story.goal_amount) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.round((story.current_amount / story.goal_amount) * 100)}% funded
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowStoryPicker(false)
                  setSelectedStoryForBlock(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Selector Dialog */}
      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Select a pre-built template to get started quickly
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsletterTemplates.map((template) => {
                const IconComponent = template.icon
                return (
                  <div 
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => applyTemplate(template.id)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedTemplate === template.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                    
                    {template.blocks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.blocks.slice(0, 3).map((block, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {block.type}
                            </span>
                          ))}
                          {template.blocks.length > 3 && (
                            <span className="text-xs text-gray-500">+{template.blocks.length - 3} more</span>
                          )}
                        </div>
        </div>
      )}

      {/* AI Review Dialog */}
      <Dialog open={showAIReview} onOpenChange={setShowAIReview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Newsletter Review
            </DialogTitle>
            <DialogDescription>
              I'll walk through your newsletter and provide suggestions to improve engagement and impact.
            </DialogDescription>
          </DialogHeader>

          {/* Error Display */}
          {errorAI && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-800">AI Review Error</h4>
                  <p className="text-sm text-red-700">{errorAI}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setErrorAI(null)
                  startActualAIReview()
                }}
              >
                Try Again
              </Button>
            </div>
          )}
          
          {!aiReviewComplete ? (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Reviewing suggestion {aiReviewStep + 1} of {aiSuggestions.length}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((aiReviewStep + 1) / aiSuggestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Suggestion */}
              {currentSuggestion && (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-semibold text-sm">
                          {currentSuggestion.priority === 'high' ? '!' : '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-900 mb-2">
                          {currentSuggestion.issue}
                        </h4>
                        <p className="text-sm text-purple-800 mb-3">
                          {currentSuggestion.reason}
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-purple-700 mb-1 block">
                              Current:
                            </label>
                            <div className="bg-white border border-purple-200 rounded p-2 text-sm">
                              "{currentSuggestion.current}"
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs font-medium text-purple-700 mb-1 block">
                              Suggestion:
                            </label>
                            <div className="bg-white border border-purple-200 rounded p-2 text-sm">
                              "{currentSuggestion.suggestion}"
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        applyAISuggestion(currentSuggestion.id)
                        nextAISuggestion()
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Apply Suggestion
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={skipAISuggestion}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Skip
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Review Complete */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Review Complete!</h3>
              <p className="text-muted-foreground">
                I've reviewed your newsletter and provided suggestions. Your newsletter is ready to send!
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setShowAIReview(false)}
                  variant="outline"
                >
                  Close Review
                </Button>
                <Button 
                  onClick={() => setShowSendDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Newsletter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Tour Dialog */}
      <Dialog open={showAITour} onOpenChange={setShowAITour}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Welcome to AI Newsletter Review!
            </DialogTitle>
            <DialogDescription>
              Let me show you how this powerful feature works
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Tour Step 0 - Introduction */}
            {aiTourStep === 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">What is AI Review?</h3>
                  <p className="text-muted-foreground mb-4">
                    AI Review analyzes your newsletter content using advanced AI to provide professional editing suggestions 
                    that increase donor engagement and fundraising effectiveness.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">What it checks:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Tone & Voice:</strong> Ensures donor-friendly, compelling messaging</li>
                      <li>• <strong>Clarity:</strong> Removes jargon and improves readability</li>
                      <li>• <strong>Engagement:</strong> Suggests emotional hooks and storytelling</li>
                      <li>• <strong>Call-to-Actions:</strong> Optimizes donation buttons and links</li>
                      <li>• <strong>Subject Lines:</strong> Improves email open rates</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">Setup Required:</h4>
                    <p className="text-sm text-amber-800 mb-2">
                      Add your OpenAI API key to enable AI Review. Without it, you'll get basic suggestions.
                    </p>
                    <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Setup Instructions
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What I'll check:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Title effectiveness and emotional hooks</li>
                    <li>• Content length and donor-focused language</li>
                    <li>• Call-to-action clarity and urgency</li>
                    <li>• Overall engagement and readability</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tour Step 1 - Highlighting */}
            {aiTourStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Visual Highlighting</h3>
                  <p className="text-muted-foreground">
                    I'll highlight each section I'm reviewing with a purple glow, so you can see exactly 
                    what I'm analyzing.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">!</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900">This is what highlighting looks like</h4>
                      <p className="text-sm text-purple-800">Sections will glow purple when I'm reviewing them</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tour Step 2 - Suggestions */}
            {aiTourStep === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
                  <p className="text-muted-foreground">
                    For each issue I find, I'll show you the current text, my suggestion, 
                    and explain why it will improve your newsletter.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 border rounded-lg p-3">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Current:</label>
                    <div className="text-sm">"Update"</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <label className="text-xs font-medium text-green-700 mb-1 block">Suggestion:</label>
                    <div className="text-sm">"Update - A More Compelling Title!"</div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Why:</strong> Longer, more descriptive titles perform better in email marketing
                  </div>
                </div>
              </div>
            )}

            {/* Tour Step 3 - Actions */}
            {aiTourStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">You're in Control</h3>
                  <p className="text-muted-foreground">
                    For each suggestion, you can choose to apply it or skip it. 
                    I'll walk through them one by one, and you decide what works for your newsletter.
                  </p>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" className="bg-red-50 border-red-200 text-red-700">
                    <XCircle className="w-4 h-4 mr-2" />
                    Skip Suggestion
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            )}

            {/* Tour Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((step) => (
                  <div 
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      step <= aiTourStep ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={skipTour}>
                  Skip Tour
                </Button>
                <Button onClick={nextTourStep}>
                  {aiTourStep === 3 ? 'Start Review' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
})}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowTemplateSelector(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Story Newsletter Creator Dialog */}
      <Dialog open={showStoryNewsletterCreator} onOpenChange={setShowStoryNewsletterCreator}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Story Newsletter</DialogTitle>
            <DialogDescription>
              Quickly create a newsletter for a specific story
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Story Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Story</label>
              <Select value={selectedStoryForNewsletter} onValueChange={setSelectedStoryForNewsletter}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a story for your newsletter" />
                </SelectTrigger>
                <SelectContent>
                  {stories.map((story) => (
                    <SelectItem key={story.id} value={story.id}>
                      <div className="flex items-center space-x-2">
                        <span>{story.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {story.nmbr_code}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Newsletter Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Newsletter Type</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (selectedStoryForNewsletter) {
                      applyTemplate('story_update')
                      setShowStoryNewsletterCreator(false)
                      setShowBuilder(true)
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Story Update</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Update donors on progress</p>
                </div>
                
                <div 
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (selectedStoryForNewsletter) {
                      applyTemplate('milestone')
                      setShowStoryNewsletterCreator(false)
                      setShowBuilder(true)
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">Milestone</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Celebrate achievements</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowStoryNewsletterCreator(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (selectedStoryForNewsletter) {
                    applyTemplate('story_update')
                    setShowStoryNewsletterCreator(false)
                    setShowBuilder(true)
                  }
                }}
                disabled={!selectedStoryForNewsletter}
              >
                Create Newsletter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}