"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, LogOut } from "lucide-react"
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
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Demo', href: '/demo' },
    { name: 'Help', href: '/dashboard/help' },
  ]

  const authNavigation = user ? [
    { name: 'Dashboard', href: '/dashboard' },
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

        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold text-gray-900">NMBR</span>
              </Link>

              {/* Auth Actions */}
              {showAuth && (
                <div className="flex items-center space-x-4">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-700">
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

      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NMBR</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-cyan-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search */}
            {showSearch && (
              <div className="hidden md:block flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </form>
              </div>
            )}

            {/* Desktop Auth */}
            {showAuth && (
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
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
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 hover:text-cyan-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {showSearch && (
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </form>
                )}

                {showAuth && (
                  <div className="pt-4 border-t border-gray-200">
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-700">
                          {user.name || 'User'}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="w-full"
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
                          <Link href="/signup">Get Started</Link>
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
