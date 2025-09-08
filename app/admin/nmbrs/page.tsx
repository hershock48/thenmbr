"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Hash, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Building2,
  Calendar,
  TrendingUp
} from "lucide-react"

interface NMBR {
  id: string
  number: string
  organization: string
  organizationType: 'business' | 'nonprofit'
  story: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastSearched: string
  searchCount: number
  views: number
}

const mockNMBRs: NMBR[] = [
  {
    id: '1',
    number: 'NMBR-001',
    organization: 'Ethiopian Coffee Co.',
    organizationType: 'business',
    story: 'The Journey of Our Coffee Beans',
    status: 'active',
    createdAt: '2024-01-15',
    lastSearched: '2024-01-20',
    searchCount: 45,
    views: 120
  },
  {
    id: '2',
    number: 'NMBR-002',
    organization: 'Clean Water Foundation',
    organizationType: 'nonprofit',
    story: 'Bringing Clean Water to Communities',
    status: 'active',
    createdAt: '2024-01-10',
    lastSearched: '2024-01-19',
    searchCount: 78,
    views: 200
  },
  {
    id: '3',
    number: 'NMBR-003',
    organization: 'Sustainable Fashion Co.',
    organizationType: 'business',
    story: 'Sustainable Fashion Revolution',
    status: 'active',
    createdAt: '2024-01-12',
    lastSearched: '2024-01-18',
    searchCount: 32,
    views: 85
  },
  {
    id: '4',
    number: 'NMBR-004',
    organization: 'Local Food Bank',
    organizationType: 'nonprofit',
    story: 'Fighting Hunger in Our Community',
    status: 'inactive',
    createdAt: '2024-01-05',
    lastSearched: '2024-01-15',
    searchCount: 12,
    views: 30
  },
  {
    id: '5',
    number: 'NMBR-005',
    organization: 'Tech Startup Inc.',
    organizationType: 'business',
    story: 'Innovation in Technology',
    status: 'suspended',
    createdAt: '2024-01-08',
    lastSearched: '2024-01-12',
    searchCount: 5,
    views: 15
  }
]

export default function NMBRsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredNMBRs = mockNMBRs.filter(nmbr => {
    const matchesSearch = nmbr.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nmbr.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nmbr.story.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || nmbr.organizationType === filterType
    const matchesStatus = filterStatus === 'all' || nmbr.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">NMBR Management</h1>
            <p className="text-muted-foreground">Track and manage all NMBRs on the platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => window.open('/admin/nmbrs/new', '_blank')}>
              <Hash className="w-4 h-4 mr-2" />
              Generate NMBR
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total NMBRs</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNMBRs.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockNMBRs.filter(nmbr => nmbr.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockNMBRs.reduce((sum, nmbr) => sum + nmbr.searchCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">All time searches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockNMBRs.reduce((sum, nmbr) => sum + nmbr.views, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Story page views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Searches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockNMBRs.reduce((sum, nmbr) => sum + nmbr.searchCount, 0) / mockNMBRs.length)}
              </div>
              <p className="text-xs text-muted-foreground">Per NMBR</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>NMBR Management</CardTitle>
            <CardDescription>
              Search and filter NMBRs by organization type, status, and other criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search NMBRs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* NMBRs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">NMBR</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Story</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Searches</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNMBRs.map((nmbr) => (
                    <tr key={nmbr.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono font-medium text-foreground">{nmbr.number}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground">{nmbr.organization}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getTypeColor(nmbr.organizationType)}>
                          {nmbr.organizationType === 'business' ? 'Business' : 'Nonprofit'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground max-w-xs truncate">{nmbr.story}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(nmbr.status)}>
                          {nmbr.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{nmbr.searchCount}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{nmbr.views}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(nmbr.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/admin/nmbrs/${nmbr.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/admin/nmbrs/${nmbr.id}/edit`, '_blank')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Toggle NMBR status
                              console.log(`Toggle NMBR ${nmbr.id} status`)
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredNMBRs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No NMBRs found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
