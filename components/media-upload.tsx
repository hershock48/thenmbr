"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link, ImageIcon, Video } from "lucide-react"

interface MediaUploadProps {
  type: "image" | "video"
  onMediaSelect: (src: string, alt?: string) => void
  className?: string
}

export function MediaUpload({ type, onMediaSelect, className = "" }: MediaUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [altInput, setAltInput] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const file = files.find((f) => (type === "image" ? f.type.startsWith("image/") : f.type.startsWith("video/")))

      if (file) {
        await handleFileUpload(file)
      }
    },
    [type],
  )

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      // Create a local URL for the file
      const url = URL.createObjectURL(file)
      onMediaSelect(url, altInput || file.name)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [])

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onMediaSelect(urlInput.trim(), altInput.trim())
      setUrlInput("")
      setAltInput("")
    }
  }, [urlInput, altInput, onMediaSelect])

  const Icon = type === "image" ? ImageIcon : Video
  const acceptTypes = type === "image" ? "image/*" : "video/*"

  return (
    <div className={className}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">From URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">Drag and drop your {type} here, or click to browse</p>
            <Button variant="outline" disabled={uploading} asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : `Choose ${type}`}
                <input
                  type="file"
                  accept={acceptTypes}
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">URL</Label>
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={`Enter ${type} URL`}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">{type === "image" ? "Alt Text" : "Caption"}</Label>
              <Input
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
                placeholder={`${type === "image" ? "Alt text" : "Caption"} (optional)`}
                className="mt-1"
              />
            </div>
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()} className="w-full">
              <Link className="w-4 h-4 mr-2" />
              Add {type}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
