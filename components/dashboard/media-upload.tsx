"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  ImageIcon,
  type File,
  Search,
  Grid,
  List,
  Trash2,
  X,
  Check,
  FolderPlus,
  Folder,
  Edit3,
  Eye,
  CloudUpload,
  FileVideo,
  FileText,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  name: string
  type: "image" | "video" | "document"
  url: string
  thumbnail?: string
  size: number
  uploadedAt: string
  alt?: string
  caption?: string
  tags: string[]
  folder?: string
  dimensions?: { width: number; height: number }
  optimized?: boolean
}

interface MediaFolder {
  id: string
  name: string
  color: string
  fileCount: number
  createdAt: string
}

interface UploadProgress {
  id: string
  name: string
  progress: number
  status: "uploading" | "processing" | "complete" | "error"
}

interface MediaUploadProps {
  onSelect?: (file: MediaFile) => void
  onUpload?: (files: File[]) => void
  organizationId: string
}

export function MediaUpload({ onSelect, onUpload, organizationId }: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "document">("all")
  const [selectedFolder, setSelectedFolder] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Mock data with enhanced structure
  const mockFolders: MediaFolder[] = [
    { id: "stories", name: "Story Images", color: "bg-blue-500", fileCount: 12, createdAt: "2024-01-10T00:00:00Z" },
    { id: "logos", name: "Logos & Branding", color: "bg-purple-500", fileCount: 8, createdAt: "2024-01-08T00:00:00Z" },
    {
      id: "newsletters",
      name: "Newsletter Assets",
      color: "bg-green-500",
      fileCount: 15,
      createdAt: "2024-01-05T00:00:00Z",
    },
    { id: "social", name: "Social Media", color: "bg-pink-500", fileCount: 23, createdAt: "2024-01-03T00:00:00Z" },
  ]

  const mockFiles: MediaFile[] = [
    {
      id: "1",
      name: "water-well-village.jpg",
      type: "image",
      url: "/water-well-village.jpg",
      thumbnail: "/water-well-village.jpg",
      size: 245760,
      uploadedAt: "2024-01-15T10:30:00Z",
      alt: "Village water well project",
      caption: "Clean water access for 500 families",
      tags: ["water", "village", "well", "impact"],
      folder: "stories",
      dimensions: { width: 1920, height: 1080 },
      optimized: true,
    },
    {
      id: "2",
      name: "school-children-books.jpg",
      type: "image",
      url: "/school-children-books.jpg",
      thumbnail: "/school-children-books.jpg",
      size: 189440,
      uploadedAt: "2024-01-14T14:20:00Z",
      alt: "Children with school supplies",
      caption: "Education materials for 200 children",
      tags: ["education", "children", "books", "school"],
      folder: "stories",
      dimensions: { width: 1600, height: 900 },
      optimized: true,
    },
    {
      id: "3",
      name: "hope-foundation-logo.jpg",
      type: "image",
      url: "/hope-foundation-logo.jpg",
      thumbnail: "/hope-foundation-logo.jpg",
      size: 89120,
      uploadedAt: "2024-01-13T09:15:00Z",
      alt: "Hope Foundation logo",
      caption: "Official organization logo",
      tags: ["logo", "branding", "foundation"],
      folder: "logos",
      dimensions: { width: 800, height: 800 },
      optimized: true,
    },
  ]

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockFiles)
  const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>(mockFolders)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)
      const newProgress: UploadProgress[] = acceptedFiles.map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        progress: 0,
        status: "uploading",
      }))
      setUploadProgress(newProgress)

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setUploadProgress((prev) => prev.map((p) => ({ ...p, progress: i })))
        }

        // Simulate processing
        setUploadProgress((prev) => prev.map((p) => ({ ...p, status: "processing" })))
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In a real app, this would upload to Vercel Blob or similar storage
        const uploadedFiles: MediaFile[] = acceptedFiles.map((file, index) => ({
          id: `uploaded-${Date.now()}-${index}`,
          name: file.name,
          type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
          url: URL.createObjectURL(file),
          thumbnail: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          tags: [],
          folder: selectedFolder === "all" ? undefined : selectedFolder,
          dimensions: file.type.startsWith("image/") ? { width: 1920, height: 1080 } : undefined,
          optimized: file.type.startsWith("image/"),
        }))

        setMediaFiles((prev) => [...uploadedFiles, ...prev])
        setUploadProgress((prev) => prev.map((p) => ({ ...p, status: "complete" })))
        onUpload?.(acceptedFiles)

        toast({
          title: "Upload Complete! ✨",
          description: `${acceptedFiles.length} file(s) uploaded and optimized successfully`,
        })

        // Clear progress after delay
        setTimeout(() => setUploadProgress([]), 2000)
      } catch (error) {
        setUploadProgress((prev) => prev.map((p) => ({ ...p, status: "error" })))
        toast({
          title: "Upload Error",
          description: "Failed to upload files. Please try again.",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    },
    [selectedFolder, onUpload, toast],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true,
  })

  const handleFileSelect = (file: MediaFile) => {
    onSelect?.(file)
    toast({
      title: "File Selected",
      description: `${file.name} is ready to use`,
    })
  }

  const handleFileDelete = (fileId: string) => {
    setMediaFiles((prev) => prev.filter((f) => f.id !== fileId))
    setSelectedFiles((prev) => prev.filter((id) => id !== fileId))
    toast({
      title: "File Deleted",
      description: "File has been removed from your library",
    })
  }

  const handleBulkDelete = () => {
    setMediaFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)))
    setSelectedFiles([])
    toast({
      title: "Files Deleted",
      description: `${selectedFiles.length} files removed from your library`,
    })
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: MediaFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      color: `bg-${["blue", "purple", "green", "pink", "orange", "cyan"][Math.floor(Math.random() * 6)]}-500`,
      fileCount: 0,
      createdAt: new Date().toISOString(),
    }

    setMediaFolders((prev) => [...prev, newFolder])
    setNewFolderName("")
    setShowNewFolder(false)
    toast({
      title: "Folder Created",
      description: `"${newFolder.name}" folder is ready to organize your files`,
    })
  }

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterType === "all" || file.type === filterType
    const matchesFolder = selectedFolder === "all" || file.folder === selectedFolder
    return matchesSearch && matchesFilter && matchesFolder
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5" />
      case "video":
        return <FileVideo className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CloudUpload className="w-5 h-5 text-white" />
              </div>
              Media Library
            </h2>
            <p className="text-gray-600 mt-1">Professional asset management with drag-and-drop upload</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowNewFolder(true)}
              variant="outline"
              className="border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length > 0) onDrop(files)
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {mediaFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded", folder.color)} />
                      {folder.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-32 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-8"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="space-y-3">
            {uploadProgress.map((progress) => (
              <div key={progress.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-900">{progress.name}</span>
                    <span className="text-xs text-blue-700">
                      {progress.status === "uploading" && `${progress.progress}%`}
                      {progress.status === "processing" && "Optimizing..."}
                      {progress.status === "complete" && "Complete ✓"}
                      {progress.status === "error" && "Error ✗"}
                    </span>
                  </div>
                  <Progress value={progress.status === "complete" ? 100 : progress.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">{selectedFiles.length} file(s) selected</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedFiles([])}>
                <X className="w-4 h-4 mr-2" />
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Folders */}
        <div className="w-64 border-r border-gray-200 bg-white/50 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Folders</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedFolder("all")}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                    selectedFolder === "all" ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100 text-gray-700",
                  )}
                >
                  <Folder className="w-4 h-4" />
                  <span className="text-sm">All Files</span>
                  <span className="ml-auto text-xs text-gray-500">{mediaFiles.length}</span>
                </button>
                {mediaFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                      selectedFolder === folder.id ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100 text-gray-700",
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded", folder.color)} />
                    <span className="text-sm">{folder.name}</span>
                    <span className="ml-auto text-xs text-gray-500">{folder.fileCount}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* File Grid/List Area */}
        <div className="flex-1 overflow-auto">
          {/* Drag and Drop Zone */}
          <div
            {...getRootProps()}
            className={cn(
              "m-4 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer",
              isDragActive && !isDragReject && "border-blue-500 bg-blue-50",
              isDragReject && "border-red-500 bg-red-50",
              !isDragActive && "border-gray-300 hover:border-gray-400",
            )}
          >
            <input {...getInputProps()} />
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="w-8 h-8 text-white" />
              </div>
              {isDragActive ? (
                isDragReject ? (
                  <p className="text-red-600 font-medium">Some files are not supported</p>
                ) : (
                  <p className="text-blue-600 font-medium">Drop files here to upload</p>
                )
              ) : (
                <div>
                  <p className="text-gray-900 font-medium mb-2">Drag & drop files here, or click to browse</p>
                  <p className="text-gray-500 text-sm">Supports images, videos, and documents up to 50MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Files Display */}
          <div className="p-4">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Upload some files to get started"}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First Files
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-2"
                }
              >
                {filteredFiles.map((file) => (
                  <Card
                    key={file.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-gray-200",
                      selectedFiles.includes(file.id) && "ring-2 ring-blue-500 bg-blue-50",
                    )}
                    onClick={() => {
                      if (selectedFiles.includes(file.id)) {
                        setSelectedFiles((prev) => prev.filter((id) => id !== file.id))
                      } else {
                        setSelectedFiles((prev) => [...prev, file.id])
                      }
                    }}
                  >
                    <CardContent className="p-0">
                      {viewMode === "grid" ? (
                        <div className="relative group">
                          {file.type === "image" ? (
                            <div className="aspect-square relative overflow-hidden rounded-t-lg">
                              <img
                                src={file.thumbnail || file.url}
                                alt={file.alt || file.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              {file.optimized && (
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-green-500 text-white text-xs">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Optimized
                                  </Badge>
                                </div>
                              )}
                              {selectedFiles.includes(file.id) && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleFileSelect(file)
                                    }}
                                    className="bg-white/90 hover:bg-white"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEditingFile(file)
                                    }}
                                    className="bg-white/90 hover:bg-white"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative">
                              {getFileIcon(file.type)}
                              {selectedFiles.includes(file.id) && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-3">
                            <h4 className="font-medium text-sm truncate text-gray-900">{file.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">
                              {formatFileSize(file.size)}
                              {file.dimensions && ` • ${file.dimensions.width}×${file.dimensions.height}`}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {file.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            {file.type === "image" ? (
                              <img
                                src={file.thumbnail || file.url}
                                alt={file.alt || file.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              getFileIcon(file.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate text-gray-900">{file.name}</h4>
                              {file.optimized && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Optimized
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                              {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                              {file.dimensions && ` • ${file.dimensions.width}×${file.dimensions.height}`}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {file.tags.slice(0, 4).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleFileSelect(file)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingFile(file)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleFileDelete(file.id)
                              }}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
                onKeyDown={(e) => e.key === "Enter" && createFolder()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewFolder(false)}>
                Cancel
              </Button>
              <Button onClick={createFolder} disabled={!newFolderName.trim()}>
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
