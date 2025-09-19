"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Users,
  Hash,
  DollarSign,
  Calendar
} from "lucide-react"

interface Organization {
  id: string
  name: string
  type: 'business' | 'nonprofit'
  email: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastActive: string
  nmbrCount: number
  revenue: number
  stories: number
  members: number
}

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Ethiopian Coffee Co.',
    type: 'business',
    email: 'contact@ethiopiancoffee.com',
    status: 'active',
    createdAt: '2024-01-15',
    lastActive: '2024-01-20',
    nmbrCount: 12,
    revenue: 2450,
    stories: 8,
    members: 3
  },
  {
    id: '2',
    name: 'Clean Water Foundation',
    type: 'nonprofit',
    email: 'info@cleanwater.org',
    status: 'active',
    createdAt: '2024-01-10',
    lastActive: '2024-01-19',
    nmbrCount: 15,
    revenue: 0,
    stories: 12,
    members: 5
  },
  {
    id: '3',
    name: 'Sustainable Fashion Co.',
    type: 'business',
    email: 'hello@sustainablefashion.com',
    status: 'active',
    createdAt: '2024-01-12',
    lastActive: '2024-01-18',
    nmbrCount: 8,
    revenue: 1890,
    stories: 5,
    members: 2
  },
  {
    id: '4',
    name: 'Local Food Bank',
    type: 'nonprofit',
    email: 'info@localfoodbank.org',
    status: 'inactive',
    createdAt: '2024-01-05',
    lastActive: '2024-01-15',
    nmbrCount: 6,
    revenue: 0,
    stories: 4,
    members: 8
  },
  {
    id: '5',
    name: 'Tech Startup Inc.',
    type: 'business',
    email: 'hello@techstartup.com',
    status: 'suspended',
    createdAt: '2024-01-08',
    lastActive: '2024-01-12',
    nmbrCount: 3,
    revenue: 0,
    stories: 2,
    members: 1
  }
]

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    business: 0,
    nonprofit: 0
  })

  useEffect(() => {
    fetchOrganizations()
  }, [searchTerm, filterType, filterStatus])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/organizations?search=${searchTerm}&type=${filterType}&status=${filterStatus}`)
      const data = await response.json()
      setOrganizations(data.organizations)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrganizationAction = async (action: string, orgId: string) => {
    try {
      const response = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data: { id: orgId } })
      })
      
      if (response.ok) {
        await fetchOrganizations() // Refresh data
      }
    } catch (error) {
      console.error(`Failed to ${action} organization:`, error)
    }
  }

  const filteredOrganizations = organizations

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
            <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
            <p className="text-muted-foreground">Manage all organizations on the platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => window.open('/admin/organizations/new', '_blank')}>
              <Building2 className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Businesses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.business}</div>
              <p className="text-xs text-muted-foreground">
                Business organizations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nonprofits</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nonprofit}</div>
              <p className="text-xs text-muted-foreground">
                Nonprofit organizations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${organizations.reduce((sum, org) => sum + org.revenue, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">From business organizations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Management</CardTitle>
            <CardDescription>
              Search and filter organizations by type, status, and other criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
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

            {/* Organizations Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">NMBRs</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Members</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrganizations.map((org) => (
                    <tr key={org.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-foreground">{org.name}</div>
                          <div className="text-sm text-muted-foreground">{org.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getTypeColor(org.type)}>
                          {org.type === 'business' ? 'Business' : 'Nonprofit'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(org.status)}>
                          {org.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{org.nmbrCount}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          ${org.revenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{org.members}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/admin/organizations/${org.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/admin/organizations/${org.id}/edit`, '_blank')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              if (org.status === 'active') {
                                handleOrganizationAction('suspend', org.id)
                              } else {
                                handleOrganizationAction('activate', org.id)
                              }
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

            {filteredOrganizations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No organizations found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
