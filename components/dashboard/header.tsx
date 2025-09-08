import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, Menu, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSignOut } from "@/hooks/use-signout"
import { SignOutDialog } from "@/components/ui/signout-dialog"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { user, org } = useAuth()
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
      // For now, just show an alert - in real app this would search
      alert(`Searching for: ${searchQuery}`)
      // In real implementation, this would navigate to search results
      // router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
    }
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

      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/60 bg-white/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden hover:bg-cyan-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/95 backdrop-blur-sm px-6 pb-4">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">#</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-transparent opacity-30 rounded-xl"></div>
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">NMBR</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {[
                      { name: "Dashboard", href: "/dashboard" },
                      { name: "NMBRs", href: "/dashboard/nmbrs" },
                      { name: "Subscribers", href: "/dashboard/subscribers" },
                      { name: "Newsletters", href: "/dashboard/newsletters" },
                      { name: "Analytics", href: "/dashboard/analytics" },
                      { name: "Marketplace", href: "/dashboard/marketplace" },
                      { name: "Widget", href: "/dashboard/widget" },
                      { name: "Billing", href: "/dashboard/billing" },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200 text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/80 hover:shadow-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form onSubmit={handleSearch} className="relative flex flex-1 max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400 pl-3" />
          <Input
            placeholder="Search NMBRs, subscribers..."
            className="pl-10 border-0 bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Quick Actions */}
        <Button 
          size="sm" 
          className="hidden sm:flex bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
          onClick={() => router.push('/dashboard/nmbrs')}
        >
          <Plus className="w-4 h-4 mr-2" />
          New NMBR
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500 hover:bg-orange-500 border-2 border-white">
            3
          </Badge>
        </Button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-slate-50">
              <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 shadow-lg border-slate-200" align="end">
            <div className="flex items-center justify-start gap-2 p-3 border-b border-slate-100">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-semibold text-slate-900">{user?.name || 'User'}</p>
                <p className="w-[200px] truncate text-sm text-slate-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <DropdownMenuItem className="hover:bg-slate-50">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">Organization Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">Billing</DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-red-50 text-red-600"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    </>
  )
}
