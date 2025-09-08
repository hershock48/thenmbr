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
  Download
} from "lucide-react"

interface NewsletterBlock {
  id: string
  type: 'heading' | 'text' | 'image' | 'button' | 'divider' | 'story' | 'stats' | 'contact'
  content: any
  order: number
}

interface NewsletterBuilderProps {
  storyId: string
  organizationId: string
  onSave: (newsletter: any) => void
  onSend: (newsletter: any) => void
}

const blockTypes = [
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
  }
]

export function SimpleNewsletterBuilder({ storyId, organizationId, onSave, onSend }: NewsletterBuilderProps) {
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
            <HeadingTag className="font-bold text-gray-900 mb-2">
              {block.content.text}
            </HeadingTag>
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
            <p className="text-gray-700 mb-2">
              {block.content.text}
            </p>
            {selectedBlock === block.id && (
              <div className="space-y-2">
                <Label>Text Content</Label>
                <Textarea
                  value={block.content.text}
                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                  placeholder="Enter your text here..."
                  rows={4}
                />
              </div>
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
          {blockTypes.map((blockType) => (
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
            <Button size="sm" onClick={() => onSend({ blocks })}>
              <Send className="h-4 w-4 mr-2" />
              Send Newsletter
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
