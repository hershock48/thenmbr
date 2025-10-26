"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Shield, 
  Mail, 
  Lock, 
  CheckCircle
} from "lucide-react"

const ADMIN_EMAILS = [
  'admin@thenmbr.com',
  'kevin@thenmbr.com',
  'kevin@beanumber.org',
  'support@thenmbr.com'
]

const ADMIN_ROLES = {
  'admin@thenmbr.com': 'super_admin',
  'kevin@thenmbr.com': 'super_admin',
  'kevin@beanumber.org': 'super_admin',
  'support@thenmbr.com': 'admin'
}

const ADMIN_PASSWORDS = {
  'admin@thenmbr.com': 'admin123',
  'kevin@thenmbr.com': 'kevin123',
  'kevin@beanumber.org': 'K84335225h!?!?',
  'support@thenmbr.com': 'support123'
}

export default function AdminAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate authentication check
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        setError('Access denied. This email is not authorized for admin access.')
        return
      }

      // Check password for specific admin emails
      const expectedPassword = ADMIN_PASSWORDS[email.toLowerCase() as keyof typeof ADMIN_PASSWORDS]
      if (expectedPassword && password !== expectedPassword) {
        setError('Invalid password for this admin account.')
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.')
        return
      }

      // Store admin session
      const adminSession = {
        email: email.toLowerCase(),
        role: ADMIN_ROLES[email.toLowerCase() as keyof typeof ADMIN_ROLES],
        loginTime: new Date().toISOString(),
        permissions: getPermissions(ADMIN_ROLES[email.toLowerCase() as keyof typeof ADMIN_ROLES])
      }

      localStorage.setItem('admin_session', JSON.stringify(adminSession))
      setSuccess(true)
      
      // Redirect to admin dashboard
      setTimeout(() => {
        window.location.href = '/admin'
      }, 1500)

    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPermissions = (role: string) => {
    switch (role) {
      case 'super_admin':
        return ['all']
      case 'admin':
        return ['view', 'edit', 'manage_users', 'manage_organizations']
      case 'moderator':
        return ['view', 'moderate_content']
      case 'viewer':
        return ['view']
      default:
        return []
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-3xl font-bold text-foreground">Access Granted</h1>
              <p className="text-muted-foreground">
                Redirecting to admin dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@thenmbr.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Authorized Admin Emails:</p>
              <ul className="space-y-1">
                {ADMIN_EMAILS.map((adminEmail) => (
                  <li key={adminEmail} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {adminEmail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
