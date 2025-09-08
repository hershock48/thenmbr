"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
  User,
  Activity
} from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  category: 'auth' | 'api' | 'database' | 'system' | 'user' | 'payment'
  message: string
  user?: string
  organization?: string
  details?: string
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-20T10:30:00Z',
    level: 'info',
    category: 'user',
    message: 'User registration completed',
    user: 'sarah@hopeorg.org',
    organization: 'Hope Organization'
  },
  {
    id: '2',
    timestamp: '2024-01-20T10:25:00Z',
    level: 'success',
    category: 'api',
    message: 'NMBR created successfully',
    user: 'mike@techcorp.com',
    organization: 'Tech Corp',
    details: 'NMBR-001 created for story "Coffee Journey"'
  },
  {
    id: '3',
    timestamp: '2024-01-20T10:20:00Z',
    level: 'warning',
    category: 'system',
    message: 'High memory usage detected',
    details: 'Memory usage at 85% on server-01'
  },
  {
    id: '4',
    timestamp: '2024-01-20T10:15:00Z',
    level: 'error',
    category: 'database',
    message: 'Database connection timeout',
    details: 'Connection to primary database timed out after 30s'
  },
  {
    id: '5',
    timestamp: '2024-01-20T10:10:00Z',
    level: 'info',
    category: 'payment',
    message: 'Subscription payment processed',
    user: 'alex@craftco.com',
    organization: 'Craft Co',
    details: 'Payment of $99.00 for Pro plan'
  },
  {
    id: '6',
    timestamp: '2024-01-20T10:05:00Z',
    level: 'success',
    category: 'auth',
    message: 'User login successful',
    user: 'emma@localfood.org',
    organization: 'Local Food Bank'
  },
  {
    id: '7',
    timestamp: '2024-01-20T10:00:00Z',
    level: 'info',
    category: 'api',
    message: 'Analytics data exported',
    user: 'admin@thenmbr.com',
    details: 'Analytics export completed for date range 2024-01-01 to 2024-01-20'
  },
  {
    id: '8',
    timestamp: '2024-01-20T09:55:00Z',
    level: 'warning',
    category: 'system',
    message: 'Slow query detected',
    details: 'Query on organizations table took 2.5s to execute'
  }
]

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory
    
    return matchesSearch && matchesLevel && matchesCategory
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'success': return 'bg-green-100 text-green-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <X className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth': return 'bg-purple-100 text-purple-800'
      case 'api': return 'bg-blue-100 text-blue-800'
      case 'database': return 'bg-green-100 text-green-800'
      case 'system': return 'bg-orange-100 text-orange-800'
      case 'user': return 'bg-pink-100 text-pink-800'
      case 'payment': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real implementation, fetch from API
    } catch (error) {
      console.error('Failed to refresh logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Logs</h1>
            <p className="text-muted-foreground">Monitor system activity and troubleshoot issues</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <X className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {logs.filter(log => log.level === 'error').length}
              </div>
              <p className="text-xs text-muted-foreground">Critical issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {logs.filter(log => log.level === 'warning').length}
              </div>
              <p className="text-xs text-muted-foreground">Attention needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {logs.filter(log => log.level === 'success').length}
              </div>
              <p className="text-xs text-muted-foreground">Successful operations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Log Entries</CardTitle>
            <CardDescription>Filter and search through system logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logs Table */}
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getLevelColor(log.level)}>
                        {log.level}
                      </Badge>
                      <Badge className={getCategoryColor(log.category)}>
                        {log.category}
                      </Badge>
                    </div>
                    <div className="font-medium text-foreground">{log.message}</div>
                    {log.details && (
                      <div className="text-sm text-muted-foreground mt-1">{log.details}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {log.user && `${log.user} • `}
                      {log.organization && `${log.organization} • `}
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No logs found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
