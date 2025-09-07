"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Type,
  ImageIcon,
  MousePointer,
  Eye,
  Save,
  Send,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Settings,
  Undo,
  Redo,
  Smartphone,
  Monitor,
  Tablet,
  Sparkles,
  Layout,
  BarChart3,
  Minus,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  newsletterThemes,
  newsletterTemplates,
  type NewsletterBlock,
  type NewsletterTheme,
  type NewsletterTemplate,
} from "@/lib/newsletter-templates"
import { cn } from "@/lib/utils"

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
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [newsletterName, setNewsletterName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [history, setHistory] = useState<NewsletterBlock[][]>([blocks])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback(
    (result: any) => {
      setIsDragging(false)
      setDragOverIndex(null)

      if (!result.destination) return

      const newBlocks = Array.from(blocks)
      const [reorderedItem] = newBlocks.splice(result.source.index, 1)
      newBlocks.splice(result.destination.index, 0, reorderedItem)

      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index + 1,
      }))

      setBlocks(updatedBlocks)
      addToHistory(updatedBlocks)
    },
    [blocks],
  )

  const addToHistory = useCallback(
    (newBlocks: NewsletterBlock[]) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...newBlocks])
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setBlocks([...history[historyIndex - 1]])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setBlocks([...history[historyIndex + 1]])
    }
  }, [history, historyIndex])

  const addBlock = useCallback(
    (type: NewsletterBlock["type"], insertIndex?: number) => {
      const newBlock: NewsletterBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        order: insertIndex !== undefined ? insertIndex + 1 : blocks.length + 1,
        content: getDefaultBlockContent(type),
        styling: getDefaultBlockStyling(type),
      }

      let newBlocks = [...blocks]
      if (insertIndex !== undefined) {
        newBlocks.splice(insertIndex + 1, 0, newBlock)
        newBlocks = newBlocks.map((block, index) => ({ ...block, order: index + 1 }))
      } else {
        newBlocks.push(newBlock)
      }

      setBlocks(newBlocks)
      setSelectedBlock(newBlock.id)
      addToHistory(newBlocks)
    },
    [blocks, addToHistory],
  )

  const updateBlock = useCallback(
    (blockId: string, updates: Partial<NewsletterBlock>) => {
      const newBlocks = blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
      setBlocks(newBlocks)
      addToHistory(newBlocks)
    },
    [blocks, addToHistory],
  )

  const deleteBlock = useCallback(
    (blockId: string) => {
      const newBlocks = blocks.filter((block) => block.id !== blockId)
      setBlocks(newBlocks)
      if (selectedBlock === blockId) {
        setSelectedBlock(null)
      }
      addToHistory(newBlocks)
    },
    [blocks, selectedBlock, addToHistory],
  )

  const duplicateBlock = useCallback(
    (blockId: string) => {
      const block = blocks.find((b) => b.id === blockId)
      if (block) {
        const newBlock = {
          ...block,
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          order: block.order + 1,
        }
        const newBlocks = [...blocks]
        newBlocks.splice(block.order, 0, newBlock)
        const updatedBlocks = newBlocks.map((b, index) => ({ ...b, order: index + 1 }))
        setBlocks(updatedBlocks)
        addToHistory(updatedBlocks)
      }
    },
    [blocks, addToHistory],
  )

  const getDefaultBlockContent = (type: NewsletterBlock["type"]) => {
    switch (type) {
      case "header":
        return { title: "Your Story Update", subtitle: "Making a difference together" }
      case "text":
        return { text: "Add your message here..." }
      case "image":
        return { src: "", alt: "Image", caption: "" }
      case "button":
        return { text: "Donate Now", url: "#", style: "primary" }
      case "progress":
        return { raised: "$0", goal: "$1,000", percentage: "0%", remaining: "$1,000" }
      case "spacer":
        return { height: "30px" }
      case "divider":
        return {}
      default:
        return {}
    }
  }

  const getDefaultBlockStyling = (type: NewsletterBlock["type"]) => {
    switch (type) {
      case "header":
        return {
          backgroundColor: selectedTheme.colors.primary,
          textColor: "#ffffff",
          padding: "40px 20px",
          textAlign: "center",
        }
      case "text":
        return { fontSize: "16px", lineHeight: "1.6", padding: "20px" }
      case "image":
        return { width: "100%", borderRadius: "8px", margin: "20px 0" }
      case "button":
        return {
          backgroundColor: selectedTheme.colors.primary,
          textColor: "#ffffff",
          padding: "15px 30px",
          borderRadius: "8px",
          textAlign: "center",
        }
      case "progress":
        return {
          backgroundColor: "#f0f9ff",
          border: `2px solid ${selectedTheme.colors.primary}`,
          borderRadius: "12px",
          padding: "25px",
          margin: "25px 0",
        }
      case "spacer":
        return { height: "30px" }
      case "divider":
        return { borderTop: `1px solid ${selectedTheme.colors.border}`, margin: "30px 0" }
      default:
        return {}
    }
  }

  const blockTypes = [
    { type: "header", label: "Header", icon: Type, description: "Title and subtitle", category: "content" },
    { type: "text", label: "Text", icon: Type, description: "Rich text content", category: "content" },
    { type: "image", label: "Image", icon: ImageIcon, description: "Photo or graphic", category: "media" },
    {
      type: "button",
      label: "Button",
      icon: MousePointer,
      description: "Call-to-action button",
      category: "interactive",
    },
    { type: "progress", label: "Progress", icon: BarChart3, description: "Progress bar", category: "interactive" },
    { type: "spacer", label: "Spacer", icon: Minus, description: "Empty space", category: "layout" },
    { type: "divider", label: "Divider", icon: Separator, description: "Horizontal line", category: "layout" },
  ]

  const selectedBlockData = blocks.find((b) => b.id === selectedBlock)

  const getPreviewDimensions = () => {
    switch (previewDevice) {
      case "mobile":
        return { width: "375px", height: "100%" }
      case "tablet":
        return { width: "768px", height: "100%" }
      default:
        return { width: "100%", height: "100%" }
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Enhanced Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm",
          sidebarCollapsed ? "w-16" : "w-80",
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={cn("space-y-1", sidebarCollapsed && "hidden")}>
              <h2 className="text-lg font-semibold text-gray-900">Newsletter Builder</h2>
              <p className="text-sm text-gray-500">Create professional newsletters</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>

          {!sidebarCollapsed && (
            <div className="space-y-3 mt-4">
              <div>
                <Label htmlFor="newsletter-name" className="text-sm font-medium">
                  Newsletter Name
                </Label>
                <Input
                  id="newsletter-name"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  placeholder="Enter newsletter name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Template</Label>
                <div className="mt-1 space-y-2">
                  <Select
                    value={selectedTemplate?.id}
                    onValueChange={(id) => {
                      const template = newsletterTemplates.find((t) => t.id === id)
                      if (template) {
                        setSelectedTemplate(template)
                        setBlocks(template.blocks)
                        setSelectedTheme(template.theme)
                        addToHistory(template.blocks)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {newsletterTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                background: `linear-gradient(135deg, ${template.theme.colors.primary}, ${template.theme.colors.secondary})`,
                              }}
                            />
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => setShowTemplateGallery(true)}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
              <TabsTrigger value="blocks" className="text-xs">
                Blocks
              </TabsTrigger>
              <TabsTrigger value="themes" className="text-xs">
                Design
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div>
                <h3 className="font-medium mb-3 text-gray-900">Add Content</h3>
                <div className="space-y-3">
                  {["content", "media", "interactive", "layout"].map((category) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {blockTypes
                          .filter((blockType) => blockType.category === category)
                          .map((blockType) => (
                            <Button
                              key={blockType.type}
                              variant="outline"
                              size="sm"
                              onClick={() => addBlock(blockType.type as NewsletterBlock["type"])}
                              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                            >
                              <blockType.icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                              <span className="text-xs font-medium">{blockType.label}</span>
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Content Blocks</h3>
                  <Badge variant="secondary" className="text-xs">
                    {blocks.length} blocks
                  </Badge>
                </div>
                <div className="space-y-2">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-all duration-200 group",
                        selectedBlock === block.id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      )}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3 h-3 text-gray-400" />
                          <span className="text-sm font-medium capitalize text-gray-900">{block.type}</span>
                          {block.type === "text" && block.content.text && (
                            <span className="text-xs text-gray-500 truncate max-w-20">
                              {block.content.text.replace(/<[^>]*>/g, "").substring(0, 20)}...
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateBlock(block.id)
                            }}
                            className="h-6 w-6 p-0"
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
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {blocks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Layout className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No blocks yet</p>
                      <p className="text-xs">Add content blocks to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="themes" className="flex-1 p-4 overflow-y-auto">
              <div>
                <h3 className="font-medium mb-3 text-gray-900">Choose Design</h3>
                <div className="space-y-3">
                  {newsletterThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all duration-200",
                        selectedTheme.id === theme.id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      )}
                      onClick={() => setSelectedTheme(theme)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex-shrink-0 shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{theme.name}</h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {theme.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{theme.description}</p>
                          <div className="flex gap-1 mt-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 text-gray-900">Brand Colors</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Primary Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          value={selectedTheme.colors.primary}
                          onChange={(e) =>
                            setSelectedTheme({
                              ...selectedTheme,
                              colors: { ...selectedTheme.colors, primary: e.target.value },
                            })
                          }
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={selectedTheme.colors.primary}
                          onChange={(e) =>
                            setSelectedTheme({
                              ...selectedTheme,
                              colors: { ...selectedTheme.colors, primary: e.target.value },
                            })
                          }
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Secondary Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          value={selectedTheme.colors.secondary}
                          onChange={(e) =>
                            setSelectedTheme({
                              ...selectedTheme,
                              colors: { ...selectedTheme.colors, secondary: e.target.value },
                            })
                          }
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={selectedTheme.colors.secondary}
                          onChange={(e) =>
                            setSelectedTheme({
                              ...selectedTheme,
                              colors: { ...selectedTheme.colors, secondary: e.target.value },
                            })
                          }
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3 text-gray-900">Layout Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Content Width</Label>
                      <Select
                        value={selectedTheme.layout.contentWidth}
                        onValueChange={(value: "narrow" | "medium" | "wide") =>
                          setSelectedTheme({
                            ...selectedTheme,
                            layout: { ...selectedTheme.layout, contentWidth: value },
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="narrow">Narrow (600px)</SelectItem>
                          <SelectItem value="medium">Medium (700px)</SelectItem>
                          <SelectItem value="wide">Wide (800px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Button Style</Label>
                      <Select
                        value={selectedTheme.layout.buttonStyle}
                        onValueChange={(value: "rounded" | "square" | "pill") =>
                          setSelectedTheme({
                            ...selectedTheme,
                            layout: { ...selectedTheme.layout, buttonStyle: value },
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="pill">Pill</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={previewMode ? "ghost" : "default"}
                size="sm"
                onClick={() => setPreviewMode(false)}
                className="h-8 px-3 text-sm"
              >
                <Settings className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant={previewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode(true)}
                className="h-8 px-3 text-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
            </div>

            {previewMode && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewDevice === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                  className="h-8 w-8 p-0"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === "tablet" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewDevice("tablet")}
                  className="h-8 w-8 p-0"
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewDevice("mobile")}
                  className="h-8 w-8 p-0"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0} className="h-8 w-8 p-0">
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="h-8 w-8 p-0"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-sm bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Newsletter
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {previewMode ? (
            <div className="flex justify-center">
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                style={getPreviewDimensions()}
              >
                <div className="p-8">
                  <div className="text-center text-gray-500 mb-4">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-medium">Newsletter Preview</h3>
                    <p className="text-sm">This is how your newsletter will look</p>
                  </div>
                  {/* Newsletter preview content would be rendered here */}
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <div key={block.id} className="border-2 border-dashed border-gray-200 p-4 rounded">
                        {renderBlockPreview(block)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                <Droppable droppableId="blocks">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "space-y-4 min-h-96 transition-colors duration-200",
                        snapshot.isDraggingOver && "bg-blue-50",
                      )}
                    >
                      {blocks.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                          <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Newsletter</h3>
                          <p className="text-gray-500 mb-6">
                            Add content blocks from the sidebar to create your newsletter
                          </p>
                          <div className="flex justify-center gap-2">
                            <Button onClick={() => addBlock("header")} size="sm">
                              <Type className="w-4 h-4 mr-2" />
                              Add Header
                            </Button>
                            <Button onClick={() => addBlock("text")} variant="outline" size="sm">
                              <Type className="w-4 h-4 mr-2" />
                              Add Text
                            </Button>
                          </div>
                        </div>
                      )}

                      {blocks.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "group relative bg-white border-2 rounded-xl transition-all duration-200 overflow-hidden",
                                selectedBlock === block.id
                                  ? "border-blue-500 shadow-lg shadow-blue-100"
                                  : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                                snapshot.isDragging && "shadow-2xl rotate-2 scale-105",
                              )}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={cn(
                                  "flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 transition-colors",
                                  selectedBlock === block.id && "bg-blue-50 border-blue-200",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium capitalize text-gray-900">{block.type}</span>
                                    <Badge variant="outline" className="text-xs">
                                      Block {index + 1}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => addBlock("text", index)}
                                    className="h-7 w-7 p-0"
                                    title="Add block above"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => duplicateBlock(block.id)}
                                    className="h-7 w-7 p-0"
                                    title="Duplicate block"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteBlock(block.id)}
                                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                    title="Delete block"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="p-6 cursor-pointer" onClick={() => setSelectedBlock(block.id)}>
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

      {selectedBlockData && (
        <div className="w-80 bg-white border-l border-gray-200 shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 capitalize flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {selectedBlockData.type} Settings
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setSelectedBlock(null)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">Customize this block's appearance and content</p>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            {renderBlockEditor(selectedBlockData, updateBlock)}
          </div>
        </div>
      )}
    </div>
  )
}

function renderBlockEditor(
  block: NewsletterBlock,
  updateBlock: (blockId: string, updates: Partial<NewsletterBlock>) => void,
) {
  switch (block.type) {
    case "header":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Title</Label>
            <Input
              value={block.content.title}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, title: e.target.value },
                })
              }
              className="mt-1"
              placeholder="Enter header title"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Subtitle</Label>
            <Input
              value={block.content.subtitle}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, subtitle: e.target.value },
                })
              }
              className="mt-1"
              placeholder="Enter subtitle"
            />
          </div>
          <Separator />
          <div>
            <Label className="text-sm font-medium">Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={block.styling?.backgroundColor || "#0891b2"}
                onChange={(e) =>
                  updateBlock(block.id, {
                    styling: { ...block.styling, backgroundColor: e.target.value },
                  })
                }
                className="w-12 h-10 p-1"
              />
              <Input
                value={block.styling?.backgroundColor || "#0891b2"}
                onChange={(e) =>
                  updateBlock(block.id, {
                    styling: { ...block.styling, backgroundColor: e.target.value },
                  })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={block.styling?.textColor || "#ffffff"}
                onChange={(e) =>
                  updateBlock(block.id, {
                    styling: { ...block.styling, textColor: e.target.value },
                  })
                }
                className="w-12 h-10 p-1"
              />
              <Input
                value={block.styling?.textColor || "#ffffff"}
                onChange={(e) =>
                  updateBlock(block.id, {
                    styling: { ...block.styling, textColor: e.target.value },
                  })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )
    case "text":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Text Content</Label>
            <Textarea
              value={block.content.text}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, text: e.target.value },
                })
              }
              rows={6}
              className="mt-1"
              placeholder="Enter your text content..."
            />
          </div>
          <Separator />
          <div>
            <Label className="text-sm font-medium">Font Size</Label>
            <Select
              value={block.styling?.fontSize || "16px"}
              onValueChange={(value) =>
                updateBlock(block.id, {
                  styling: { ...block.styling, fontSize: value },
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="14px">Small (14px)</SelectItem>
                <SelectItem value="16px">Medium (16px)</SelectItem>
                <SelectItem value="18px">Large (18px)</SelectItem>
                <SelectItem value="20px">Extra Large (20px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "image":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Image URL</Label>
            <Input
              value={block.content.src}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, src: e.target.value },
                })
              }
              className="mt-1"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Alt Text</Label>
            <Input
              value={block.content.alt}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, alt: e.target.value },
                })
              }
              className="mt-1"
              placeholder="Describe the image"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Caption (Optional)</Label>
            <Input
              value={block.content.caption}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, caption: e.target.value },
                })
              }
              className="mt-1"
              placeholder="Image caption"
            />
          </div>
          <Separator />
          <div>
            <Label className="text-sm font-medium">Border Radius</Label>
            <Select
              value={block.styling?.borderRadius || "8px"}
              onValueChange={(value) =>
                updateBlock(block.id, {
                  styling: { ...block.styling, borderRadius: value },
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">Square</SelectItem>
                <SelectItem value="8px">Rounded</SelectItem>
                <SelectItem value="16px">Very Rounded</SelectItem>
                <SelectItem value="50%">Circle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "button":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Button Text</Label>
            <Input
              value={block.content.text}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, text: e.target.value },
                })
              }
              className="mt-1"
              placeholder="Button text"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Button URL</Label>
            <Input
              value={block.content.url}
              onChange={(e) =>
                updateBlock(block.id, {
                  content: { ...block.content, url: e.target.value },
                })
              }
              className="mt-1"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Button Style</Label>
            <Select
              value={block.content.style}
              onValueChange={(value) =>
                updateBlock(block.id, {
                  content: { ...block.content, style: value },
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div>
            <Label className="text-sm font-medium">Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={block.styling?.backgroundColor || "#0891b2"}
                onChange={(e) =>
                  updateBlock(block.id, {
                    styling: { ...block.styling, backgroundColor: e.target.value },
                  })
                }
                className="w-12 h-10 p-1"
              />
              <Input
                value={block.styling?.backgroundColor || "#0891b2"}
                onChange={(e) =>
                  updateBlock(block.id, {
                    styling: { ...block.styling, backgroundColor: e.target.value },
                  })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div className="text-center py-8 text-gray-500">
          <Settings className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No settings available for this block type</p>
        </div>
      )
  }
}

function renderBlockPreview(block: NewsletterBlock) {
  switch (block.type) {
    case "header":
      return (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{block.content.title}</h2>
          <p className="text-gray-600">{block.content.subtitle}</p>
        </div>
      )
    case "text":
      return (
        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: block.content.text }}
        />
      )
    case "image":
      return (
        <div className="text-center space-y-3">
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            {block.content.src ? (
              <img
                src={block.content.src || "/placeholder.svg"}
                alt={block.content.alt}
                className="max-w-full max-h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-500 text-sm">No image selected</span>
              </div>
            )}
          </div>
          {block.content.caption && <p className="text-sm text-gray-600">{block.content.caption}</p>}
        </div>
      )
    case "button":
      return (
        <div className="text-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {block.content.text}
          </button>
        </div>
      )
    case "progress":
      return (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex justify-between text-sm mb-3 font-medium">
            <span className="text-blue-900">Raised: {block.content.raised}</span>
            <span className="text-blue-900">Goal: {block.content.goal}</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500"
              style={{ width: "65%" }}
            ></div>
          </div>
          <p className="text-center text-sm text-blue-800 font-medium">65% Complete</p>
        </div>
      )
    case "spacer":
      return (
        <div
          style={{ height: block.content.height }}
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
        >
          <span className="text-gray-500 text-sm">Spacer ({block.content.height})</span>
        </div>
      )
    case "divider":
      return <div className="border-t-2 border-gray-300"></div>
    default:
      return <div className="text-gray-500">Unknown block type</div>
  }
}
