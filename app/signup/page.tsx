"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Heart, Users, Target, Gift, CheckCircle, Sparkles, Eye, EyeOff } from "lucide-react"
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
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    let strength = 0
    if (minLength) strength += 1
    if (hasUpperCase) strength += 1
    if (hasLowerCase) strength += 1
    if (hasNumbers) strength += 1
    if (hasSpecialChar) strength += 1
    
    return { isValid: minLength, strength }
  }

  const validateWebsite = (website: string) => {
    if (!website) return true // Optional field
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    return urlRegex.test(website)
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.organizationName) {
      errors.organizationName = 'Organization name is required'
    } else if (formData.organizationName.length < 2) {
      errors.organizationName = 'Organization name must be at least 2 characters'
    }
    
    if (formData.organizationWebsite && !validateWebsite(formData.organizationWebsite)) {
      errors.organizationWebsite = 'Please enter a valid website URL'
    }
    
    const passwordValidation = validatePassword(formData.password)
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (!passwordValidation.isValid) {
      errors.password = 'Password must be at least 6 characters long'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' })
    }
    
    // Update password strength
    if (field === 'password') {
      const validation = validatePassword(value)
      setPasswordStrength(validation.strength)
    }
  }

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
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the errors below')
      return
    }
    
    setLoading(true)
    setError('')

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
              <div className="text-center space-y-2">
                <Link 
                  href="/login" 
                  className="text-sm text-blue-600 hover:text-blue-800 underline block"
                >
                  Or go to login page
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowSuccess(false)
                    setFormData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      organizationName: '',
                      organizationWebsite: ''
                    })
                    setFormErrors({})
                    setPasswordStrength(0)
                  }}
                  className="text-sm"
                >
                  Try Different Email
                </Button>
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
                  setFormErrors({})
                  setPasswordStrength(0)
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
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-foreground">The NMBR</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Start Your Impact Story</h1>
          <p className="text-muted-foreground">
            Join hundreds of nonprofits transforming fundraising with personalized impact stories
          </p>
          <div className="mt-4">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Home
              </Button>
            </Link>
          </div>
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`mt-1 h-12 text-base border-2 focus:ring-cyan-500 ${
                      formErrors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-cyan-500'
                    }`}
                    placeholder="your@organization.org"
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-sm text-red-600 mt-1">
                      {formErrors.email}
                    </p>
                  )}
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
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    className={`mt-1 h-12 text-base border-2 focus:ring-cyan-500 ${
                      formErrors.organizationName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-cyan-500'
                    }`}
                    placeholder="Your Nonprofit Name"
                    aria-describedby={formErrors.organizationName ? 'orgName-error' : undefined}
                  />
                  {formErrors.organizationName && (
                    <p id="orgName-error" className="text-sm text-red-600 mt-1">
                      {formErrors.organizationName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-foreground">
                    Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    value={formData.organizationWebsite}
                    onChange={(e) => handleInputChange('organizationWebsite', e.target.value)}
                    className={`mt-1 h-12 text-base border-2 focus:ring-cyan-500 ${
                      formErrors.organizationWebsite 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-cyan-500'
                    }`}
                    placeholder="www.yourorganization.org"
                    aria-describedby={formErrors.organizationWebsite ? 'website-error' : 'website-help'}
                  />
                  {formErrors.organizationWebsite ? (
                    <p id="website-error" className="text-sm text-red-600 mt-1">
                      {formErrors.organizationWebsite}
                    </p>
                  ) : (
                    <p id="website-help" className="text-xs text-muted-foreground mt-1">
                      We'll automatically add https:// if needed
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`mt-1 h-12 text-base border-2 focus:ring-cyan-500 pr-10 ${
                        formErrors.password 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-cyan-500'
                      }`}
                      placeholder="Create a strong password"
                      aria-describedby={formErrors.password ? 'password-error' : 'password-strength'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.password ? (
                    <p id="password-error" className="text-sm text-red-600 mt-1">
                      {formErrors.password}
                    </p>
                  ) : (
                    <div id="password-strength" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength <= 1 ? 'bg-red-500' :
                              passwordStrength <= 2 ? 'bg-yellow-500' :
                              passwordStrength <= 3 ? 'bg-blue-500' :
                              passwordStrength <= 4 ? 'bg-green-500' : 'bg-green-600'
                            }`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {passwordStrength <= 1 ? 'Weak' :
                           passwordStrength <= 2 ? 'Fair' :
                           passwordStrength <= 3 ? 'Good' :
                           passwordStrength <= 4 ? 'Strong' : 'Very Strong'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`mt-1 h-12 text-base border-2 focus:ring-cyan-500 pr-10 ${
                        formErrors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-cyan-500'
                      }`}
                      placeholder="Confirm your password"
                      aria-describedby={formErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || Object.keys(formErrors).length > 0}
                className="w-full h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
