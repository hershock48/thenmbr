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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      setBlocks(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setBlocks(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const addBlock = useCallback(
    (type: NewsletterBlock["type"]) => {
      const newBlock: NewsletterBlock = {
        id: `${type}-${Date.now()}`,
        type,
        content: getDefaultContent(type),
        styling: getDefaultBlockStyling(type),
        order: blocks.length + 1,
      }
      const newBlocks = [...blocks, newBlock]
      setBlocks(newBlocks)
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
      addToHistory(newBlocks)
      if (selectedBlock === blockId) {
        setSelectedBlock(null)
      }
    },
    [blocks, addToHistory, selectedBlock],
  )

  const duplicateBlock = useCallback(
    (blockId: string) => {
      const blockToDuplicate = blocks.find((block) => block.id === blockId)
      if (blockToDuplicate) {
        const newBlock: NewsletterBlock = {
          ...blockToDuplicate,
          id: `${blockToDuplicate.type}-${Date.now()}`,
          order: blocks.length + 1,
        }
        const newBlocks = [...blocks, newBlock]
        setBlocks(newBlocks)
        addToHistory(newBlocks)
      }
    },
    [blocks, addToHistory],
  )

  const getDefaultContent = (type: NewsletterBlock["type"]) => {
    switch (type) {
      case "header":
        return { title: "{STORY_TITLE}", subtitle: "Your Impact Story Update" }
      case "text":
        return { text: "Hi {SUBSCRIBER_NAME}!\n\nGreat news! {STORY_TITLE} has reached {PROGRESS_PERCENTAGE}% of its goal!" }
      case "image":
        return { src: "", alt: "Story Image", caption: "" }
      case "button":
        return { text: "Donate Now", url: "#", style: "primary" }
      case "progress":
        return { percentage: 65, label: "Progress to Goal" }
      case "spacer":
        return { height: 30 }
      case "divider":
        return { style: "solid" }
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
    <div className="h-full flex bg-background">
      {/* Left Sidebar */}
      <div
        className={cn(
          "bg-card border-r flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-80",
        )}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className={cn("space-y-2", sidebarCollapsed && "hidden")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Newsletter Builder</h2>
                  <p className="text-sm text-muted-foreground">Create stunning newsletters</p>
                </div>
              </div>
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
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="newsletter-name" className="text-sm font-semibold">
                  Newsletter Name
                </Label>
                <Input
                  id="newsletter-name"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  placeholder="Enter newsletter name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Template</Label>
                <div className="space-y-3">
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
                          <div className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-lg"
                              style={{
                                background: `linear-gradient(135deg, ${template.theme.colors.primary}, ${template.theme.colors.secondary})`,
                              }}
                            />
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-muted-foreground">{template.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
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
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-6">
              <TabsTrigger value="blocks">
                <Layout className="w-3 h-3 mr-1" />
                Blocks
              </TabsTrigger>
              <TabsTrigger value="themes">
                <Sparkles className="w-3 h-3 mr-1" />
                Design
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  Add Content
                </h3>
                <div className="space-y-4">
                  {["content", "media", "interactive", "layout"].map((category) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {blockTypes
                          .filter((blockType) => blockType.category === category)
                          .map((blockType) => (
                            <Button
                              key={blockType.type}
                              variant="outline"
                              size="sm"
                              onClick={() => addBlock(blockType.type as NewsletterBlock["type"])}
                              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-accent transition-colors group"
                            >
                              <div className="w-8 h-8 bg-muted group-hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                                <blockType.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                              </div>
                              <div className="text-center">
                                <span className="text-xs font-semibold">{blockType.label}</span>
                                <p className="text-xs text-muted-foreground mt-1">{blockType.description}</p>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" />
                    Content Blocks
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {blocks.length} blocks
                  </Badge>
                </div>
                <div className="space-y-3">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all duration-200 group hover:bg-accent",
                        selectedBlock === block.id
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/50",
                      )}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-muted group-hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                            <GripVertical className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold capitalize">{block.type}</span>
                            <Badge variant="outline" className="text-xs">
                              Block {index + 1}
                            </Badge>
                            {block.type === "text" && block.content.text && (
                              <span className="text-xs text-muted-foreground truncate max-w-20">
                                {block.content.text.replace(/<[^>]*>/g, "").substring(0, 20)}...
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateBlock(block.id)
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
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

            <TabsContent value="themes" className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Choose Theme
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {newsletterThemes.map((theme) => (
                    <Card
                      key={theme.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        selectedTheme.id === theme.id
                          ? "ring-2 ring-primary"
                          : "hover:ring-1 hover:ring-primary/50",
                      )}
                      onClick={() => setSelectedTheme(theme)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: theme.colors.secondary }}
                            />
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{theme.name}</h4>
                            <p className="text-xs text-muted-foreground">{theme.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Newsletter Settings
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Subject Line</Label>
                    <Input placeholder="Enter email subject" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">From Name</Label>
                    <Input placeholder="Your Organization Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Reply To</Label>
                    <Input placeholder="noreply@yourorg.com" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex === 0}
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex === history.length - 1}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex gap-2">
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <div className="flex border rounded-lg">
                  <Button
                    variant={previewDevice === "desktop" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "tablet" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none border-x"
                    onClick={() => setPreviewDevice("tablet")}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "mobile" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onSave?.({ blocks, theme: selectedTheme })}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => onSend?.({ blocks, theme: selectedTheme })}>
                <Send className="w-4 h-4 mr-2" />
                Send Newsletter
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter Preview/Editor */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div
              className="bg-background border rounded-lg shadow-sm"
              style={getPreviewDimensions()}
            >
              <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <Droppable droppableId="newsletter-blocks">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "min-h-96 p-6 space-y-4",
                        snapshot.isDraggingOver && "bg-accent/50",
                      )}
                    >
                      {blocks.length === 0 ? (
                        <div className="text-center py-12">
                          <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Start Building Your Newsletter</h3>
                          <p className="text-muted-foreground mb-4">
                            Add content blocks from the sidebar to create your newsletter
                          </p>
                          <Button onClick={() => addBlock("header")}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Block
                          </Button>
                        </div>
                      ) : (
                        blocks.map((block, index) => (
                          <Draggable key={block.id} draggableId={block.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "group relative",
                                  snapshot.isDragging && "opacity-50",
                                  selectedBlock === block.id && "ring-2 ring-primary",
                                )}
                              >
                                <div className="p-4 border rounded-lg bg-card hover:shadow-md transition-all">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm font-medium capitalize">{block.type} Block {index + 1}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => duplicateBlock(block.id)}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                        onClick={() => deleteBlock(block.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {block.type === "header" && (
                                      <div>
                                        <div className="font-semibold text-lg">{block.content.title}</div>
                                        <div className="text-sm">{block.content.subtitle}</div>
                                      </div>
                                    )}
                                    {block.type === "text" && (
                                      <div className="whitespace-pre-wrap">{block.content.text}</div>
                                    )}
                                    {block.type === "image" && (
                                      <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <div className="text-sm text-muted-foreground">Image: {block.content.alt || "No alt text"}</div>
                                      </div>
                                    )}
                                    {block.type === "button" && (
                                      <div className="text-center">
                                        <Button className="bg-primary text-primary-foreground">
                                          {block.content.text}
                                        </Button>
                                      </div>
                                    )}
                                    {block.type === "progress" && (
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>{block.content.label}</span>
                                          <span>{block.content.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                          <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${block.content.percentage}%` }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    {block.type === "spacer" && (
                                      <div className="text-center text-muted-foreground">
                                        <div className="border-t border-dashed border-muted-foreground/25 my-2" />
                                        <span className="text-xs">Spacer ({block.content.height}px)</span>
                                      </div>
                                    )}
                                    {block.type === "divider" && (
                                      <div className="border-t border-muted-foreground/25" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Block Properties */}
      {selectedBlockData && (
        <div className="w-80 bg-card border-l p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Block Properties</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBlock(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Content</Label>
              {selectedBlockData.type === "header" && (
                <div className="space-y-3 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Title</Label>
                    <Input
                      value={selectedBlockData.content.title}
                      onChange={(e) =>
                        updateBlock(selectedBlockData.id, {
                          content: { ...selectedBlockData.content, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Subtitle</Label>
                    <Input
                      value={selectedBlockData.content.subtitle}
                      onChange={(e) =>
                        updateBlock(selectedBlockData.id, {
                          content: { ...selectedBlockData.content, subtitle: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}
              {selectedBlockData.type === "text" && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Text Content</Label>
                  <Textarea
                    value={selectedBlockData.content.text}
                    onChange={(e) =>
                      updateBlock(selectedBlockData.id, {
                        content: { ...selectedBlockData.content, text: e.target.value },
                      })
                    }
                    rows={4}
                  />
                </div>
              )}
              {selectedBlockData.type === "button" && (
                <div className="space-y-3 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Button Text</Label>
                    <Input
                      value={selectedBlockData.content.text}
                      onChange={(e) =>
                        updateBlock(selectedBlockData.id, {
                          content: { ...selectedBlockData.content, text: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">URL</Label>
                    <Input
                      value={selectedBlockData.content.url}
                      onChange={(e) =>
                        updateBlock(selectedBlockData.id, {
                          content: { ...selectedBlockData.content, url: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template Gallery Modal */}
      {showTemplateGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Choose a Template</h2>
                <p className="text-muted-foreground">Select a professional template to start building your newsletter</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplateGallery(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsletterTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg group",
                      selectedTemplate?.id === template.id
                        ? "ring-2 ring-primary"
                        : "hover:ring-1 hover:ring-primary/50"
                    )}
                    onClick={() => {
                      setSelectedTemplate(template)
                      setBlocks(template.blocks)
                      setSelectedTheme(template.theme)
                      addToHistory(template.blocks)
                      setShowTemplateGallery(false)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Template Preview */}
                        <div className="bg-muted rounded-lg p-4 h-48 overflow-hidden">
                          <div className="space-y-3">
                            {/* Header Preview */}
                            <div 
                              className="h-8 rounded"
                              style={{ backgroundColor: template.theme.colors.primary }}
                            />
                            <div className="space-y-2">
                              <div className="h-3 bg-foreground/20 rounded w-3/4" />
                              <div className="h-3 bg-foreground/10 rounded w-1/2" />
                            </div>
                            {/* Content Blocks Preview */}
                            <div className="space-y-2">
                              {template.blocks.slice(0, 3).map((block, index) => (
                                <div key={index} className="space-y-1">
                                  {block.type === "text" && (
                                    <div className="space-y-1">
                                      <div className="h-2 bg-foreground/10 rounded w-full" />
                                      <div className="h-2 bg-foreground/5 rounded w-4/5" />
                                    </div>
                                  )}
                                  {block.type === "button" && (
                                    <div 
                                      className="h-6 rounded text-center text-xs flex items-center justify-center text-white"
                                      style={{ backgroundColor: template.theme.colors.primary }}
                                    >
                                      {block.content.text}
                                    </div>
                                  )}
                                  {block.type === "progress" && (
                                    <div className="space-y-1">
                                      <div className="h-2 bg-foreground/10 rounded w-full" />
                                      <div 
                                        className="h-1 rounded"
                                        style={{ 
                                          backgroundColor: template.theme.colors.primary,
                                          width: `${block.content.percentage}%`
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Template Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: template.theme.colors.primary }}
                            />
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: template.theme.colors.secondary }}
                            />
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: template.theme.colors.accent }}
                            />
                          </div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Layout className="w-3 h-3" />
                            {template.blocks.length} blocks
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t bg-muted/30">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateGallery(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowTemplateGallery(false)}
                >
                  Use Selected Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}