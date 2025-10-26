"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff } from "lucide-react"

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

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Check email
    if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
      setError('Invalid email or password. Please try again.')
      setIsLoading(false)
      return
    }

    // Check password
    const expectedPassword = ADMIN_PASSWORDS[email.toLowerCase() as keyof typeof ADMIN_PASSWORDS]
    if (expectedPassword && password !== expectedPassword) {
      setError('Invalid email or password. Please try again.')
      setIsLoading(false)
      return
    }

    // Store admin session
    const adminSession = {
      email: email.toLowerCase(),
      role: ADMIN_ROLES[email.toLowerCase() as keyof typeof ADMIN_ROLES],
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem('admin_session', JSON.stringify(adminSession))
    
    // Redirect to admin dashboard
    setTimeout(() => {
      window.location.href = "/admin"
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">NMBR Super Admin</CardTitle>
            <CardDescription>Sign in to access the administrative dashboard</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
              id="email" 
              type="email" 
              placeholder="admin@nmbr.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">Super Admin access only. Unauthorized access is prohibited.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
