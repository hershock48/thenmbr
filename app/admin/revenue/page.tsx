"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DollarSign, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Building2
} from "lucide-react"

interface RevenueRecord {
  id: string
  organization: string
  organizationType: 'business' | 'nonprofit'
  plan: 'basic' | 'pro' | 'enterprise'
  amount: number
  status: 'paid' | 'pending' | 'failed'
  createdAt: string
  nextBilling: string
  nmbrCount: number
}

const mockRevenue: RevenueRecord[] = [
  {
    id: '1',
    organization: 'Ethiopian Coffee Co.',
    organizationType: 'business',
    plan: 'pro',
    amount: 99,
    status: 'paid',
    createdAt: '2024-01-15',
    nextBilling: '2024-02-15',
    nmbrCount: 12
  },
  {
    id: '2',
    organization: 'Clean Water Foundation',
    organizationType: 'nonprofit',
    plan: 'basic',
    amount: 0,
    status: 'paid',
    createdAt: '2024-01-10',
    nextBilling: '2024-02-10',
    nmbrCount: 15
  },
  {
    id: '3',
    organization: 'Sustainable Fashion Co.',
    organizationType: 'business',
    plan: 'enterprise',
    amount: 299,
    status: 'paid',
    createdAt: '2024-01-12',
    nextBilling: '2024-02-12',
    nmbrCount: 8
  },
  {
    id: '4',
    organization: 'Local Food Bank',
    organizationType: 'nonprofit',
    plan: 'basic',
    amount: 0,
    status: 'paid',
    createdAt: '2024-01-05',
    nextBilling: '2024-02-05',
    nmbrCount: 6
  },
  {
    id: '5',
    organization: 'Tech Startup Inc.',
    organizationType: 'business',
    plan: 'pro',
    amount: 99,
    status: 'pending',
    createdAt: '2024-01-08',
    nextBilling: '2024-02-08',
    nmbrCount: 3
  }
]

export default function RevenuePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredRevenue = mockRevenue.filter(record => {
    const matchesSearch = record.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || record.organizationType === filterType
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalRevenue = mockRevenue.reduce((sum, record) => sum + record.amount, 0)
  const paidRevenue = mockRevenue.filter(r => r.status === 'paid').reduce((sum, record) => sum + record.amount, 0)
  const pendingRevenue = mockRevenue.filter(r => r.status === 'pending').reduce((sum, record) => sum + record.amount, 0)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Revenue Management</h1>
            <p className="text-muted-foreground">Track revenue, subscriptions, and billing</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => window.open('/admin/revenue/report', '_blank')}>
              <DollarSign className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paidRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Confirmed payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockRevenue.filter(r => r.status === 'paid').length}
              </div>
              <p className="text-xs text-muted-foreground">Paid subscriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Records</CardTitle>
            <CardDescription>
              Search and filter revenue records by organization type, status, and other criteria
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Revenue Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">NMBRs</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Billing</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRevenue.map((record) => (
                    <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground">{record.organization}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getTypeColor(record.organizationType)}>
                          {record.organizationType === 'business' ? 'Business' : 'Nonprofit'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPlanColor(record.plan)}>
                          {record.plan}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {record.amount === 0 ? 'Free' : `$${record.amount}`}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{record.nmbrCount}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(record.nextBilling).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/admin/revenue/${record.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`/admin/revenue/${record.id}/edit`, '_blank')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // View payment details
                              console.log(`View payment details for ${record.id}`)
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

            {filteredRevenue.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No revenue records found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
