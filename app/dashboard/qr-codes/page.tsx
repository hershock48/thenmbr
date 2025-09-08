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
import { Search, Download, RefreshCw, QrCode, MapPin, Globe, Calendar, TrendingUp } from "lucide-react"

// Mock data for QR codes
const qrCodes = [
  {
    id: "QR001",
    name: "Ethiopian Coffee Story",
    product: "Premium Coffee Blend",
    status: "Active",
    scans: 1247,
    conversions: 89,
    revenue: 2340,
    created: "2024-01-15",
    lastScan: "2 hours ago",
  },
  {
    id: "QR002",
    name: "Organic Tea Journey",
    product: "Earl Grey Tea",
    status: "Active",
    scans: 892,
    conversions: 67,
    revenue: 1680,
    created: "2024-01-20",
    lastScan: "5 hours ago",
  },
  {
    id: "QR003",
    name: "Cocoa Farm Impact",
    product: "Dark Chocolate Bar",
    status: "Paused",
    scans: 634,
    conversions: 45,
    revenue: 1125,
    created: "2024-01-25",
    lastScan: "1 day ago",
  },
]

// Mock analytics data
const scanTrends = [
  { date: "Jan 1", scans: 45, conversions: 3 },
  { date: "Jan 2", scans: 67, conversions: 5 },
  { date: "Jan 3", scans: 89, conversions: 7 },
  { date: "Jan 4", scans: 123, conversions: 9 },
  { date: "Jan 5", scans: 156, conversions: 12 },
  { date: "Jan 6", scans: 134, conversions: 10 },
  { date: "Jan 7", scans: 178, conversions: 14 },
]

const deviceData = [
  { name: "Mobile", value: 68, color: "var(--color-chart-1)" },
  { name: "Desktop", value: 24, color: "var(--color-chart-2)" },
  { name: "Tablet", value: 8, color: "var(--color-chart-3)" },
]

const locationData = [
  { country: "United States", scans: 456, percentage: 38 },
  { country: "United Kingdom", scans: 234, percentage: 19 },
  { country: "Canada", scans: 189, percentage: 16 },
  { country: "Australia", scans: 167, percentage: 14 },
  { country: "Germany", scans: 123, percentage: 10 },
  { country: "Others", scans: 45, percentage: 3 },
]

export default function QRCodesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const filteredQRCodes = qrCodes.filter((qr) => {
    const matchesSearch =
      qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || qr.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans, 0)
  const totalConversions = qrCodes.reduce((sum, qr) => sum + qr.conversions, 0)
  const totalRevenue = qrCodes.reduce((sum, qr) => sum + qr.revenue, 0)
  const conversionRate = totalScans > 0 ? ((totalConversions / totalScans) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Code Management</h1>
          <p className="text-muted-foreground">Track and manage your QR code performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <QrCode className="h-4 w-4 mr-2" />
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
            <div className="text-2xl font-bold text-primary">{totalScans.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scan Trends</CardTitle>
            <CardDescription>Daily scans and conversions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scanTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke="var(--color-primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="var(--color-secondary)" strokeWidth={2} />
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
                    {location.scans} ({location.percentage}%)
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
            {filteredQRCodes.map((qr) => (
              <Card key={qr.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{qr.name}</CardTitle>
                      <CardDescription>{qr.product}</CardDescription>
                    </div>
                    <Badge variant={qr.status === "Active" ? "default" : "secondary"}>{qr.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Scans</span>
                      <p className="font-semibold text-primary">{qr.scans.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conversions</span>
                      <p className="font-semibold text-secondary">{qr.conversions}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue</span>
                      <p className="font-semibold text-chart-4">${qr.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Scan</span>
                      <p className="font-semibold">{qr.lastScan}</p>
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
    </div>
  )
}
