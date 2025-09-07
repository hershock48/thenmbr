"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Heart, Users, Target, Gift, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Confetti } from "@/components/ui/confetti"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationWebsite: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isCheckingConfirmation, setIsCheckingConfirmation] = useState(false)
  const [showExistingAccountMessage, setShowExistingAccountMessage] = useState(false)

  const checkEmailConfirmation = async () => {
    setIsCheckingConfirmation(true)
    try {
      // Try to sign in to see if email is confirmed
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // Email not confirmed yet
          console.log('Email not confirmed yet')
        } else {
          throw error
        }
      } else if (data.user && data.session) {
        // Email confirmed! Redirect to dashboard
        console.log('Email confirmed! Redirecting to dashboard...')
        router.push('/dashboard')
        return
      }
    } catch (err) {
      console.error('Error checking confirmation:', err)
    } finally {
      setIsCheckingConfirmation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Form submitted with data:', formData)
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    let formattedWebsite = formData.organizationWebsite
    if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
      formattedWebsite = `https://${formattedWebsite}`
    }

    console.log('Calling signUp with:', {
      email: formData.email,
      password: formData.password,
      orgName: formData.organizationName,
      website: formattedWebsite
    })

    try {
      await signUp(formData.email, formData.password, formData.organizationName, formattedWebsite)
      console.log('SignUp completed successfully')
      setShowSuccess(true)
      // Don't auto-redirect, let user check email confirmation manually
    } catch (err: any) {
      console.error('Signup error:', err)
      
      // Check for specific error types
      if (err.message?.includes('User already registered') || 
          err.message?.includes('already registered') ||
          err.message?.includes('email address is already registered')) {
        setShowExistingAccountMessage(true)
        setError('')
      } else if (err.message?.includes('Password should be at least')) {
        setError('Password must be at least 6 characters long.')
      } else if (err.message?.includes('Invalid email')) {
        setError('Please enter a valid email address.')
      } else {
        setError('Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Confetti active={true} />
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email!</h2>
            <p className="text-muted-foreground mb-6">
              We've sent you a confirmation link. Please check your email and click the link to activate your account.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={checkEmailConfirmation}
                disabled={isCheckingConfirmation}
                className="w-full"
              >
                {isCheckingConfirmation ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Checking...</span>
                  </>
                ) : (
                  "I've Confirmed My Email - Continue"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Click the button above after you've clicked the confirmation link in your email.
              </p>
              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Or go to login page
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showExistingAccountMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Account Already Exists</h2>
            <p className="text-muted-foreground mb-6">
              An account with <strong>{formData.email}</strong> already exists. 
              Please log in instead of creating a new account.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowExistingAccountMessage(false)
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    organizationName: '',
                    organizationWebsite: ''
                  })
                }}
                className="w-full"
              >
                Try Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">#</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">The NMBR</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Start Your Impact Story</h1>
          <p className="text-muted-foreground">
            Join hundreds of nonprofits transforming fundraising with personalized impact stories
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-white/50 rounded-lg border border-cyan-100">
            <Heart className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Personal Stories</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-lg border border-purple-100">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Easy Setup</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-lg border border-green-100">
            <Gift className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">More Donations</p>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">Create Your Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Get started in minutes and begin creating your first impact story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" method="post" action="">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 h-12 text-base border-2 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    placeholder="your@organization.org"
                  />
                </div>

                <div>
                  <Label htmlFor="orgName" className="text-sm font-medium text-foreground">
                    Organization Name
                  </Label>
                  <Input
                    id="orgName"
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="mt-1 h-12 text-base border-2 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    placeholder="Your Nonprofit Name"
                  />
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-foreground">
                    Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    value={formData.organizationWebsite}
                    onChange={(e) => setFormData({ ...formData, organizationWebsite: e.target.value })}
                    className="mt-1 h-12 text-base border-2 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    placeholder="www.yourorganization.org"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll automatically add https:// if needed
                  </p>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 h-12 text-base border-2 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    placeholder="Create a strong password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-1 h-12 text-base border-2 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create My Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-4">Trusted by amazing organizations worldwide</p>
          <div className="flex justify-center items-center space-x-6 opacity-60">
            <div className="text-sm font-semibold text-cyan-600">WaterAid</div>
            <div className="text-sm font-semibold text-purple-600">UNICEF</div>
            <div className="text-sm font-semibold text-blue-600">Red Cross</div>
          </div>
        </div>
      </div>
    </div>
  )
}
