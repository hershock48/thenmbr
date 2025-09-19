"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, LogOut, Bell } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useSignOut } from "@/hooks/use-signout"
import { SignOutDialog } from "@/components/ui/signout-dialog"

interface GlobalHeaderProps {
  variant?: 'default' | 'minimal' | 'dashboard'
  showSearch?: boolean
  showAuth?: boolean
}

export function GlobalHeader({ 
  variant = 'default', 
  showSearch = true, 
  showAuth = true 
}: GlobalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, org } = useAuth()
  const router = useRouter()
  const { 
    isSigningOut, 
    showConfirmDialog, 
    signOutError, 
    handleSignOut, 
    confirmSignOut, 
    cancelSignOut, 
    setSignOutError 
  } = useSignOut()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Demo', href: '/demo' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const authNavigation = user ? [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'AI Stories', href: '/dashboard/ai-stories' },
    { name: 'Settings', href: '/dashboard/settings' },
  ] : [
    { name: 'Sign In', href: '/login' },
    { name: 'Sign Up', href: '/signup' },
  ]

  if (variant === 'minimal') {
    return (
      <>
        {/* Error Message */}
        {signOutError && (
          <div className="fixed top-4 right-4 z-50 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 max-w-sm">
            <div className="w-4 h-4 text-red-500">⚠️</div>
            <span className="text-red-700 text-sm">{signOutError}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSignOutError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </Button>
          </div>
        )}

        {/* Sign Out Confirmation Dialog */}
        <SignOutDialog
          open={showConfirmDialog}
          onConfirm={confirmSignOut}
          onCancel={cancelSignOut}
          isSigningOut={isSigningOut}
        />

        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">N</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">#</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-foreground">The NMBR</span>
              </Link>

              {/* Auth Actions */}
              {showAuth && (
                <div className="flex items-center space-x-4">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="relative"
                        onClick={() => router.push('/dashboard/notifications')}
                      >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                      </Button>
                      <span className="text-sm text-foreground">
                        {org?.name || 'Organization'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      </>
    )
  }

  return (
    <>
      {/* Error Message */}
      {signOutError && (
        <div className="fixed top-4 right-4 z-50 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 max-w-sm">
          <div className="w-4 h-4 text-red-500">⚠️</div>
          <span className="text-red-700 text-sm">{signOutError}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSignOutError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      )}

      {/* Sign Out Confirmation Dialog */}
      <SignOutDialog
        open={showConfirmDialog}
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
        isSigningOut={isSigningOut}
      />

      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">#</span>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">The NMBR</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            {showAuth && (
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-foreground">
                      {user.name || 'User'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button variant="ghost">Sign In</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Start Free Trial</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border py-4">
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {showAuth && (
                  <div className="pt-4 border-t border-border">
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-foreground mb-3">
                          {user.name || 'User'}
                        </div>
                        <div className="space-y-2">
                          {authNavigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block text-muted-foreground hover:text-foreground transition-colors py-1"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="w-full mt-3"
                        >
                          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="ghost" asChild className="w-full justify-start">
                          <Link href="/login">Sign In</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/signup">Start Free Trial</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
