'use client'

import { useState, useRef } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Plus,
  Trash2,
  GripVertical,
  Type,
  Image,
  Heading1,
  Quote,
  Link,
  Heart,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Save,
  Send,
  Eye,
  Download,
  Heart as HeartIcon,
  Gift,
  CreditCard,
  HandHeart,
  Sparkles,
  Lightbulb,
  Wand2,
  MessageSquare,
  RefreshCw,
  ShoppingCart
} from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useSubscription } from "@/contexts/SubscriptionContext"
import { AIWritingAssistant } from "@/components/ui/ai-writing-assistant"
import { ProductBlock, ProductBlockEditor, ProductGrid } from "@/components/ui/product-blocks"
import { WhiteLabelPrompt } from "@/components/ui/tier-upgrade-prompt"

interface NewsletterBlock {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'divider' | 'story' | 'stats' | 'contact' | 'donation' | 'action' | 'product' | 'sale' | 'product_block'
  content: any
  order: number
}

interface NewsletterBuilderProps {
  storyId: string
  organizationId: string
  onSave: (newsletter: any) => void
  onSend: (newsletter: any) => void
  audience?: {
    type: 'all' | 'specific'
    selectedStories: string[]
    totalRecipients: number
  }
}

const getBlockTypes = (orgType: string) => [
  { 
    type: 'heading', 
    label: 'Heading', 
    icon: Heading1, 
    color: 'bg-blue-500',
    description: 'Add a title or heading'
  },
  { 
    type: 'text', 
    label: 'Text', 
    icon: Type, 
    color: 'bg-green-500',
    description: 'Add paragraph text'
  },
  { 
    type: 'image', 
    label: 'Image', 
    icon: Image, 
    color: 'bg-purple-500',
    description: 'Add photos or graphics'
  },
  { 
    type: 'button', 
    label: 'Button', 
    icon: ArrowRight, 
    color: 'bg-orange-500',
    description: 'Add call-to-action button'
  },
  { 
    type: 'divider', 
    label: 'Divider', 
    icon: Separator, 
    color: 'bg-gray-500',
    description: 'Add visual separator'
  },
  { 
    type: 'story', 
    label: 'Impact Story', 
    icon: Heart, 
    color: 'bg-red-500',
    description: 'Share your impact story'
  },
  { 
    type: 'stats', 
    label: 'Statistics', 
    icon: Users, 
    color: 'bg-cyan-500',
    description: 'Show impact numbers'
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
    label: orgType === 'business' ? 'Purchase Button' : orgType === 'grassroots' ? 'Support Button' : 'Donation Button', 
    icon: HeartIcon, 
    color: 'bg-red-500',
    description: orgType === 'business' ? 'Add purchase call-to-action' : orgType === 'grassroots' ? 'Add support call-to-action' : 'Add donation call-to-action'
  },
  ...(orgType === 'business' ? [
    { 
      type: 'product', 
      label: 'Product Announcement', 
      icon: Gift, 
      color: 'bg-green-500',
      description: 'Announce new products or collections'
    },
    { 
      type: 'sale', 
      label: 'Sale Promotion', 
      icon: DollarSign, 
      color: 'bg-orange-500',
      description: 'Promote sales and special offers'
    },
    { 
      type: 'product_block', 
      label: 'Product Block', 
      icon: ShoppingCart, 
      color: 'bg-purple-500',
      description: 'Feature a product with story link'
    }
  ] : [])
]

export function SimpleNewsletterBuilder({ storyId, organizationId, onSave, onSend, audience }: NewsletterBuilderProps) {
  const { terminology, orgType } = useOrganization()
  const { canUseFeature } = useSubscription()
  const [blocks, setBlocks] = useState<NewsletterBlock[]>([
    {
      id: '1',
      type: 'heading',
      content: { text: 'Welcome to Our Newsletter!', level: 1 },
      order: 0
    },
    {
      id: '2',
      type: 'text',
      content: { text: 'Thank you for being part of our community. Here\'s what\'s happening this month...' },
      order: 1
    }
  ])
  
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [donationState, setDonationState] = useState<{
    isProcessing: boolean
    selectedAmount: number | null
    customAmount: string
    donorEmail: string
    donorName: string
    showDonationForm: boolean
  }>({
    isProcessing: false,
    selectedAmount: null,
    customAmount: '',
    donorEmail: '',
    donorName: '',
    showDonationForm: false
  })

  const [aiState, setAiState] = useState<{
    isGenerating: boolean
    suggestions: string[]
    currentPrompt: string
    showAiPanel: boolean
  }>({
    isGenerating: false,
    suggestions: [],
    currentPrompt: '',
    showAiPanel: false
  })

  const addBlock = (type: string) => {
    const newBlock: NewsletterBlock = {
      id: Date.now().toString(),
      type: type as any,
      content: getDefaultContent(type),
      order: blocks.length
    }
    setBlocks([...blocks, newBlock])
  }

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', level: 2 }
      case 'text':
        return { text: 'Enter your text here...' }
      case 'image':
        return { src: '', alt: 'Image description' }
      case 'button':
        return { text: 'Learn More', url: '#' }
      case 'divider':
        return { style: 'solid' }
      case 'story':
        return { 
          title: 'Impact Story', 
          description: 'Share how your organization is making a difference...',
          image: '',
          impact: 'This story helped raise $X and impacted Y people'
        }
      case 'stats':
        return { 
          stats: [
            { label: 'People Helped', value: '1,234', icon: Users },
            { label: 'Funds Raised', value: '$56,789', icon: DollarSign },
            { label: 'Events Held', value: '12', icon: Calendar }
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
          title: orgType === 'business' ? 'Get Started Today' : orgType === 'grassroots' ? 'Support Our Mission' : 'Make a Difference Today',
          description: orgType === 'business' 
            ? 'Your purchase helps us continue providing quality products and services to our customers.'
            : orgType === 'grassroots' 
              ? 'Your support helps us continue our important community work and make a real impact locally.'
              : 'Your donation helps us continue our important work and make a real impact in the community.',
          buttonText: orgType === 'business' ? 'Purchase Now' : orgType === 'grassroots' ? 'Support Now' : 'Donate Now',
          suggestedAmounts: [25, 50, 100, 250],
          customAmount: true,
          urgency: 'normal', // normal, urgent, critical
          impact: orgType === 'business' 
            ? 'Your $50 purchase supports our team and helps us serve more customers'
            : orgType === 'grassroots' 
              ? 'Your $50 support provides resources for 10 community members'
              : 'Your $50 donation provides meals for 10 families',
          showDonorInfo: true,
          allowRecurring: false,
          minimumAmount: 5
        }
      case 'product':
        return {
          title: 'New Product Launch',
          description: 'Introducing our latest collection, crafted with care and attention to detail.',
          image: '',
          price: '$49.99',
          buttonText: 'Shop Now',
          buttonUrl: '#',
          features: ['Handcrafted', 'Sustainable materials', 'Limited edition']
        }
      case 'sale':
        return {
          title: 'Special Offer - Limited Time!',
          description: 'Get 20% off your next purchase. This offer won\'t last long!',
          discount: '20% OFF',
          originalPrice: '$99.99',
          salePrice: '$79.99',
          buttonText: 'Shop Sale',
          buttonUrl: '#',
          endDate: '2024-12-31',
          urgency: 'high'
        }
      default:
        return {}
    }
  }

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content: { ...block.content, ...content } } : block
    ))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
    if (selectedBlock === id) {
      setSelectedBlock(null)
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newBlocks = Array.from(blocks)
    const [reorderedBlock] = newBlocks.splice(source.index, 1)
    newBlocks.splice(destination.index, 0, reorderedBlock)

    // Update order
    const updatedBlocks = newBlocks.map((block, index) => ({ ...block, order: index }))
    setBlocks(updatedBlocks)
  }

  const processDonation = async (amount: number, donorEmail?: string, donorName?: string) => {
    if (!organizationId) {
      alert(`Organization ID is required for ${orgType === 'business' ? 'purchases' : orgType === 'grassroots' ? 'support' : 'donations'}`)
      return
    }

    setDonationState(prev => ({ ...prev, isProcessing: true }))

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          org_id: organizationId,
          story_id: storyId || null,
          donor_email: donorEmail || '',
          success_url: `${window.location.origin}/dashboard/newsletters?donation=success`,
          cancel_url: `${window.location.origin}/dashboard/newsletters?donation=canceled`
        })
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error(data.error || `Failed to create ${orgType === 'business' ? 'purchase' : orgType === 'grassroots' ? 'support' : 'donation'} session`)
      }
    } catch (error) {
      console.error('Donation error:', error)
      alert(`Failed to process ${orgType === 'business' ? 'purchase' : orgType === 'grassroots' ? 'support' : 'donation'}. Please try again.`)
    } finally {
      setDonationState(prev => ({ ...prev, isProcessing: false }))
    }
  }

  const handleDonationAmountSelect = (amount: number) => {
    setDonationState(prev => ({ 
      ...prev, 
      selectedAmount: amount,
      customAmount: '',
      showDonationForm: true
    }))
  }

  const handleCustomAmountChange = (value: string) => {
    setDonationState(prev => ({ 
      ...prev, 
      customAmount: value,
      selectedAmount: null
    }))
  }

  const handleDonationSubmit = () => {
    const amount = donationState.selectedAmount || parseFloat(donationState.customAmount)
    
    if (!amount || amount < (blocks.find(b => b.type === 'donation')?.content.minimumAmount || 5)) {
      alert(`Minimum ${orgType === 'business' ? 'purchase' : orgType === 'grassroots' ? 'support' : 'donation'} amount is $${blocks.find(b => b.type === 'donation')?.content.minimumAmount || 5}`)
      return
    }

    processDonation(amount, donationState.donorEmail, donationState.donorName)
  }

  const sendNewsletter = async () => {
    if (!audience || audience.totalRecipients === 0) {
      alert('Please select an audience for your newsletter')
      return
    }

    try {
      const response = await fetch('/api/newsletters/audience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          storyIds: audience.type === 'specific' ? audience.selectedStories : [],
          newsletterContent: {
            blocks,
            subject: blocks.find(b => b.type === 'heading')?.content.text || 'Newsletter Update',
            audience: audience
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Newsletter sent successfully to ${data.recipientCount} recipients!`)
        onSend({ blocks, audience })
      } else {
        throw new Error(data.error || 'Failed to send newsletter')
      }
    } catch (error) {
      console.error('Newsletter send error:', error)
      alert('Failed to send newsletter. Please try again.')
    }
  }

  // AI Writing Assistance Functions
  const getWritingPrompts = (blockType: string) => {
    const prompts = {
      heading: [
        "Create an engaging headline for a story update",
        "Write a compelling call-to-action heading",
        "Generate a warm welcome message title",
        "Create an urgent fundraising headline"
      ],
      text: [
        "Write a personal story about impact",
        "Create a thank you message to supporters",
        "Write an update on recent progress",
        "Generate a compelling call-to-action paragraph"
      ],
      story: [
        "Tell the story of someone we helped",
        "Describe a recent success or milestone",
        "Share a volunteer's experience",
        "Write about the community impact"
      ],
      donation: [
        "Create an urgent fundraising appeal",
        "Write a thank you message for supporters",
        "Generate a compelling donation ask",
        "Create a monthly giving invitation"
      ],
      product: [
        "Write a compelling product launch announcement",
        "Create a description highlighting unique features",
        "Generate excitement about a new collection",
        "Write about the craftsmanship behind the product"
      ],
      sale: [
        "Create an urgent limited-time offer message",
        "Write a compelling discount announcement",
        "Generate excitement about a flash sale",
        "Create a countdown-style promotion"
      ]
    }
    return prompts[blockType as keyof typeof prompts] || []
  }

  const generateAIContent = async (blockType: string, prompt: string) => {
    setAiState(prev => ({ ...prev, isGenerating: true }))
    
    try {
      // Simulate AI generation (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedContent = {
        heading: [
          "🌟 Amazing Progress Update!",
          "Your Support is Making a Real Difference",
          "Join Us in This Incredible Journey",
          "Together, We're Changing Lives"
        ],
        text: [
          "Thanks to your incredible support, we've been able to make a real difference in our community. Every donation, every share, every moment of your time has contributed to something truly special.",
          "We're excited to share some incredible news with you! Your generosity has helped us reach a major milestone that we never thought possible.",
          "When you support our cause, you're not just giving money – you're giving hope, opportunity, and a chance for a better future.",
          "Your impact goes far beyond what you might imagine. Every dollar you give creates a ripple effect that touches countless lives."
        ],
        story: [
          "Meet Sarah, a single mother who was struggling to make ends meet. Thanks to your support, we were able to provide her family with essential resources and job training. Today, Sarah has a stable job and her children are thriving in school.",
          "Last month, we opened our new community center, and the response has been overwhelming. Over 200 families now have access to resources they never had before, all because of supporters like you.",
          "When Maria first came to us, she was homeless and had lost hope. Through our housing program, she now has a safe place to call home and is working toward her dream of becoming a teacher."
        ],
        donation: [
          "Your donation today will provide meals for 10 families this week. Every $25 you give puts food on the table for a family in need.",
          "Help us reach our goal of $10,000 this month. We're 60% there, and with your support, we can make it happen!",
          "Join our monthly giving program and become a champion for change. Even $10 a month makes a huge difference in someone's life."
        ],
        product: [
          "Introducing our latest collection, where every piece tells a story of craftsmanship and passion. Hand-selected materials meet timeless design.",
          "We're thrilled to announce our newest addition to the family. This limited edition piece combines traditional techniques with modern innovation.",
          "Get ready to fall in love with our newest creation. Each item is carefully crafted by skilled artisans who pour their heart into every detail.",
          "Discover the perfect blend of style and sustainability in our latest release. Made with love, designed for life."
        ],
        sale: [
          "Don't miss out on this incredible opportunity! For a limited time, get 25% off everything in our store. This offer won't last long!",
          "Flash sale alert! We're offering our biggest discount of the year. Stock up on your favorites before they're gone forever.",
          "Last chance to save big! Our end-of-season sale is here with discounts up to 50% off. Shop now before it's too late!",
          "Exclusive offer for our newsletter subscribers! Get 30% off your next purchase when you use code NEWSLETTER30."
        ]
      }
      
      const suggestions = generatedContent[blockType as keyof typeof generatedContent] || []
      setAiState(prev => ({ ...prev, suggestions, isGenerating: false }))
      
    } catch (error) {
      console.error('AI generation error:', error)
      setAiState(prev => ({ ...prev, isGenerating: false }))
    }
  }

  const applyAISuggestion = (suggestion: string, blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return

    if (block.type === 'heading') {
      updateBlock(blockId, { text: suggestion })
    } else if (block.type === 'text') {
      updateBlock(blockId, { text: suggestion })
    } else if (block.type === 'story') {
      updateBlock(blockId, { description: suggestion })
    } else if (block.type === 'donation') {
      updateBlock(blockId, { description: suggestion })
    } else if (block.type === 'product') {
      updateBlock(blockId, { description: suggestion })
    } else if (block.type === 'sale') {
      updateBlock(blockId, { description: suggestion })
    }
    
    setAiState(prev => ({ ...prev, showAiPanel: false }))
  }

  const renderBlock = (block: NewsletterBlock, index: number) => {
    const isSelected = selectedBlock === block.id

    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group relative border-2 rounded-lg p-4 transition-all ${
              isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
            } ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}`}
            onClick={() => setSelectedBlock(block.id)}
          >
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="absolute -left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <div className="bg-white border border-gray-300 rounded p-1 shadow-sm">
                <GripVertical className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Block Controls */}
            <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="destructive"
                className="h-6 w-6 p-0 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteBlock(block.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Block Content */}
            {renderBlockContent(block)}
          </div>
        )}
      </Draggable>
    )
  }

  const renderBlockContent = (block: NewsletterBlock) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.content.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <HeadingTag className="font-bold text-gray-900 flex-1">
                {block.content.text}
              </HeadingTag>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                className="ml-2 flex items-center gap-1"
              >
                <Wand2 className="h-3 w-3" />
                AI
              </Button>
            </div>
            {selectedBlock === block.id && (
              <div className="space-y-2">
                <Label>Heading Text</Label>
                <Input
                  value={block.content.text}
                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                  placeholder="Enter heading text..."
                />
                <div className="flex items-center space-x-2">
                  <Label>Size:</Label>
                  <select
                    value={block.content.level}
                    onChange={(e) => updateBlock(block.id, { level: parseInt(e.target.value) })}
                    className="px-2 py-1 border rounded"
                  >
                    <option value={1}>H1 (Largest)</option>
                    <option value={2}>H2 (Large)</option>
                    <option value={3}>H3 (Medium)</option>
                    <option value={4}>H4 (Small)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )

      case 'text':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-700 flex-1">
                {block.content.text}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                className="ml-2 flex items-center gap-1"
              >
                <Wand2 className="h-3 w-3" />
                AI
              </Button>
            </div>
            {selectedBlock === block.id && (
              <AIWritingAssistant
                currentText={block.content.text}
                onTextChange={(text) => updateBlock(block.id, { text })}
                context="newsletter"
                placeholder="Enter your text here..."
                className="mt-2"
              />
            )}
          </div>
        )

      case 'image':
        return (
          <div>
            <div className="w-full h-32 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              {block.content.src ? (
                <img src={block.content.src} alt={block.content.alt} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-center text-gray-500">
                  <Image className="h-8 w-8 mx-auto mb-2" />
                  <p>Click to add image</p>
                </div>
              )}
            </div>
            {selectedBlock === block.id && (
              <div className="space-y-2 mt-2">
                <Label>Image URL</Label>
                <Input
                  value={block.content.src}
                  onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <Label>Alt Text</Label>
                <Input
                  value={block.content.alt}
                  onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                  placeholder="Describe the image..."
                />
              </div>
            )}
          </div>
        )

      case 'button':
        return (
          <div className="text-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              {block.content.text}
            </Button>
            {selectedBlock === block.id && (
              <div className="space-y-2 mt-2">
                <Label>Button Text</Label>
                <Input
                  value={block.content.text}
                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                  placeholder="Button text..."
                />
                <Label>Button URL</Label>
                <Input
                  value={block.content.url}
                  onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            )}
          </div>
        )

      case 'divider':
        return (
          <div>
            <Separator />
            {selectedBlock === block.id && (
              <div className="mt-2">
                <Label>Divider Style</Label>
                <select
                  value={block.content.style}
                  onChange={(e) => updateBlock(block.id, { style: e.target.value })}
                  className="px-2 py-1 border rounded"
                >
                  <option value="solid">Solid Line</option>
                  <option value="dashed">Dashed Line</option>
                  <option value="dotted">Dotted Line</option>
                </select>
              </div>
            )}
          </div>
        )

      case 'story':
        return (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{block.content.title}</h3>
            <p className="text-gray-700 mb-3">{block.content.description}</p>
            <div className="bg-white p-3 rounded border-l-4 border-red-500">
              <p className="text-sm font-medium text-red-700">{block.content.impact}</p>
            </div>
            {selectedBlock === block.id && (
              <div className="space-y-2 mt-3">
                <Label>Story Title</Label>
                <Input
                  value={block.content.title}
                  onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                />
                <Label>Description</Label>
                <Textarea
                  value={block.content.description}
                  onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                  rows={3}
                />
                <Label>Impact Statement</Label>
                <Input
                  value={block.content.impact}
                  onChange={(e) => updateBlock(block.id, { impact: e.target.value })}
                />
              </div>
            )}
          </div>
        )

      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {block.content.stats.map((stat: any, index: number) => (
              <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
                <div className="text-sm text-blue-700">{stat.label}</div>
              </div>
            ))}
            {selectedBlock === block.id && (
              <div className="col-span-full space-y-2 mt-2">
                <Label>Statistics</Label>
                {block.content.stats.map((stat: any, index: number) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...block.content.stats]
                        newStats[index].value = e.target.value
                        updateBlock(block.id, { stats: newStats })
                      }}
                      placeholder="Value"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...block.content.stats]
                        newStats[index].label = e.target.value
                        updateBlock(block.id, { stats: newStats })
                      }}
                      placeholder="Label"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'contact':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">{block.content.name}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {block.content.email}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {block.content.phone}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {block.content.address}
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {block.content.website}
              </div>
            </div>
            {selectedBlock === block.id && (
              <div className="space-y-2 mt-3">
                <Label>Organization Name</Label>
                <Input
                  value={block.content.name}
                  onChange={(e) => updateBlock(block.id, { name: e.target.value })}
                />
                <Label>Email</Label>
                <Input
                  value={block.content.email}
                  onChange={(e) => updateBlock(block.id, { email: e.target.value })}
                />
                <Label>Phone</Label>
                <Input
                  value={block.content.phone}
                  onChange={(e) => updateBlock(block.id, { phone: e.target.value })}
                />
                <Label>Address</Label>
                <Input
                  value={block.content.address}
                  onChange={(e) => updateBlock(block.id, { address: e.target.value })}
                />
                <Label>Website</Label>
                <Input
                  value={block.content.website}
                  onChange={(e) => updateBlock(block.id, { website: e.target.value })}
                />
              </div>
            )}
          </div>
        )

      case 'donation':
        const urgencyColors = {
          normal: 'from-blue-500 to-blue-600',
          urgent: 'from-orange-500 to-orange-600',
          critical: 'from-red-500 to-red-600'
        }
        
        return (
          <div className={`bg-gradient-to-r ${urgencyColors[block.content.urgency as keyof typeof urgencyColors]} text-white p-6 rounded-lg`}>
            <div className="text-center">
              <HeartIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{block.content.title}</h3>
              <p className="text-lg mb-6 opacity-90">{block.content.description}</p>
              
              {/* Suggested Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {block.content.suggestedAmounts.map((amount: number, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleDonationAmountSelect(amount)}
                    className={`rounded-lg p-3 font-semibold transition-colors ${
                      donationState.selectedAmount === amount
                        ? 'bg-white text-gray-900'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              {/* Custom Amount */}
              {block.content.customAmount && (
                <div className="mb-6">
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={donationState.customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-32 px-3 py-2 rounded-lg text-gray-900 text-center font-semibold"
                    min={block.content.minimumAmount || 5}
                  />
                </div>
              )}
              
              {/* Contact Information Form */}
              {donationState.showDonationForm && (
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name (Optional)</label>
                      <input
                        type="text"
                        value={donationState.donorName}
                        onChange={(e) => setDonationState(prev => ({ ...prev, donorName: e.target.value }))}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 rounded-lg text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={donationState.donorEmail}
                        onChange={(e) => setDonationState(prev => ({ ...prev, donorEmail: e.target.value }))}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 rounded-lg text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Donate Button */}
              <Button 
                size="lg" 
                onClick={handleDonationSubmit}
                disabled={donationState.isProcessing || (!donationState.selectedAmount && !donationState.customAmount)}
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3 text-lg disabled:opacity-50"
              >
                {donationState.isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    {block.content.buttonText}
                  </>
                )}
              </Button>
              
              {/* Impact Statement */}
              {block.content.impact && (
                <p className="text-sm mt-4 opacity-90 italic">
                  {block.content.impact}
                </p>
              )}
            </div>
            
            {selectedBlock === block.id && (
              <div className="space-y-4 mt-6 bg-white/10 p-4 rounded-lg">
                <div>
                  <Label className="text-white">Title</Label>
                  <Input
                    value={block.content.title}
                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="Donation title..."
                  />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={block.content.description}
                    onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-white">Button Text</Label>
                  <Input
                    value={block.content.buttonText}
                    onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Label className="text-white">Minimum Amount</Label>
                  <Input
                    type="number"
                    value={block.content.minimumAmount}
                    onChange={(e) => updateBlock(block.id, { minimumAmount: parseFloat(e.target.value) || 5 })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label className="text-white">Impact Statement</Label>
                  <Input
                    value={block.content.impact}
                    onChange={(e) => updateBlock(block.id, { impact: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder={orgType === 'business' ? "Your $50 purchase supports..." : orgType === 'grassroots' ? "Your $50 support provides..." : "Your $50 donation provides..."}
                  />
                </div>
                <div>
                  <Label className="text-white">Urgency Level</Label>
                  <select
                    value={block.content.urgency}
                    onChange={(e) => updateBlock(block.id, { urgency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/20 border-white/30 text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showDonorInfo"
                    checked={block.content.showDonorInfo}
                    onChange={(e) => updateBlock(block.id, { showDonorInfo: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="showDonorInfo" className="text-white">Collect {orgType === 'business' ? 'customer' : orgType === 'grassroots' ? 'supporter' : 'donor'} information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowRecurring"
                    checked={block.content.allowRecurring}
                    onChange={(e) => updateBlock(block.id, { allowRecurring: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="allowRecurring" className="text-white">Allow recurring {orgType === 'business' ? 'purchases' : orgType === 'grassroots' ? 'support' : 'donations'}</Label>
                </div>
              </div>
            )}
          </div>
        )

      case 'product':
        return (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">{block.content.title}</h3>
                <p className="text-green-800 mb-4">{block.content.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-green-900">{block.content.price}</span>
                  <Button className="bg-green-600 hover:bg-green-700">
                    {block.content.buttonText}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {block.content.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {selectedBlock === block.id && (
              <div className="space-y-4 mt-6 bg-white/50 p-4 rounded-lg">
                <div>
                  <Label>Product Title</Label>
                  <Input
                    value={block.content.title}
                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={block.content.description}
                    onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      value={block.content.price}
                      onChange={(e) => updateBlock(block.id, { price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Button Text</Label>
                    <Input
                      value={block.content.buttonText}
                      onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'sale':
        return (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <DollarSign className="w-8 h-8" />
                <span className="text-3xl font-bold">{block.content.discount}</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{block.content.title}</h3>
              <p className="text-lg mb-4 opacity-90">{block.content.description}</p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-2xl line-through opacity-70">{block.content.originalPrice}</span>
                <span className="text-3xl font-bold">{block.content.salePrice}</span>
              </div>
              <Button className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg">
                {block.content.buttonText}
              </Button>
              <p className="text-sm mt-4 opacity-90">
                Offer ends {new Date(block.content.endDate).toLocaleDateString()}
              </p>
            </div>
            {selectedBlock === block.id && (
              <div className="space-y-4 mt-6 bg-white/10 p-4 rounded-lg">
                <div>
                  <Label className="text-white">Sale Title</Label>
                  <Input
                    value={block.content.title}
                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={block.content.description}
                    onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Discount</Label>
                    <Input
                      value={block.content.discount}
                      onChange={(e) => updateBlock(block.id, { discount: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Sale Price</Label>
                    <Input
                      value={block.content.salePrice}
                      onChange={(e) => updateBlock(block.id, { salePrice: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'product_block':
        return (
          <div>
            <ProductBlock
              product={block.content.product}
              story={block.content.story}
              attribution={{
                nmbrId: storyId,
                updateId: `update-${Date.now()}`,
                campaignId: `campaign-${Date.now()}`,
                recipientId: 'recipient-hash'
              }}
              orgSlug="demo-org"
              isPreview={false}
              onEdit={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
              onDelete={() => removeBlock(block.id)}
            />
            {selectedBlock === block.id && (
              <div className="mt-4">
                <ProductBlockEditor
                  onSave={(product, story) => {
                    updateBlock(block.id, { product, story })
                    setSelectedBlock(null)
                  }}
                  onCancel={() => setSelectedBlock(null)}
                />
              </div>
            )}
          </div>
        )

      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar - Block Library */}
      <div className="w-80 bg-gray-50 border-r p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Add Content Blocks</h3>
        <div className="space-y-2">
          {getBlockTypes(orgType || 'business').map((blockType) => (
            <Button
              key={blockType.type}
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => addBlock(blockType.type)}
            >
              <div className={`w-8 h-8 rounded ${blockType.color} flex items-center justify-center mr-3`}>
                <blockType.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium">{blockType.label}</div>
                <div className="text-xs text-gray-500">{blockType.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => onSave({ blocks })}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" onClick={sendNewsletter}>
              <Send className="h-4 w-4 mr-2" />
              Send Newsletter
              {audience && audience.totalRecipients > 0 && (
                <span className="ml-2 text-xs bg-primary/20 px-2 py-1 rounded">
                  to {audience.totalRecipients} people
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Newsletter Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isPreview ? (
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
              <div className="space-y-6">
                {blocks.map((block, index) => renderBlock(block, index))}
              </div>
              
              {/* Footer with branding */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                {canUseFeature('white_label') ? (
                  <div>
                    <p>© 2024 Your Organization. All rights reserved.</p>
                    <p>Custom branding enabled</p>
                  </div>
                ) : (
                  <div>
                    <p>© 2024 Your Organization. All rights reserved.</p>
                    <p className="mt-2">
                      <WhiteLabelPrompt />
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="newsletter-blocks">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-4 min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg border-2 border-dashed border-blue-300' : ''
                      }`}
                    >
                      {blocks.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <Plus className="h-12 w-12 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Start Building Your Newsletter</h3>
                          <p>Click on a content block from the sidebar to get started</p>
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
          )}
        </div>
      </div>
    </div>
  )
}
