"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Building2, 
  Plus, 
  ArrowRight, 
  Users, 
  Target, 
  Heart,
  CheckCircle,
  Sparkles,
  Globe,
  Calendar,
  Shield,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/patterns/loading-states"
import { supabase } from "@/lib/supabase"

interface Organization {
  id: string
  name: string
  website: string
  brand_color: string
  is_active: boolean
  created_at: string
  description?: string
  location?: string
  impact_focus?: string
}

export default function SelectOrgPage() {
  const { user, setOrg } = useAuth()
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [showCreateOrg, setShowCreateOrg] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgWebsite, setNewOrgWebsite] = useState('')
  const [newOrgColor, setNewOrgColor] = useState('#3B82F6')
  const [newOrgDescription, setNewOrgDescription] = useState('')
  const [newOrgLocation, setNewOrgLocation] = useState('')
  const [newOrgImpactFocus, setNewOrgImpactFocus] = useState('')
  const [creatingOrg, setCreatingOrg] = useState(false)

  useEffect(() => {
    if (user) {
      fetchOrganizations()
    }
  }, [user])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('nonprofits')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrganizations(data || [])
    } catch (err) {
      console.error('Error fetching organizations:', err)
      setError('Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDefaultOrg = async () => {
    try {
      setCreatingOrg(true)
      const { data: newOrg, error: createError } = await supabase
        .from('nonprofits')
        .insert({
          name: 'My Organization',
          website: '',
          brand_color: '#3B82F6',
          is_active: true,
          description: 'A nonprofit organization making a difference',
          location: '',
          impact_focus: 'Community Development'
        })
        .select()
        .single()

      if (createError) throw createError

      // Set as current org and redirect
      const nonprofitOrg = {
        id: newOrg.id,
        name: newOrg.name,
        organization_type: 'nonprofit' as const,
        industry: undefined,
        ein_number: undefined,
        mission_statement: newOrg.description,
        fiscal_sponsor: undefined,
        business_registration: undefined,
        csr_focus_areas: undefined,
        logo_url: undefined,
        website: newOrg.website,
        brand_color: newOrg.brand_color,
        created_at: newOrg.created_at,
        updated_at: newOrg.created_at
      }
      setOrg(nonprofitOrg)
      router.push('/dashboard')
    } catch (err) {
      console.error('Error creating organization:', err)
      setError('Failed to create organization')
    } finally {
      setCreatingOrg(false)
    }
  }

  const handleCreateCustomOrg = async () => {
    if (!newOrgName.trim()) return

    try {
      setCreatingOrg(true)
      const { data: newOrg, error: createError } = await supabase
        .from('nonprofits')
        .insert({
          name: newOrgName.trim(),
          website: newOrgWebsite.trim(),
          brand_color: newOrgColor,
          is_active: true,
          description: newOrgDescription.trim(),
          location: newOrgLocation.trim(),
          impact_focus: newOrgImpactFocus.trim()
        })
        .select()
        .single()

      if (createError) throw createError

      // Set as current org and redirect
      const nonprofitOrg = {
        id: newOrg.id,
        name: newOrg.name,
        organization_type: 'nonprofit' as const,
        industry: undefined,
        ein_number: undefined,
        mission_statement: newOrg.description,
        fiscal_sponsor: undefined,
        business_registration: undefined,
        csr_focus_areas: undefined,
        logo_url: undefined,
        website: newOrg.website,
        brand_color: newOrg.brand_color,
        created_at: newOrg.created_at,
        updated_at: newOrg.created_at
      }
      setOrg(nonprofitOrg)
      router.push('/dashboard')
    } catch (err) {
      console.error('Error creating organization:', err)
      setError('Failed to create organization')
    } finally {
      setCreatingOrg(false)
    }
  }

  const handleSelectOrg = async (org: Organization) => {
    try {
      setSelectedOrgId(org.id)
      
      // Convert Organization to Nonprofit format
      const nonprofitOrg = {
        id: org.id,
        name: org.name,
        organization_type: 'nonprofit' as const,
        industry: undefined,
        ein_number: undefined,
        mission_statement: org.description,
        fiscal_sponsor: undefined,
        business_registration: undefined,
        csr_focus_areas: undefined,
        logo_url: undefined,
        website: org.website,
        brand_color: org.brand_color,
        created_at: org.created_at,
        updated_at: org.created_at
      }
      setOrg(nonprofitOrg)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Error selecting organization:', err)
      setError('Failed to select organization')
    }
  }

  const getImpactIcon = (focus: string) => {
    switch (focus?.toLowerCase()) {
      case 'education':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'healthcare':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'environment':
        return <Globe className="h-4 w-4 text-green-500" />
      case 'community development':
        return <Building2 className="h-4 w-4 text-purple-500" />
      default:
        return <Target className="h-4 w-4 text-orange-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Loading your organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Select Your Organization</h1>
            <p className="text-muted-foreground mt-2">
              Choose which nonprofit organization you'd like to work with
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {organizations.length === 0 ? (
          /* No Organizations - Create First One */
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Welcome to NMBR! 🎉</CardTitle>
                <CardDescription className="text-lg">
                  You're just one step away from creating your first impact story. 
                  Let's set up your nonprofit organization to start connecting with donors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleCreateDefaultOrg}
                    disabled={creatingOrg}
                    className="h-24 flex-col gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="h-6 w-6" />
                    <span className="font-semibold">Get Started Now</span>
                    <span className="text-sm opacity-80">Ready in 30 seconds</span>
                  </Button>
                  
                  <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-24 flex-col gap-2">
                        <Plus className="h-6 w-6" />
                        <span className="font-semibold">Custom Setup</span>
                        <span className="text-sm opacity-80">Configure details</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Organization</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="orgName">Organization Name *</Label>
                          <Input
                            id="orgName"
                            placeholder="e.g., Hope Foundation"
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="orgWebsite">Website</Label>
                          <Input
                            id="orgWebsite"
                            placeholder="https://your-org.org"
                            value={newOrgWebsite}
                            onChange={(e) => setNewOrgWebsite(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="orgDescription">Mission Statement</Label>
                          <Input
                            id="orgDescription"
                            placeholder="Brief description of your mission"
                            value={newOrgDescription}
                            onChange={(e) => setNewOrgDescription(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="orgLocation">Location</Label>
                          <Input
                            id="orgLocation"
                            placeholder="e.g., San Francisco, CA"
                            value={newOrgLocation}
                            onChange={(e) => setNewOrgLocation(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="orgImpactFocus">Impact Focus</Label>
                          <Input
                            id="orgImpactFocus"
                            placeholder="e.g., Education, Healthcare, Community Development"
                            value={newOrgImpactFocus}
                            onChange={(e) => setNewOrgImpactFocus(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="orgColor">Brand Color</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="orgColor"
                              type="color"
                              value={newOrgColor}
                              onChange={(e) => setNewOrgColor(e.target.value)}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={newOrgColor}
                              onChange={(e) => setNewOrgColor(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={handleCreateCustomOrg}
                            disabled={creatingOrg || !newOrgName.trim()}
                            className="flex-1"
                          >
                            {creatingOrg ? (
                              <>
                                <LoadingSpinner className="mr-2" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Create Organization
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCreateOrg(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Don't worry, you can always update these details later in your organization settings.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Existing Organizations */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Your Organizations</h2>
              <p className="text-muted-foreground">
                Select an organization to continue, or create a new one
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {organizations.map((org) => (
                <Card
                  key={org.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedOrgId === org.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectOrg(org)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: org.brand_color }}
                          >
                            {org.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{org.name}</h3>
                            {org.website && (
                              <p className="text-sm text-muted-foreground">{org.website}</p>
                            )}
                          </div>
                        </div>
                        {selectedOrgId === org.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      {org.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {org.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        {org.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>{org.location}</span>
                          </div>
                        )}
                        {org.impact_focus && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            {getImpactIcon(org.impact_focus)}
                            <span>{org.impact_focus}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created {new Date(org.created_at).toLocaleDateString()}</span>
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Create New Organization Card */}
              <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer transition-all hover:shadow-lg border-dashed border-2">
                    <CardContent className="p-6 flex items-center justify-center h-full min-h-[200px]">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
                          <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Create New Organization</h3>
                          <p className="text-sm text-muted-foreground">Add another nonprofit</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Organization</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newOrgName">Organization Name *</Label>
                      <Input
                        id="newOrgName"
                        placeholder="e.g., Hope Foundation"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newOrgWebsite">Website</Label>
                      <Input
                        id="newOrgWebsite"
                        placeholder="https://your-org.org"
                        value={newOrgWebsite}
                        onChange={(e) => setNewOrgWebsite(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newOrgDescription">Mission Statement</Label>
                      <Input
                        id="newOrgDescription"
                        placeholder="Brief description of your mission"
                        value={newOrgDescription}
                        onChange={(e) => setNewOrgDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newOrgLocation">Location</Label>
                      <Input
                        id="newOrgLocation"
                        placeholder="e.g., San Francisco, CA"
                        value={newOrgLocation}
                        onChange={(e) => setNewOrgLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newOrgImpactFocus">Impact Focus</Label>
                      <Input
                        id="newOrgImpactFocus"
                        placeholder="e.g., Education, Healthcare, Community Development"
                        value={newOrgImpactFocus}
                        onChange={(e) => setNewOrgImpactFocus(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newOrgColor">Brand Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="newOrgColor"
                          type="color"
                          value={newOrgColor}
                          onChange={(e) => setNewOrgColor(e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={newOrgColor}
                          onChange={(e) => setNewOrgColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCreateCustomOrg}
                        disabled={creatingOrg || !newOrgName.trim()}
                        className="flex-1"
                      >
                        {creatingOrg ? (
                          <>
                            <LoadingSpinner className="mr-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Create Organization
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateOrg(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {selectedOrgId && (
              <div className="text-center">
                <Button
                  onClick={() => {
                    const selectedOrg = organizations.find(org => org.id === selectedOrgId)
                    if (selectedOrg) handleSelectOrg(selectedOrg)
                  }}
                  size="lg"
                  className="px-8"
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}