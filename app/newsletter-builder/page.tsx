"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RichTextEditor } from "@/components/rich-text-editor"
import { MediaUpload } from "@/components/media-upload"
import {
  Type,
  ImageIcon,
  Video,
  Layout,
  Eye,
  Download,
  Save,
  Undo,
  Redo,
  Smartphone,
  Monitor,
  GripVertical,
  Trash2,
  Copy,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  BookTemplate as FileTemplate,
  Heart,
  Users,
  Droplets,
  GraduationCap,
  TreePine,
  Stethoscope,
  Home,
  X,
  FileText,
  FileImage,
  Loader2,
  Mail,
  Share2,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NewsletterBlock {
  id: string
  type: "text" | "image" | "video" | "button" | "spacer"
  content: any
  styles?: any
}

interface NewsletterTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  blocks: NewsletterBlock[]
  title: string
}

const newsletterTemplates: NewsletterTemplate[] = [
  {
    id: "impact-update",
    name: "Impact Update",
    description: "Share your organization's latest achievements and impact stories",
    category: "general",
    thumbnail: "/nonprofit-impact-newsletter-template.jpg",
    title: "Monthly Impact Update",
    blocks: [
      {
        id: "header-1",
        type: "text",
        content: {
          text: "Monthly Impact Update",
          fontSize: "32",
          color: "#059669",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "intro-1",
        type: "text",
        content: {
          text: "Dear supporters, this month we've made incredible progress thanks to your generosity. Here's what your donations have accomplished:",
          fontSize: "16",
          color: "#475569",
          fontWeight: "normal",
          textAlign: "left",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "image-1",
        type: "image",
        content: {
          src: "/placeholder-g8ifo.png",
          alt: "Community impact photo",
          width: "100%",
          caption: "",
        },
        styles: { marginBottom: "24px", textAlign: "center" },
      },
      {
        id: "stats-1",
        type: "text",
        content: {
          text: "This Month's Impact:\n• 150 families received clean water access\n• 45 children enrolled in our education program\n• 12 community gardens established",
          fontSize: "16",
          color: "#475569",
          fontWeight: "normal",
          textAlign: "left",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "cta-1",
        type: "button",
        content: {
          text: "Continue Supporting Our Mission",
          link: "#",
          backgroundColor: "#059669",
          color: "#ffffff",
          borderRadius: "8",
          padding: "16",
        },
        styles: { marginBottom: "24px", textAlign: "center" },
      },
    ],
  },
  {
    id: "fundraising-campaign",
    name: "Fundraising Campaign",
    description: "Launch a compelling fundraising campaign with clear goals and impact",
    category: "fundraising",
    thumbnail: "/placeholder-f0qtw.png",
    title: "Help Us Reach Our Goal",
    blocks: [
      {
        id: "header-2",
        type: "text",
        content: {
          text: "Help Us Reach Our Goal",
          fontSize: "28",
          color: "#059669",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "20px" },
      },
      {
        id: "urgent-2",
        type: "text",
        content: {
          text: "URGENT: We need your help to provide emergency relief to 500 families affected by recent floods.",
          fontSize: "18",
          color: "#dc2626",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "goal-2",
        type: "text",
        content: {
          text: "Our Goal: $25,000\nRaised So Far: $18,500\nRemaining: $6,500",
          fontSize: "20",
          color: "#059669",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "impact-2",
        type: "text",
        content: {
          text: "Your donation will provide:\n• $50 - Emergency food supplies for one family\n• $100 - Clean water and sanitation kit\n• $250 - Temporary shelter materials",
          fontSize: "16",
          color: "#475569",
          fontWeight: "normal",
          textAlign: "left",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "donate-2",
        type: "button",
        content: {
          text: "Donate Now",
          link: "#",
          backgroundColor: "#dc2626",
          color: "#ffffff",
          borderRadius: "8",
          padding: "18",
        },
        styles: { marginBottom: "16px", textAlign: "center" },
      },
    ],
  },
  {
    id: "volunteer-spotlight",
    name: "Volunteer Spotlight",
    description: "Highlight amazing volunteers and encourage others to join",
    category: "community",
    thumbnail: "/volunteer-spotlight-newsletter.png",
    title: "Volunteer Spotlight",
    blocks: [
      {
        id: "header-3",
        type: "text",
        content: {
          text: "Volunteer Spotlight",
          fontSize: "30",
          color: "#059669",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "volunteer-3",
        type: "text",
        content: {
          text: "Meet Sarah Johnson",
          fontSize: "24",
          color: "#475569",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "16px" },
      },
      {
        id: "photo-3",
        type: "image",
        content: {
          src: "/placeholder-z8spo.png",
          alt: "Sarah Johnson, volunteer",
          width: "100%",
          caption: "",
        },
        styles: { marginBottom: "24px", textAlign: "center" },
      },
      {
        id: "story-3",
        type: "text",
        content: {
          text: "Sarah has been volunteering with us for 3 years, dedicating 10 hours every week to our literacy program. Thanks to her efforts, 25 children have improved their reading skills by two grade levels.",
          fontSize: "16",
          color: "#475569",
          fontWeight: "normal",
          textAlign: "left",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "quote-3",
        type: "text",
        content: {
          text: "\"Seeing the children's faces light up when they read their first book is the most rewarding experience. I encourage everyone to volunteer - you'll get back so much more than you give.\"",
          fontSize: "18",
          color: "#059669",
          fontWeight: "normal",
          textAlign: "center",
          fontStyle: "italic",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "volunteer-cta-3",
        type: "button",
        content: {
          text: "Join Our Volunteer Team",
          link: "#",
          backgroundColor: "#059669",
          color: "#ffffff",
          borderRadius: "8",
          padding: "16",
        },
        styles: { marginBottom: "24px", textAlign: "center" },
      },
    ],
  },
  {
    id: "event-announcement",
    name: "Event Announcement",
    description: "Promote upcoming events and encourage attendance",
    category: "events",
    thumbnail: "/event-announcement-newsletter-template.jpg",
    title: "Join Us for Our Annual Gala",
    blocks: [
      {
        id: "header-4",
        type: "text",
        content: {
          text: "Join Us for Our Annual Gala",
          fontSize: "28",
          color: "#059669",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "20px" },
      },
      {
        id: "date-4",
        type: "text",
        content: {
          text: "Saturday, March 15th, 2024\n6:00 PM - 11:00 PM\nGrand Ballroom, City Center",
          fontSize: "18",
          color: "#475569",
          fontWeight: "bold",
          textAlign: "center",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "event-image-4",
        type: "image",
        content: {
          src: "/elegant-gala-event-ballroom.jpg",
          alt: "Annual gala event",
          width: "100%",
          caption: "",
        },
        styles: { marginBottom: "24px", textAlign: "center" },
      },
      {
        id: "details-4",
        type: "text",
        content: {
          text: "Join us for an evening of celebration, inspiration, and community. Enjoy dinner, live entertainment, and hear stories of impact from the people we serve together.",
          fontSize: "16",
          color: "#475569",
          fontWeight: "normal",
          textAlign: "left",
          fontStyle: "normal",
          textDecoration: "none",
        },
        styles: { marginBottom: "24px" },
      },
      {
        id: "tickets-4",
        type: "button",
        content: {
          text: "Get Your Tickets",
          link: "#",
          backgroundColor: "#059669",
          color: "#ffffff",
          borderRadius: "8",
          padding: "16",
        },
        styles: { marginBottom: "24px", textAlign: "center" },
      },
    ],
  },
]

const templateCategories = [
  { id: "all", name: "All Templates", icon: Layout },
  { id: "general", name: "General", icon: Heart },
  { id: "fundraising", name: "Fundraising", icon: Users },
  { id: "community", name: "Community", icon: Home },
  { id: "events", name: "Events", icon: GraduationCap },
  { id: "health", name: "Health", icon: Stethoscope },
  { id: "environment", name: "Environment", icon: TreePine },
  { id: "water", name: "Water", icon: Droplets },
]

export default function NewsletterBuilderPage() {
  const [blocks, setBlocks] = useState<NewsletterBlock[]>([])
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [newsletterTitle, setNewsletterTitle] = useState("Untitled Newsletter")
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isFullPreview, setIsFullPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<"html" | "pdf">("html")

  const blockTypes = [
    { type: "text", icon: Type, label: "Text Block" },
    { type: "image", icon: ImageIcon, label: "Image" },
    { type: "video", icon: Video, label: "Video" },
    { type: "button", icon: Layout, label: "Button" },
    { type: "spacer", icon: GripVertical, label: "Spacer" },
  ]

  const addBlock = (type: string) => {
    const newBlock: NewsletterBlock = {
      id: `block-${Date.now()}`,
      type: type as any,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
    }
    setBlocks([...blocks, newBlock])
    setSelectedBlock(newBlock.id)
  }

  const loadTemplate = (template: NewsletterTemplate) => {
    setBlocks(
      template.blocks.map((block) => ({
        ...block,
        id: `${block.id}-${Date.now()}`,
      })),
    )
    setNewsletterTitle(template.title)
    setShowTemplateGallery(false)
    setSelectedBlock(null)
  }

  const filteredTemplates =
    selectedCategory === "all"
      ? newsletterTemplates
      : newsletterTemplates.filter((template) => template.category === selectedCategory)

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "text":
        return {
          html: "<p>Enter your text here...</p>",
          fontSize: "16",
          color: "#475569",
          fontWeight: "normal",
          textAlign: "left",
          fontStyle: "normal",
          textDecoration: "none",
        }
      case "image":
        return { src: "", alt: "Image description", width: "100%", caption: "" }
      case "video":
        return { src: "", width: "100%", caption: "" }
      case "button":
        return {
          text: "Click Here",
          link: "#",
          backgroundColor: "#059669",
          color: "#ffffff",
          borderRadius: "6",
          padding: "12",
        }
      case "spacer":
        return { height: "20" }
      default:
        return {}
    }
  }

  const getDefaultStyles = (type: string) => {
    switch (type) {
      case "text":
        return { marginBottom: "16px" }
      case "image":
      case "video":
        return { marginBottom: "16px", textAlign: "center" }
      case "button":
        return { marginBottom: "16px", textAlign: "center" }
      case "spacer":
        return {}
      default:
        return {}
    }
  }

  const onDragEnd = useCallback(
    (result: any) => {
      setDragOverIndex(null)

      if (!result.destination) return

      const items = Array.from(blocks)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      setBlocks(items)
    },
    [blocks],
  )

  const onDragUpdate = useCallback((update: any) => {
    if (update.destination) {
      setDragOverIndex(update.destination.index)
    } else {
      setDragOverIndex(null)
    }
  }, [])

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter((block) => block.id !== blockId))
    if (selectedBlock === blockId) {
      setSelectedBlock(null)
    }
  }

  const duplicateBlock = (blockId: string) => {
    const blockToDuplicate = blocks.find((block) => block.id === blockId)
    if (blockToDuplicate) {
      const newBlock: NewsletterBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now()}`,
      }
      const blockIndex = blocks.findIndex((block) => block.id === blockId)
      const newBlocks = [...blocks]
      newBlocks.splice(blockIndex + 1, 0, newBlock)
      setBlocks(newBlocks)
      setSelectedBlock(newBlock.id)
    }
  }

  const updateBlockContent = (blockId: string, updates: any) => {
    setBlocks(
      blocks.map((block) => (block.id === blockId ? { ...block, content: { ...block.content, ...updates } } : block)),
    )
  }

  const updateBlockStyles = (blockId: string, updates: any) => {
    setBlocks(
      blocks.map((block) => (block.id === blockId ? { ...block, styles: { ...block.styles, ...updates } } : block)),
    )
  }

  const selectedBlockData = selectedBlock ? blocks.find((block) => block.id === selectedBlock) : null

  const handleExport = async (format: "html" | "pdf" | "email") => {
    setIsExporting(true)
    try {
      if (format === "html") {
        const htmlContent = generateHTMLExport()
        const blob = new Blob([htmlContent], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${newsletterTitle.replace(/\s+/g, "-").toLowerCase()}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (format === "pdf") {
        // Enhanced PDF export with better styling
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(generatePrintableHTML())
          printWindow.document.close()
          printWindow.focus()
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 250)
        }
      } else if (format === "email") {
        // Generate email-optimized HTML
        const emailHTML = generateEmailHTML()
        const blob = new Blob([emailHTML], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${newsletterTitle.replace(/\s+/g, "-").toLowerCase()}-email.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const generateEmailHTML = () => {
    const blockHTML = blocks
      .map((block) => {
        switch (block.type) {
          case "text":
            return `<tr>
              <td style="padding: 12px 0;">
                <div style="font-size: ${block.properties.fontSize}px; color: ${block.properties.color}; font-weight: ${block.properties.bold ? "bold" : "normal"}; font-style: ${block.properties.italic ? "italic" : "normal"}; text-decoration: ${block.properties.underline ? "underline" : "none"}; text-align: ${block.properties.alignment}; line-height: 1.6;">
                  ${block.content}
                </div>
              </td>
            </tr>`
          case "image":
            return `<tr>
              <td style="padding: 12px 0; text-align: ${block.properties.alignment};">
                <img src="${block.properties.src}" alt="${block.properties.alt}" style="max-width: 100%; height: auto; border-radius: ${block.properties.borderRadius}px; display: block; margin: 0 auto;" />
                ${block.properties.caption ? `<div style="margin-top: 8px; font-size: 14px; color: #666; text-align: center;">${block.properties.caption}</div>` : ""}
              </td>
            </tr>`
          case "button":
            return `<tr>
              <td style="padding: 12px 0; text-align: ${block.properties.alignment};">
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background-color: ${block.properties.backgroundColor}; border-radius: ${block.properties.borderRadius}px;">
                      <a href="${block.properties.url}" style="display: inline-block; padding: ${block.properties.padding}px 24px; color: ${block.properties.textColor}; text-decoration: none; font-weight: 600;">
                        ${block.content}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
          case "spacer":
            return `<tr><td style="height: ${block.properties.height}px; line-height: ${block.properties.height}px;">&nbsp;</td></tr>`
          default:
            return ""
        }
      })
      .join("")

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${newsletterTitle}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td class="mobile-padding" style="padding: 40px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb;">
                    <h1 style="font-size: 28px; font-weight: bold; color: #059669; margin: 0; line-height: 1.2;">${newsletterTitle}</h1>
                  </td>
                </tr>
                ${blockHTML}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }

  const generatePrintableHTML = () => {
    const htmlContent = generateHTMLExport()
    return htmlContent.replace(
      "<style>",
      `<style>
        @media print { 
          body { margin: 0; padding: 20px; background: white !important; } 
          @page { margin: 1in; size: A4; }
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
        @media screen { body { background: #f9f9f9; } }`,
    )
  }

  const generateHTMLExport = () => {
    const blockHTML = blocks
      .map((block) => {
        switch (block.type) {
          case "text":
            return `<div style="margin-bottom: 24px;">
            <div style="font-size: ${block.properties.fontSize}px; color: ${block.properties.color}; font-weight: ${block.properties.bold ? "bold" : "normal"}; font-style: ${block.properties.italic ? "italic" : "normal"}; text-decoration: ${block.properties.underline ? "underline" : "none"}; text-align: ${block.properties.alignment};">
              ${block.content}
            </div>
          </div>`
          case "image":
            return `<div style="margin-bottom: 24px; text-align: ${block.properties.alignment};">
            <img src="${block.properties.src}" alt="${block.properties.alt}" style="max-width: 100%; height: auto; border-radius: ${block.properties.borderRadius}px;" />
            ${block.properties.caption ? `<p style="margin-top: 8px; font-size: 14px; color: #666; text-align: center;">${block.properties.caption}</p>` : ""}
          </div>`
          case "button":
            return `<div style="margin-bottom: 24px; text-align: ${block.properties.alignment};">
            <a href="${block.properties.url}" style="display: inline-block; padding: ${block.properties.padding}px 24px; background-color: ${block.properties.backgroundColor}; color: ${block.properties.textColor}; text-decoration: none; border-radius: ${block.properties.borderRadius}px; font-weight: 600;">
              ${block.content}
            </a>
          </div>`
          case "spacer":
            return `<div style="height: ${block.properties.height}px;"></div>`
          default:
            return ""
        }
      })
      .join("")

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletterTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .newsletter-header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb; }
    .newsletter-title { font-size: 28px; font-weight: bold; color: #059669; margin: 0; }
  </style>
</head>
<body>
  <div class="newsletter-header">
    <h1 class="newsletter-title">${newsletterTitle}</h1>
  </div>
  <div class="newsletter-content">
    ${blockHTML}
  </div>
</body>
</html>`
  }

  const renderBlock = (block: NewsletterBlock, isEditing: boolean) => {
    return (
      <>
        {block.type === "text" && (
          <div
            className="prose max-w-none"
            style={{
              fontSize: `${block.content.fontSize}px`,
              color: block.content.color,
              fontWeight: block.content.fontWeight,
              textAlign: block.content.textAlign,
              fontStyle: block.content.fontStyle,
              textDecoration: block.content.textDecoration,
            }}
            dangerouslySetInnerHTML={{
              __html: block.content.html || block.content.text || "Enter your text here...",
            }}
          />
        )}
        {block.type === "image" && (
          <div className="text-center">
            {block.content.src ? (
              <img
                src={block.content.src || "/placeholder.svg"}
                alt={block.content.alt}
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Add an image using the properties panel</p>
              </div>
            )}
          </div>
        )}
        {block.type === "video" && (
          <div className="text-center">
            {block.content.src ? (
              <video src={block.content.src} controls className="max-w-full h-auto rounded-lg" />
            ) : (
              <div className="bg-muted rounded-lg p-8 text-center">
                <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Add a video using the properties panel</p>
              </div>
            )}
          </div>
        )}
        {block.type === "button" && (
          <div style={{ textAlign: block.styles?.textAlign || "center" }}>
            <Button
              style={{
                backgroundColor: block.content.backgroundColor,
                color: block.content.color,
                borderRadius: `${block.content.borderRadius}px`,
                padding: `${block.content.padding}px 24px`,
              }}
              className="transition-all duration-200 hover:scale-105"
            >
              {block.content.text}
            </Button>
          </div>
        )}
        {block.type === "spacer" && (
          <div
            style={{ height: `${block.content.height}px` }}
            className="bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground">Spacer ({block.content.height}px)</span>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={newsletterTitle}
              onChange={(e) => setNewsletterTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none p-0 focus:ring-0 max-w-xs"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowTemplateGallery(true)}>
              <FileTemplate className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button variant="outline" size="sm">
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90" disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("html")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("email")}>
                  <Mail className="w-4 h-4 mr-2" />
                  Export for Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileImage className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsFullPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Full Screen Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.share && navigator.share({ title: newsletterTitle, url: window.location.href })
                  }
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Newsletter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {showTemplateGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-popover rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-popover-foreground">Newsletter Templates</h2>
                <p className="text-muted-foreground">Choose a template to get started quickly</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTemplateGallery(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-64 border-r border-border p-4">
                <h3 className="font-semibold text-popover-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {templateCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <img
                          src={template.thumbnail || "/placeholder.svg"}
                          alt={template.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {templateCategories.find((cat) => cat.id === template.category)?.name}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm mb-4">{template.description}</CardDescription>
                        <Button className="w-full" onClick={() => loadTemplate(template)}>
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">Components</h2>
            <div className="grid grid-cols-2 gap-3">
              {blockTypes.map((blockType) => (
                <Button
                  key={blockType.type}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-sidebar-primary bg-transparent transition-all duration-200 hover:scale-105"
                  onClick={() => addBlock(blockType.type)}
                >
                  <blockType.icon className="w-6 h-6" />
                  <span className="text-xs">{blockType.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Block Properties */}
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="text-sm font-semibold text-sidebar-foreground mb-4 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Properties
            </h3>
            {selectedBlockData ? (
              <div className="space-y-6">
                {selectedBlockData.type === "text" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Content</Label>
                      <RichTextEditor
                        value={selectedBlockData.content.html || selectedBlockData.content.text || ""}
                        onChange={(html) =>
                          updateBlockContent(selectedBlock!, { html, text: html.replace(/<[^>]*>/g, "") })
                        }
                        placeholder="Enter your text..."
                        className="min-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Font Size</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[Number.parseInt(selectedBlockData.content.fontSize)]}
                          onValueChange={(value) =>
                            updateBlockContent(selectedBlock!, { fontSize: value[0].toString() })
                          }
                          max={48}
                          min={12}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-8">
                          {selectedBlockData.content.fontSize}px
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Text Color</Label>
                      <Input
                        type="color"
                        value={selectedBlockData.content.color}
                        onChange={(e) => updateBlockContent(selectedBlock!, { color: e.target.value })}
                        className="h-8 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Text Alignment</Label>
                      <div className="flex space-x-1">
                        {[
                          { value: "left", icon: AlignLeft },
                          { value: "center", icon: AlignCenter },
                          { value: "right", icon: AlignRight },
                        ].map(({ value, icon: Icon }) => (
                          <Button
                            key={value}
                            variant={selectedBlockData.content.textAlign === value ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => updateBlockContent(selectedBlock!, { textAlign: value })}
                          >
                            <Icon className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Text Style</Label>
                      <div className="flex space-x-1">
                        <Button
                          variant={selectedBlockData.content.fontWeight === "bold" ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateBlockContent(selectedBlock!, {
                              fontWeight: selectedBlockData.content.fontWeight === "bold" ? "normal" : "bold",
                            })
                          }
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={selectedBlockData.content.fontStyle === "italic" ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateBlockContent(selectedBlock!, {
                              fontStyle: selectedBlockData.content.fontStyle === "italic" ? "normal" : "italic",
                            })
                          }
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={selectedBlockData.content.textDecoration === "underline" ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            updateBlockContent(selectedBlock!, {
                              textDecoration:
                                selectedBlockData.content.textDecoration === "underline" ? "none" : "underline",
                            })
                          }
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {selectedBlockData.type === "button" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Button Text</Label>
                      <Input
                        value={selectedBlockData.content.text}
                        onChange={(e) => updateBlockContent(selectedBlock!, { text: e.target.value })}
                        placeholder="Button text"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Link URL</Label>
                      <Input
                        value={selectedBlockData.content.link}
                        onChange={(e) => updateBlockContent(selectedBlock!, { link: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Background Color</Label>
                      <Input
                        type="color"
                        value={selectedBlockData.content.backgroundColor}
                        onChange={(e) => updateBlockContent(selectedBlock!, { backgroundColor: e.target.value })}
                        className="h-8 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Text Color</Label>
                      <Input
                        type="color"
                        value={selectedBlockData.content.color}
                        onChange={(e) => updateBlockContent(selectedBlock!, { color: e.target.value })}
                        className="h-8 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Border Radius</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[Number.parseInt(selectedBlockData.content.borderRadius)]}
                          onValueChange={(value) =>
                            updateBlockContent(selectedBlock!, { borderRadius: value[0].toString() })
                          }
                          max={20}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-8">
                          {selectedBlockData.content.borderRadius}px
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {selectedBlockData.type === "image" && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Image</Label>
                      <MediaUpload
                        type="image"
                        onMediaSelect={(src, alt) => {
                          updateBlockContent(selectedBlock!, { src, alt: alt || "Image" })
                        }}
                      />

                      {selectedBlockData.content.src && (
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Alt Text</Label>
                          <Input
                            value={selectedBlockData.content.alt}
                            onChange={(e) => updateBlockContent(selectedBlock!, { alt: e.target.value })}
                            placeholder="Image description"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {selectedBlockData.type === "video" && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Video</Label>
                      <MediaUpload
                        type="video"
                        onMediaSelect={(src, caption) => {
                          updateBlockContent(selectedBlock!, { src, caption: caption || "" })
                        }}
                      />

                      {selectedBlockData.content.src && (
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Caption</Label>
                          <Input
                            value={selectedBlockData.content.caption}
                            onChange={(e) => updateBlockContent(selectedBlock!, { caption: e.target.value })}
                            placeholder="Video caption"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {selectedBlockData.type === "spacer" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Height</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[Number.parseInt(selectedBlockData.content.height)]}
                        onValueChange={(value) => updateBlockContent(selectedBlock!, { height: value[0].toString() })}
                        max={100}
                        min={10}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-12">{selectedBlockData.content.height}px</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a block to edit its properties.</p>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Preview Controls */}
          <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={previewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={previewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsFullPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Full Preview
            </Button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-muted/30 p-6 overflow-auto">
            <div
              className={`mx-auto bg-popover border border-border shadow-lg transition-all duration-300 ${
                previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
              }`}
            >
              <div className="p-8">
                <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                  <Droppable droppableId="newsletter-blocks">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-96 space-y-4 transition-colors duration-200 ${
                          snapshot.isDraggingOver ? "bg-primary/5 rounded-lg" : ""
                        }`}
                      >
                        {blocks.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Start building your newsletter</p>
                            <p className="text-sm">Add components from the sidebar to get started</p>
                          </div>
                        ) : (
                          blocks.map((block, index) => (
                            <div key={block.id}>
                              {dragOverIndex === index && (
                                <div className="h-2 bg-primary rounded-full mb-2 animate-pulse" />
                              )}

                              <Draggable draggableId={block.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`group relative border-2 rounded-lg p-4 transition-all duration-200 ${
                                      selectedBlock === block.id
                                        ? "border-primary bg-primary/5"
                                        : "border-transparent hover:border-primary/50"
                                    } ${
                                      snapshot.isDragging
                                        ? "shadow-2xl rotate-2 scale-105 bg-popover border-primary"
                                        : ""
                                    }`}
                                    onClick={() => setSelectedBlock(block.id)}
                                    style={block.styles}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing bg-primary text-primary-foreground rounded p-1"
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </div>

                                    <div className="absolute right-0 top-0 -translate-y-2 translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          duplicateBlock(block.id)
                                        }}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          deleteBlock(block.id)
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>

                                    <div className="min-h-12">
                                      {block.type === "text" && (
                                        <div
                                          className="prose max-w-none"
                                          style={{
                                            fontSize: `${block.content.fontSize}px`,
                                            color: block.content.color,
                                            fontWeight: block.content.fontWeight,
                                            textAlign: block.content.textAlign,
                                            fontStyle: block.content.fontStyle,
                                            textDecoration: block.content.textDecoration,
                                          }}
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              block.content.html || block.content.text || "Enter your text here...",
                                          }}
                                        />
                                      )}
                                      {block.type === "image" && (
                                        <div className="text-center">
                                          {block.content.src ? (
                                            <img
                                              src={block.content.src || "/placeholder.svg"}
                                              alt={block.content.alt}
                                              className="max-w-full h-auto rounded-lg"
                                            />
                                          ) : (
                                            <div className="bg-muted rounded-lg p-8 text-center">
                                              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                                              <p className="text-sm text-muted-foreground">
                                                Add an image using the properties panel
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {block.type === "video" && (
                                        <div className="text-center">
                                          {block.content.src ? (
                                            <video
                                              src={block.content.src}
                                              controls
                                              className="max-w-full h-auto rounded-lg"
                                            />
                                          ) : (
                                            <div className="bg-muted rounded-lg p-8 text-center">
                                              <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                                              <p className="text-sm text-muted-foreground">
                                                Add a video using the properties panel
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {block.type === "button" && (
                                        <div style={{ textAlign: block.styles?.textAlign || "center" }}>
                                          <Button
                                            style={{
                                              backgroundColor: block.content.backgroundColor,
                                              color: block.content.color,
                                              borderRadius: `${block.content.borderRadius}px`,
                                              padding: `${block.content.padding}px 24px`,
                                            }}
                                            className="transition-all duration-200 hover:scale-105"
                                          >
                                            {block.content.text}
                                          </Button>
                                        </div>
                                      )}
                                      {block.type === "spacer" && (
                                        <div
                                          style={{ height: `${block.content.height}px` }}
                                          className="bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                                        >
                                          <span className="text-xs text-muted-foreground">
                                            Spacer ({block.content.height}px)
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            </div>
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
      </div>

      {isFullPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">Newsletter Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isExporting}>
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport("html")}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("email")}>
                      <Mail className="w-4 h-4 mr-2" />
                      Export for Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>
                      <FileImage className="w-4 h-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.share && navigator.share({ title: newsletterTitle, url: window.location.href })
                      }
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Newsletter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={() => setIsFullPreview(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-80px)] bg-muted/30">
              <div
                className={`mx-auto bg-background border border-border shadow-lg transition-all duration-300 ${
                  previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"
                }`}
              >
                <div className="p-8">
                  <div className="text-center mb-8 pb-6 border-b border-border">
                    <h1 className="text-3xl font-bold text-primary mb-2">{newsletterTitle}</h1>
                    <p className="text-muted-foreground">Newsletter Preview</p>
                  </div>
                  <div className="space-y-6">
                    {blocks.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No content to preview</p>
                        <p className="text-sm">Add components to see your newsletter preview</p>
                      </div>
                    ) : (
                      blocks.map((block) => (
                        <div key={block.id} className="newsletter-block">
                          {renderBlock(block, false)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
