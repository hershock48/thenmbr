'use client'

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Palette, 
  Type, 
  Image, 
  MousePointer, 
  Eye, 
  Save, 
  Send, 
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Move,
  Settings,
  Download,
  Upload
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { newsletterThemes, newsletterTemplates, type NewsletterBlock, type NewsletterTheme, type NewsletterTemplate } from "@/lib/newsletter-templates"

interface NewsletterBuilderProps {
  storyId: string
  organizationId: string
  onSave?: (newsletter: any) => void
  onSend?: (newsletter: any) => void
}

export function NewsletterBuilder({ storyId, organizationId, onSave, onSend }: NewsletterBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate | null>(newsletterTemplates[0])
  const [selectedTheme, setSelectedTheme] = useState<NewsletterTheme>(newsletterThemes[0])
  const [blocks, setBlocks] = useState<NewsletterBlock[]>(newsletterTemplates[0]?.blocks || [])
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [newsletterName, setNewsletterName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newBlocks = Array.from(blocks)
    const [reorderedItem] = newBlocks.splice(result.source.index, 1)
    newBlocks.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index + 1
    }))

    setBlocks(updatedBlocks)
  }

  const addBlock = (type: NewsletterBlock['type']) => {
    const newBlock: NewsletterBlock = {
      id: `block-${Date.now()}`,
      type,
      order: blocks.length + 1,
      content: getDefaultBlockContent(type),
      styling: getDefaultBlockStyling(type)
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (blockId: string, updates: Partial<NewsletterBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
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
        order: block.order + 1
      }
      const newBlocks = [...blocks]
      newBlocks.splice(block.order, 0, newBlock)
      setBlocks(newBlocks.map((b, index) => ({ ...b, order: index + 1 })))
    }
  }

  const getDefaultBlockContent = (type: NewsletterBlock['type']) => {
    switch (type) {
      case 'header':
        return { title: 'Your Story Update', subtitle: 'Making a difference together' }
      case 'text':
        return { text: 'Add your message here...' }
      case 'image':
        return { src: '', alt: 'Image', caption: '' }
      case 'button':
        return { text: 'Donate Now', url: '#', style: 'primary' }
      case 'progress':
        return { raised: '$0', goal: '$1,000', percentage: '0%', remaining: '$1,000' }
      case 'spacer':
        return { height: '30px' }
      case 'divider':
        return {}
      default:
        return {}
    }
  }

  const getDefaultBlockStyling = (type: NewsletterBlock['type']) => {
    switch (type) {
      case 'header':
        return { backgroundColor: selectedTheme.colors.primary, textColor: '#ffffff', padding: '40px 20px', textAlign: 'center' }
      case 'text':
        return { fontSize: '16px', lineHeight: '1.6', padding: '20px' }
      case 'image':
        return { width: '100%', borderRadius: '8px', margin: '20px 0' }
      case 'button':
        return { backgroundColor: selectedTheme.colors.primary, textColor: '#ffffff', padding: '15px 30px', borderRadius: '8px', textAlign: 'center' }
      case 'progress':
        return { backgroundColor: '#f0f9ff', border: `2px solid ${selectedTheme.colors.primary}`, borderRadius: '12px', padding: '25px', margin: '25px 0' }
      case 'spacer':
        return { height: '30px' }
      case 'divider':
        return { borderTop: `1px solid ${selectedTheme.colors.border}`, margin: '30px 0' }
      default:
        return {}
    }
  }

  const blockTypes = [
    { type: 'header', label: 'Header', icon: Type, description: 'Title and subtitle' },
    { type: 'text', label: 'Text', icon: Type, description: 'Rich text content' },
    { type: 'image', label: 'Image', icon: Image, description: 'Photo or graphic' },
    { type: 'button', label: 'Button', icon: MousePointer, description: 'Call-to-action button' },
    { type: 'progress', label: 'Progress', icon: Settings, description: 'Progress bar' },
    { type: 'spacer', label: 'Spacer', icon: Plus, description: 'Empty space' },
    { type: 'divider', label: 'Divider', icon: Separator, description: 'Horizontal line' }
  ]

  const selectedBlockData = blocks.find(b => b.id === selectedBlock)

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Newsletter Builder</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="newsletter-name">Newsletter Name</Label>
              <Input
                id="newsletter-name"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                placeholder="Enter newsletter name"
              />
            </div>
            <div>
              <Label>Template</Label>
              <Select value={selectedTemplate?.id} onValueChange={(id) => {
                const template = newsletterTemplates.find(t => t.id === id)
                if (template) {
                  setSelectedTemplate(template)
                  setBlocks(template.blocks)
                  setSelectedTheme(template.theme)
                }
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {newsletterTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="blocks" className="flex-1 p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-3">Add Blocks</h3>
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map((blockType) => (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(blockType.type as NewsletterBlock['type'])}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <blockType.icon className="w-4 h-4" />
                    <span className="text-xs">{blockType.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Block Library</h3>
              <div className="space-y-2">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`p-2 border rounded cursor-pointer transition-colors ${
                      selectedBlock === block.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedBlock(block.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{block.type}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateBlock(block.id)
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteBlock(block.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="flex-1 p-4">
            <div>
              <h3 className="font-medium mb-3">Choose Theme</h3>
              <div className="space-y-3">
                {newsletterThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedTheme.id === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                      />
                      <div>
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-sm text-gray-600">{theme.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Color Scheme</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={selectedTheme.colors.primary}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, primary: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <Input
                      type="color"
                      value={selectedTheme.colors.secondary}
                      onChange={(e) => setSelectedTheme({
                        ...selectedTheme,
                        colors: { ...selectedTheme.colors, secondary: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode ? "outline" : "default"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

        {/* Builder Area */}
        <div className="flex-1 overflow-auto p-4">
          {previewMode ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Preview content would go here */}
                <div className="p-8 text-center text-gray-500">
                  Newsletter Preview
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {blocks.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border-2 rounded-lg transition-colors ${
                                selectedBlock === block.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200"
                              >
                                <div className="flex items-center gap-2">
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium capitalize">{block.type}</span>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => duplicateBlock(block.id)}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteBlock(block.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div
                                className="p-4 cursor-pointer"
                                onClick={() => setSelectedBlock(block.id)}
                              >
                                {renderBlockPreview(block)}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>
      </div>

      {/* Block Editor Sidebar */}
      {selectedBlockData && (
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium capitalize">{selectedBlockData.type} Settings</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedBlock(null)}
            >
              ×
            </Button>
          </div>
          <div className="space-y-4">
            {renderBlockEditor(selectedBlockData)}
          </div>
        </div>
      )}
    </div>
  )
}

function renderBlockPreview(block: NewsletterBlock) {
  switch (block.type) {
    case 'header':
      return (
        <div className="text-center">
          <h2 className="text-xl font-bold">{block.content.title}</h2>
          <p className="text-gray-600">{block.content.subtitle}</p>
        </div>
      )
    case 'text':
      return <div dangerouslySetInnerHTML={{ __html: block.content.text }} />
    case 'image':
      return (
        <div className="text-center">
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
            {block.content.src ? (
              <img src={block.content.src} alt={block.content.alt} className="max-w-full max-h-full object-cover rounded" />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
          {block.content.caption && (
            <p className="text-sm text-gray-600 mt-2">{block.content.caption}</p>
          )}
        </div>
      )
    case 'button':
      return (
        <div className="text-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded">
            {block.content.text}
          </button>
        </div>
      )
    case 'progress':
      return (
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex justify-between text-sm mb-2">
            <span>Raised: {block.content.raised}</span>
            <span>Goal: {block.content.goal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
          </div>
        </div>
      )
    case 'spacer':
      return <div style={{ height: block.content.height }} className="bg-gray-100 border-2 border-dashed border-gray-300"></div>
    case 'divider':
      return <div className="border-t border-gray-300"></div>
    default:
      return <div>Unknown block type</div>
  }
}

function renderBlockEditor(block: NewsletterBlock) {
  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, subtitle: e.target.value }
              })}
            />
          </div>
        </div>
      )
    case 'text':
      return (
        <div>
          <Label>Text Content</Label>
          <Textarea
            value={block.content.text}
            onChange={(e) => updateBlock(block.id, {
              content: { ...block.content, text: e.target.value }
            })}
            rows={4}
          />
        </div>
      )
    case 'image':
      return (
        <div className="space-y-3">
          <div>
            <Label>Image URL</Label>
            <Input
              value={block.content.src}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, src: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={block.content.alt}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, alt: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Caption</Label>
            <Input
              value={block.content.caption}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, caption: e.target.value }
              })}
            />
          </div>
        </div>
      )
    case 'button':
      return (
        <div className="space-y-3">
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, text: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Button URL</Label>
            <Input
              value={block.content.url}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, url: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Button Style</Label>
            <Select
              value={block.content.style}
              onValueChange={(value) => updateBlock(block.id, {
                content: { ...block.content, style: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    default:
      return <div>No settings available for this block type</div>
  }
}
