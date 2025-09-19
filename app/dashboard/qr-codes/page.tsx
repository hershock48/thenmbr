"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Search, Download, RefreshCw, QrCode, MapPin, Globe, Calendar, TrendingUp, Heart, Eye, Users, DollarSign, Plus } from "lucide-react"
import { useOrganization } from "@/contexts/OrganizationContext"

// Start with empty NMBR codes - will populate as users create stories
const nmbrCodes: any[] = []

// Mock analytics data (empty for now)
const searchTrends = [
  { date: "Jan 1", searches: 0, donations: 0 },
  { date: "Jan 2", searches: 0, donations: 0 },
  { date: "Jan 3", searches: 0, donations: 0 },
  { date: "Jan 4", searches: 0, donations: 0 },
  { date: "Jan 5", searches: 0, donations: 0 },
  { date: "Jan 6", searches: 0, donations: 0 },
  { date: "Jan 7", searches: 0, donations: 0 },
]

const deviceData = [
  { name: "Mobile", value: 0, color: "var(--color-chart-1)" },
  { name: "Desktop", value: 0, color: "var(--color-chart-2)" },
  { name: "Tablet", value: 0, color: "var(--color-chart-3)" },
]

const locationData = [
  { country: "No data yet", searches: 0, percentage: 0 },
]

export default function NMBRCodesPage() {
  const { terminology } = useOrganization()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredNMBRCodes = nmbrCodes.filter((nmbr) => {
    const matchesSearch =
      nmbr.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nmbr.story?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || nmbr.status?.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalSearches = nmbrCodes.reduce((sum, nmbr) => sum + (nmbr.searches || 0), 0)
  const totalDonations = nmbrCodes.reduce((sum, nmbr) => sum + (nmbr.donations || 0), 0)
  const totalFunds = nmbrCodes.reduce((sum, nmbr) => sum + (nmbr.funds || 0), 0)
  const conversionRate = totalSearches > 0 ? ((totalDonations / totalSearches) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Code Management</h1>
          <p className="text-muted-foreground">Generate and track QR codes for your {terminology.stories.toLowerCase()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSearches.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">No scans yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{totalDonations}</div>
            <p className="text-xs text-muted-foreground">No donations yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funds Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">${totalFunds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">No funds raised yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {nmbrCodes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            No QR Codes Yet
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            Generate QR codes for your {terminology.stories.toLowerCase()} to track engagement and donations. 
            When donors scan the code, they'll discover your impact story and can contribute directly.
          </p>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-foreground mb-4">How QR Codes Work</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h5 className="font-medium text-foreground mb-1">Create Your Story</h5>
                  <p className="text-sm text-muted-foreground">Write compelling impact stories that connect with donors.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h5 className="font-medium text-foreground mb-1">Generate QR Code</h5>
                  <p className="text-sm text-muted-foreground">Create a unique QR code that links to your story.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h5 className="font-medium text-foreground mb-1">Track & Engage</h5>
                  <p className="text-sm text-muted-foreground">Monitor scans, donations, and donor engagement.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              onClick={() => window.location.href = '/dashboard/nmbrs'}
            >
              <Heart className="w-5 h-5 mr-2" />
              Create Your First Story
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/dashboard/widget'}
            >
              <Eye className="w-5 h-5 mr-2" />
              Set Up Widget
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Trends</CardTitle>
                <CardDescription>Daily scans and donations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={searchTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="searches" stroke="var(--color-primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="donations" stroke="var(--color-secondary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Scans by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                      <span className="text-sm text-muted-foreground">
                        {device.name}: {device.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Scans by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{location.country}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${location.percentage}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        {location.searches} ({location.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR Code Management */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>QR Code Library</CardTitle>
                  <CardDescription>Manage and track your QR codes</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search QR codes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNMBRCodes.map((nmbr) => (
                  <Card key={nmbr.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{nmbr.name}</CardTitle>
                          <CardDescription>{nmbr.story}</CardDescription>
                        </div>
                        <Badge variant={nmbr.status === "Active" ? "default" : "secondary"}>{nmbr.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Scans</span>
                          <p className="font-semibold text-primary">{nmbr.searches?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Donations</span>
                          <p className="font-semibold text-secondary">{nmbr.donations || 0}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Funds Raised</span>
                          <p className="font-semibold text-chart-4">${nmbr.funds?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Scan</span>
                          <p className="font-semibold">{nmbr.lastScan || "Never"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
