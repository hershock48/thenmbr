'use client'

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
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
  Upload,
  Minus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Unlink,
  Code,
  Paintbrush,
  Wand2,
  Magic,
  Sparkle,
  Rainbow,
  Brush,
  Eraser,
  Scissors,
  Crop,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List as ListIcon,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Star,
  Heart,
  Diamond,
  Crown,
  Flame,
  Sun,
  Moon,
  Cloud,
  Leaf,
  Flower,
  Tree,
  Mountain,
  Ocean,
  Fire,
  Water,
  Earth,
  Air,
  Space,
  Galaxy,
  Planet,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Globe,
  Shield,
  Lightbulb,
  Rocket,
  Target,
  Calendar,
  Mail,
  Users,
  BarChart3,
  FileText,
  Layout,
  ArrowRight,
  Check,
  X,
  Grip,
  MoreHorizontal,
  Edit3,
  EyeOff,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  CameraOff,
  Phone,
  PhoneOff,
  MessageCircle,
  MessageSquare,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  Flag,
  FlagOff,
  Bell,
  BellOff,
  Star as StarIcon,
  StarOff,
  Heart as HeartIcon,
  HeartOff,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Surprised,
  Confused,
  Sad,
  Happy,
  Wink,
  Tongue,
  Kiss,
  Wink2,
  Blush,
  Cool,
  Crying,
  Dizzy,
  Expressionless,
  FaceWithRollingEyes,
  FaceWithTearsOfJoy,
  FaceWithSteamFromNose,
  FaceWithSymbolsOverMouth,
  FaceWithHandOverMouth,
  FaceWithMonocle,
  FaceWithOpenMouth,
  FaceWithRaisedEyebrow,
  FaceWithSymbolsOverMouth as FaceWithSymbolsOverMouthIcon,
  FaceWithTearsOfJoy as FaceWithTearsOfJoyIcon,
  FaceWithSteamFromNose as FaceWithSteamFromNoseIcon,
  FaceWithHandOverMouth as FaceWithHandOverMouthIcon,
  FaceWithMonocle as FaceWithMonocleIcon,
  FaceWithOpenMouth as FaceWithOpenMouthIcon,
  FaceWithRaisedEyebrow as FaceWithRaisedEyebrowIcon,
  FaceWithRollingEyes as FaceWithRollingEyesIcon,
  Expressionless as ExpressionlessIcon,
  Dizzy as DizzyIcon,
  Crying as CryingIcon,
  Cool as CoolIcon,
  Blush as BlushIcon,
  Wink2 as Wink2Icon,
  Kiss as KissIcon,
  Tongue as TongueIcon,
  Wink as WinkIcon,
  Happy as HappyIcon,
  Sad as SadIcon,
  Confused as ConfusedIcon,
  Surprised as SurprisedIcon,
  Angry as AngryIcon,
  Laugh as LaughIcon,
  Meh as MehIcon,
  Frown as FrownIcon,
  Smile as SmileIcon,
  HeartOff as HeartOffIcon,
  StarOff as StarOffIcon,
  BellOff as BellOffIcon,
  FlagOff as FlagOffIcon,
  BookmarkCheck as BookmarkCheckIcon,
  Bookmark as BookmarkIcon,
  ThumbsDown as ThumbsDownIcon,
  ThumbsUp as ThumbsUpIcon,
  Share2 as Share2Icon,
  MessageSquare as MessageSquareIcon,
  MessageCircle as MessageCircleIcon,
  PhoneOff as PhoneOffIcon,
  Phone as PhoneIcon,
  CameraOff as CameraOffIcon,
  Camera as CameraIcon,
  VideoOff as VideoOffIcon,
  Video as VideoIcon,
  MicOff as MicOffIcon,
  Mic as MicIcon,
  VolumeX as VolumeXIcon,
  Volume2 as Volume2Icon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Pause as PauseIcon,
  Play as PlayIcon,
  RefreshCw as RefreshCwIcon,
  EyeOff as EyeOffIcon,
  Edit3 as Edit3Icon,
  MoreHorizontal as MoreHorizontalIcon,
  Grip as GripIcon
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { newsletterThemes, newsletterTemplates, type NewsletterBlock, type NewsletterTheme, type NewsletterTemplate } from "@/lib/newsletter-templates"
import { toast } from "@/hooks/use-toast"

interface NewsletterBuilderProps {
  storyId: string
  organizationId: string
  onSave?: (newsletter: any) => void
  onSend?: (newsletter: any) => void
}

export function ModernNewsletterBuilder({ storyId, organizationId, onSave, onSend }: NewsletterBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate | null>(newsletterTemplates[0])
  const [selectedTheme, setSelectedTheme] = useState<NewsletterTheme>(newsletterThemes[0])
  const [blocks, setBlocks] = useState<NewsletterBlock[]>(newsletterTemplates[0]?.blocks || [])
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [newsletterName, setNewsletterName] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newBlocks = Array.from(blocks)
    const [reorderedItem] = newBlocks.splice(result.source.index, 1)
    newBlocks.splice(result.destination.index, 0, reorderedItem)

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
    toast({
      title: "Block Added",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} block added to your newsletter`,
    })
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
    toast({
      title: "Block Deleted",
      description: "Block removed from your newsletter",
    })
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
      toast({
        title: "Block Duplicated",
        description: "Block copied successfully",
      })
    }
  }

  const getDefaultBlockContent = (type: NewsletterBlock['type']) => {
    switch (type) {
      case 'header':
        return { text: 'Your Impact Story Update', subtext: 'Making a difference together' }
      case 'text':
        return { text: 'Hi {SUBSCRIBER_NAME}! Great news! {STORY_TITLE} has reached {PROGRESS_PERCENTAGE}% of its goal!' }
      case 'image':
        return { src: '/placeholder.jpg', alt: 'Impact Story Image', caption: 'Your impact: 18.7%' }
      case 'button':
        return { text: 'Support This Story', url: '#', style: 'primary' }
      case 'progress':
        return { current: 18.7, goal: 100, label: 'Progress towards goal' }
      case 'spacer':
        return { height: 20 }
      case 'divider':
        return { style: 'solid', color: '#e5e7eb' }
      default:
        return {}
    }
  }

  const getDefaultBlockStyling = (type: NewsletterBlock['type']) => {
    switch (type) {
      case 'header':
        return { 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          padding: '24px',
          borderRadius: '12px'
        }
      case 'text':
        return { 
          fontSize: '16px', 
          color: '#374151', 
          lineHeight: '1.6',
          padding: '16px',
          backgroundColor: '#ffffff',
          borderRadius: '8px'
        }
      case 'image':
        return { 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          margin: '16px 0'
        }
      case 'button':
        return { 
          backgroundColor: '#3b82f6', 
          color: '#ffffff', 
          padding: '12px 24px', 
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          display: 'inline-block',
          textDecoration: 'none'
        }
      case 'progress':
        return { 
          backgroundColor: '#f3f4f6', 
          height: '8px', 
          borderRadius: '4px',
          margin: '16px 0'
        }
      default:
        return {}
    }
  }

  const renderBlock = (block: NewsletterBlock) => {
    const isSelected = selectedBlock === block.id
    
    return (
      <div
        key={block.id}
        className={`relative group cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' 
            : 'hover:shadow-md hover:scale-[1.01]'
        }`}
        onClick={() => setSelectedBlock(block.id)}
      >
        {/* Block Actions */}
        <div className={`absolute -top-2 -right-2 z-10 flex gap-1 transition-opacity duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0 bg-white shadow-md hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation()
              duplicateBlock(block.id)
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0 bg-white shadow-md hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              deleteBlock(block.id)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Block Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {block.type === 'header' && (
            <div 
              className="text-center p-6"
              style={block.styling}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {block.content.text}
              </h1>
              <p className="text-lg text-gray-600">
                {block.content.subtext}
              </p>
            </div>
          )}

          {block.type === 'text' && (
            <div 
              className="p-4"
              style={block.styling}
            >
              <p className="text-gray-700 leading-relaxed">
                {block.content.text}
              </p>
            </div>
          )}

          {block.type === 'image' && (
            <div className="relative">
              <img
                src={block.content.src}
                alt={block.content.alt}
                className="w-full h-48 object-cover"
                style={block.styling}
              />
              {block.content.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {block.content.caption}
                </div>
              )}
            </div>
          )}

          {block.type === 'button' && (
            <div className="p-4 text-center">
              <a
                href={block.content.url}
                className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={block.styling}
              >
                {block.content.text}
              </a>
            </div>
          )}

          {block.type === 'progress' && (
            <div className="p-4">
              <div className="mb-2 text-sm text-gray-600">
                {block.content.label}
              </div>
              <div className="relative">
                <div 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: block.styling.backgroundColor }}
                >
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${block.content.current}%` }}
                  />
                </div>
                <div className="mt-2 text-sm font-semibold text-gray-700">
                  {block.content.current}% Complete
                </div>
              </div>
            </div>
          )}

          {block.type === 'spacer' && (
            <div style={{ height: `${block.content.height}px` }} />
          )}

          {block.type === 'divider' && (
            <div 
              className="w-full"
              style={{ 
                height: '1px', 
                backgroundColor: block.content.color,
                borderStyle: block.content.style
              }}
            />
          )}
        </div>
      </div>
    )
  }

  const blockTypes = [
    { type: 'header', label: 'Header', icon: Type, color: 'bg-blue-500', description: 'Add a title and subtitle' },
    { type: 'text', label: 'Text', icon: FileText, color: 'bg-green-500', description: 'Add text content' },
    { type: 'image', label: 'Image', icon: Image, color: 'bg-purple-500', description: 'Add images and photos' },
    { type: 'button', label: 'Button', icon: MousePointer, color: 'bg-orange-500', description: 'Add call-to-action buttons' },
    { type: 'progress', label: 'Progress', icon: BarChart3, color: 'bg-pink-500', description: 'Show progress bars' },
    { type: 'spacer', label: 'Spacer', icon: Square, color: 'bg-gray-500', description: 'Add white space' },
    { type: 'divider', label: 'Divider', icon: Minus, color: 'bg-indigo-500', description: 'Add visual separators' }
  ]

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col ${isFullscreen ? 'w-full h-full rounded-none' : 'w-[95vw] h-[90vh] max-w-7xl'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Newsletter Builder</h2>
              <p className="text-sm text-gray-600">Create beautiful, engaging newsletters</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2"
            >
              {previewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-2"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMediaLibrary(true)}
              className="flex items-center space-x-2"
            >
              <Image className="h-4 w-4" />
              <span>Media</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave?.({ blocks, theme: selectedTheme, template: selectedTemplate })}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
            
            <Button
              size="sm"
              onClick={() => onSend?.({ blocks, theme: selectedTheme, template: selectedTemplate })}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* Close modal */}}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
            {/* Newsletter Name */}
            <div className="p-4 border-b border-gray-200">
              <Label htmlFor="newsletter-name" className="text-sm font-medium text-gray-700">
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

            {/* Template Selection */}
            <div className="p-4 border-b border-gray-200">
              <Label className="text-sm font-medium text-gray-700">Template</Label>
              <Select value={selectedTemplate?.id} onValueChange={(value) => {
                const template = newsletterTemplates.find(t => t.id === value)
                if (template) {
                  setSelectedTemplate(template)
                  setBlocks(template.blocks)
                }
              }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {newsletterTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: template.color }} />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-4">
                <TabsTrigger value="blocks" className="flex items-center space-x-2">
                  <Layout className="h-4 w-4" />
                  <span>Blocks</span>
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>Themes</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="blocks" className="flex-1 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add Blocks</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {blockTypes.map((blockType) => {
                      const Icon = blockType.icon
                      return (
                        <Button
                          key={blockType.type}
                          variant="outline"
                          className="h-auto p-3 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200"
                          onClick={() => addBlock(blockType.type as NewsletterBlock['type'])}
                        >
                          <div className={`p-2 rounded-lg ${blockType.color}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{blockType.label}</div>
                            <div className="text-xs text-gray-500">{blockType.description}</div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Block Library */}
                {blocks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Block Library</h3>
                    <div className="space-y-2">
                      {blocks.map((block, index) => (
                        <div
                          key={block.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedBlock === block.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedBlock(block.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span className="text-sm font-medium capitalize">{block.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  duplicateBlock(block.id)
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteBlock(block.id)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="themes" className="flex-1 p-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Theme</h3>
                  <div className="space-y-3">
                    {newsletterThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedTheme.id === theme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTheme(theme)}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-lg"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <div>
                            <div className="text-sm font-medium">{theme.name}</div>
                            <div className="text-xs text-gray-500">{theme.description}</div>
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
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Newsletter Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Auto-save</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Email preview</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Mobile responsive</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Preview Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Preview</span>
                  <Badge variant="secondary" className="text-xs">
                    {blocks.length} blocks
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </div>

            {/* Newsletter Preview */}
            <div className="flex-1 overflow-auto p-6 bg-gray-100">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="newsletter-blocks">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-4 p-6"
                        >
                          {blocks.map((block, index) => (
                            <Draggable key={block.id} draggableId={block.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-all duration-200 ${
                                    snapshot.isDragging ? 'opacity-50 scale-95' : ''
                                  }`}
                                >
                                  {renderBlock(block)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
