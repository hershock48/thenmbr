"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  Heart,
  Users,
  TrendingUp,
  MoreHorizontal,
  User,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  Heart as HeartIcon,
  Users as UsersIcon,
  TrendingUp as TrendingUpIcon,
  Star,
  Gift,
  Target,
  BarChart3
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

interface Donor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  totalDonated: number
  donationCount: number
  averageDonation: number
  lastDonation: string
  firstDonation: string
  status: "active" | "inactive" | "unsubscribed"
  preferredContact: "email" | "phone" | "mail"
  notes?: string
  tags: string[]
  storiesSupported: string[]
  engagementScore: number
}

export default function DonorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [showDonorDetails, setShowDonorDetails] = useState(false)
  const [donors, setDonors] = useState<Donor[]>([])

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = 
      donor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || donor.status === statusFilter
    
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.firstDonation).getTime() - new Date(a.firstDonation).getTime()
      case "oldest":
        return new Date(a.firstDonation).getTime() - new Date(b.firstDonation).getTime()
      case "highest-amount":
        return b.totalDonated - a.totalDonated
      case "most-donations":
        return b.donationCount - a.donationCount
      case "name":
        return a.firstName.localeCompare(b.firstName)
      default:
        return 0
    }
  })

  const totalDonors = donors.length
  const totalDonated = donors.reduce((sum, donor) => sum + donor.totalDonated, 0)
  const averageDonation = totalDonors > 0 ? totalDonated / totalDonors : 0
  const activeDonors = donors.filter(donor => donor.status === "active").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-yellow-100 text-yellow-800"
      case "unsubscribed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { level: "High", color: "text-green-600" }
    if (score >= 60) return { level: "Medium", color: "text-yellow-600" }
    return { level: "Low", color: "text-red-600" }
  }

  const handleCreateDonor = async (formData: FormData) => {
    try {
      const newDonor: Donor = {
        id: `donor-${Date.now()}`,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || undefined,
        address: formData.get('address') as string || undefined,
        city: formData.get('city') as string || undefined,
        state: formData.get('state') as string || undefined,
        zipCode: formData.get('zipCode') as string || undefined,
        totalDonated: 0,
        donationCount: 0,
        averageDonation: 0,
        lastDonation: '',
        firstDonation: new Date().toISOString().split('T')[0],
        status: 'active',
        preferredContact: (formData.get('preferredContact') as any) || 'email',
        notes: formData.get('notes') as string || undefined,
        tags: [],
        storiesSupported: [],
        engagementScore: 0
      }

      setDonors(prev => [newDonor, ...prev])
      setShowCreateDialog(false)
      
      // Reset form
      const form = document.getElementById('create-donor-form') as HTMLFormElement
      if (form) form.reset()
      
    } catch (error) {
      console.error('Error creating donor:', error)
      alert('Failed to create donor. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <Target className="w-4 h-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">Donors</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donor Management</h1>
          <p className="text-muted-foreground text-lg">Manage your donor relationships and track engagement</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Donor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Donor</DialogTitle>
              <DialogDescription>
                Add a new donor to your database and start building relationships
              </DialogDescription>
            </DialogHeader>
            <form id="create-donor-form" action={handleCreateDonor} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredContact">Preferred Contact</Label>
                  <Select name="preferredContact">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="mail">Mail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="10001"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional notes about this donor..."
                  className="min-h-24"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Donor
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                <p className="text-2xl font-bold text-foreground">{totalDonors}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
                <p className="text-2xl font-bold text-foreground">{activeDonors}</p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donated</p>
                <p className="text-2xl font-bold text-foreground">${totalDonated.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Donation</p>
                <p className="text-2xl font-bold text-foreground">${averageDonation.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search donors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest-amount">Highest Amount</SelectItem>
                <SelectItem value="most-donations">Most Donations</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Donors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor) => (
          <Card key={donor.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {donor.firstName} {donor.lastName}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {donor.email}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(donor.status)}>
                    {donor.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedDonor(donor)
                        setShowDonorDetails(true)
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Donor
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  {donor.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{donor.phone}</span>
                    </div>
                  )}
                  {donor.city && donor.state && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{donor.city}, {donor.state}</span>
                    </div>
                  )}
                </div>

                {/* Donation Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-foreground">${donor.totalDonated.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Donated</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-foreground">{donor.donationCount}</div>
                    <div className="text-xs text-muted-foreground">Donations</div>
                  </div>
                </div>

                {/* Engagement Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Engagement</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${getEngagementLevel(donor.engagementScore).color}`}>
                      {getEngagementLevel(donor.engagementScore).level}
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${donor.engagementScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Last Donation */}
                {donor.lastDonation && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last donation: {new Date(donor.lastDonation).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {searchTerm || statusFilter !== "all" 
                    ? "No donors found"
                    : "No donors yet"
                  }
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters to find donors."
                    : "Start building your donor database by adding donors manually or importing from your existing systems."
                  }
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && (
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Donor
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <p>Build meaningful relationships with your supporters</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donor Details Dialog */}
      <Dialog open={showDonorDetails} onOpenChange={setShowDonorDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedDonor?.firstName} {selectedDonor?.lastName}
            </DialogTitle>
            <DialogDescription>
              Donor profile and engagement history
            </DialogDescription>
          </DialogHeader>
          
          {selectedDonor && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-foreground">{selectedDonor.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-foreground">{selectedDonor.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                      <p className="text-foreground">
                        {selectedDonor.address ? 
                          `${selectedDonor.address}, ${selectedDonor.city}, ${selectedDonor.state} ${selectedDonor.zipCode}` :
                          'Not provided'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Preferred Contact</Label>
                      <p className="text-foreground capitalize">{selectedDonor.preferredContact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Donation History */}
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">${selectedDonor.totalDonated.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Donated</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{selectedDonor.donationCount}</div>
                      <div className="text-sm text-muted-foreground">Total Donations</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">${selectedDonor.averageDonation.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Average Donation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Engagement Score</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${getEngagementLevel(selectedDonor.engagementScore).color}`}>
                          {selectedDonor.engagementScore}/100
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full"
                            style={{ width: `${selectedDonor.engagementScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">First Donation:</span>
                        <span className="ml-2 font-medium">
                          {selectedDonor.firstDonation ? new Date(selectedDonor.firstDonation).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Donation:</span>
                        <span className="ml-2 font-medium">
                          {selectedDonor.lastDonation ? new Date(selectedDonor.lastDonation).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedDonor.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{selectedDonor.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
