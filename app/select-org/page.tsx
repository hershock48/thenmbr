"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Plus, 
  ArrowRight, 
  Users, 
  Target, 
  Heart,
  CheckCircle,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { supabase } from "@/lib/supabase"
import { OrgSelectionTour } from "@/components/ui/org-selection-tour"

interface Organization {
  id: string
  name: string
  website: string
  brand_color: string
  is_active: boolean
  created_at: string
}

export default function SelectOrgPage() {
  const { user, setOrg } = useAuth()
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [showOrgTour, setShowOrgTour] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchUserOrganizations()
  }, [user, router])

  const fetchUserOrganizations = async () => {
    try {
      setLoading(true)
      console.log('Fetching organizations...')
      
      // Get organizations where the user is a member
      // For now, we'll get all organizations and let the user choose
      // In a real app, you'd have a user_organizations table
      const { data, error } = await supabase
        .from('nonprofits')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      console.log('Organizations fetch result:', { data, error })

      if (error) {
        console.error('Error fetching organizations:', error)
        setError('Failed to load organizations')
        return
      }

      console.log('Setting organizations:', data || [])
      
      // If no organizations exist, create a default one for the user
      if (!data || data.length === 0) {
        console.log('No organizations found, creating default organization...')
        const { data: newOrg, error: createError } = await supabase
          .from('nonprofits')
          .insert({
            name: 'My Organization',
            website: null,
            brand_color: '#3B82F6',
            is_active: true
          })
          .select()
          .single()
        
        if (createError) {
          console.error('Error creating default organization:', createError)
          setError('No organizations found and failed to create default')
          return
        }
        
        console.log('Created default organization:', newOrg)
        setOrganizations([newOrg])
      } else {
        setOrganizations(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOrg = async () => {
    if (!selectedOrgId) {
      setError('Please select an organization first')
      return
    }

    console.log('Selected org ID:', selectedOrgId)
    console.log('Available organizations:', organizations)
    
    setLoading(true)
    setError('')
    
    try {
      const selectedOrg = organizations.find(org => org.id === selectedOrgId)
      console.log('Selected org:', selectedOrg)
      
      if (!selectedOrg) {
        throw new Error('Selected organization not found')
      }

      // Update user metadata with selected org_id
      console.log('Updating user metadata with org_id:', selectedOrg.id)
      const { data, error } = await supabase.auth.updateUser({
        data: { org_id: selectedOrg.id }
      })

      if (error) {
        console.error('Error updating user metadata:', error)
        throw error
      }

      console.log('User metadata updated successfully:', data)

      // Set the organization in AuthContext
      setOrg(selectedOrg as any)
      
      // Trigger multi-org achievement if this is not the first org
      try {
        const { useAchievements } = await import('@/components/ui/achievement-system')
        const { updateAchievement } = useAchievements()
        updateAchievement('multi-org', 1)
      } catch (err) {
        console.log('Achievement system not available:', err)
      }
      
      console.log('Redirecting to dashboard...')
      router.push('/dashboard')
    } catch (err) {
      console.error('Error selecting organization:', err)
      setError(`Failed to select organization: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <LoadingSpinner />
            <p className="text-muted-foreground mt-4">Loading your organizations...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Organizations</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchUserOrganizations} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8" data-tour="org-selection-welcome">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Select an organization to continue to your dashboard
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowOrgTour(true)}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Take a Tour</span>
            </Button>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-tour="organizations-grid">
          {organizations.map((org) => (
            <Card 
              key={org.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                selectedOrgId === org.id 
                  ? 'ring-2 ring-cyan-500 border-cyan-200' 
                  : 'hover:border-cyan-200'
              }`}
              onClick={() => setSelectedOrgId(org.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: org.brand_color }}
                  >
                    {org.name.charAt(0)}
                  </div>
                  {selectedOrgId === org.id && (
                    <CheckCircle className="w-6 h-6 text-cyan-500" />
                  )}
                </div>
                <CardTitle className="text-lg">{org.name}</CardTitle>
                <CardDescription className="text-sm">
                  {org.website || 'No website'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created {new Date(org.created_at).toLocaleDateString()}</span>
                  <Badge variant={org.is_active ? "default" : "secondary"}>
                    {org.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Organization Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-dashed border-2 border-cyan-200 hover:border-cyan-300"
            data-tour="create-new-org"
          >
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-cyan-600" />
              </div>
              <CardTitle className="text-lg text-cyan-600">Create New Organization</CardTitle>
              <CardDescription className="text-sm">
                Start a new organization
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-sm text-cyan-600">
                <ArrowRight className="w-4 h-4 mr-1" />
                <span>Get started</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 text-red-500 mr-2">⚠️</div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={handleSelectOrg}
            disabled={!selectedOrgId || loading}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Dashboard
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              // Sign out and go back to login
              supabase.auth.signOut()
              router.push('/login')
            }}
          >
            Sign Out
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't see your organization? Contact support or create a new one.
          </p>
        </div>
      </div>

      {/* Organization Selection Tour */}
      <OrgSelectionTour
        isOpen={showOrgTour}
        onClose={() => setShowOrgTour(false)}
        onComplete={() => setShowOrgTour(false)}
      />
    </div>
  )
}
