'use client'

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Image, 
  Video, 
  File, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Trash2, 
  Copy, 
  Download,
  Plus,
  X,
  Check
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  size: number
  uploadedAt: string
  alt?: string
  caption?: string
  tags: string[]
}

interface MediaUploadProps {
  onSelect?: (file: MediaFile) => void
  onUpload?: (files: File[]) => void
  organizationId: string
}

export function MediaUpload({ onSelect, onUpload, organizationId }: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Mock data - in real app this would come from API
  const mockFiles: MediaFile[] = [
    {
      id: '1',
      name: 'water-well-village.jpg',
      type: 'image',
      url: '/water-well-village.jpg',
      thumbnail: '/water-well-village.jpg',
      size: 245760,
      uploadedAt: '2024-01-15T10:30:00Z',
      alt: 'Village water well project',
      caption: 'Clean water access for 500 families',
      tags: ['water', 'village', 'well', 'impact']
    },
    {
      id: '2',
      name: 'school-children-books.jpg',
      type: 'image',
      url: '/school-children-books.jpg',
      thumbnail: '/school-children-books.jpg',
      size: 189440,
      uploadedAt: '2024-01-14T14:20:00Z',
      alt: 'Children with school supplies',
      caption: 'Education materials for 200 children',
      tags: ['education', 'children', 'books', 'school']
    },
    {
      id: '3',
      name: 'medical-equipment-clinic.jpg',
      type: 'image',
      url: '/medical-equipment-clinic.jpg',
      thumbnail: '/medical-equipment-clinic.jpg',
      size: 312000,
      uploadedAt: '2024-01-13T09:15:00Z',
      alt: 'Medical equipment in clinic',
      caption: 'Life-saving medical supplies',
      tags: ['medical', 'equipment', 'clinic', 'health']
    }
  ]

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockFiles)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) return

    setUploading(true)
    try {
      // In a real app, this would upload to your storage service
      const uploadedFiles: MediaFile[] = selectedFiles.map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        tags: []
      }))

      setMediaFiles(prev => [...uploadedFiles, ...prev])
      onUpload?.(selectedFiles)
      
      toast({
        title: "Success!",
        description: `${selectedFiles.length} file(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (file: MediaFile) => {
    onSelect?.(file)
  }

  const handleFileDelete = (fileId: string) => {
    setMediaFiles(prev => prev.filter(f => f.id !== fileId))
    setSelectedFiles(prev => prev.filter(id => id !== fileId))
  }

  const handleBulkDelete = () => {
    setMediaFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)))
    setSelectedFiles([])
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterType === 'all' || file.type === filterType
    return matchesSearch && matchesFilter
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Media Library</h2>
            <p className="text-sm text-gray-600">Upload and manage images, videos, and documents</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 border border-gray-200 rounded">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedFiles.length} file(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedFiles([])}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid/List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => {
                  if (selectedFiles.includes(file.id)) {
                    setSelectedFiles(prev => prev.filter(id => id !== file.id))
                  } else {
                    setSelectedFiles(prev => [...prev, file.id])
                  }
                }}
              >
                <CardContent className="p-0">
                  {viewMode === 'grid' ? (
                    <div className="relative">
                      {file.type === 'image' ? (
                        <div className="aspect-square relative">
                          <img
                            src={file.thumbnail || file.url}
                            alt={file.alt || file.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                          {selectedFiles.includes(file.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                          {file.type === 'video' ? (
                            <Video className="w-8 h-8 text-gray-400" />
                          ) : (
                            <File className="w-8 h-8 text-gray-400" />
                          )}
                          {selectedFiles.includes(file.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-medium text-sm truncate">{file.name}</h4>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {file.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-3">
                        {file.type === 'image' ? (
                          <img
                            src={file.thumbnail || file.url}
                            alt={file.alt || file.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : file.type === 'video' ? (
                          <Video className="w-6 h-6 text-gray-400" />
                        ) : (
                          <File className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{file.name}</h4>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {file.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileSelect(file)
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileDelete(file.id)
                          }}
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
  )
}
