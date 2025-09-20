"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, Menu, Plus, Settings, CreditCard, Building2, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { user, org, signOut } = useAuth()
  const { terminology, orgType } = useOrganization()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleNewItem = () => {
    switch (orgType) {
      case "nonprofit":
        router.push("/dashboard/stories/create")
        break
      case "grassroots":
        router.push("/dashboard/stories/create")
        break
      case "business":
        router.push("/dashboard/stories/create")
        break
      default:
        router.push("/dashboard/stories/create")
    }
  }

  const handleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const handleProfileSettings = () => {
    router.push("/dashboard/settings")
  }

  const handleOrganizationSettings = () => {
    router.push("/dashboard/settings")
  }

  const handleBilling = () => {
    router.push("/dashboard/billing")
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  const getSearchPlaceholder = () => {
    switch (orgType) {
      case "nonprofit":
        return `Search stories, ${terminology.subscribers.toLowerCase()}...`
      case "grassroots":
        return "Search projects, supporters..."
      case "business":
        return "Search stories, customers..."
      default:
        return "Search..."
    }
  }

  const getNewButtonText = () => {
    switch (orgType) {
      case "nonprofit":
        return "New Story"
      case "grassroots":
        return "New Project"
      case "business":
        return "New Story"
      default:
        return "New Item"
    }
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button variant="ghost" size="sm" className="lg:hidden hover:bg-muted">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground pl-3" />
          <Input
            placeholder={getSearchPlaceholder()}
            className="pl-10 border-0 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <Button 
          size="sm" 
          className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          onClick={handleNewItem}
        >
          <Plus className="w-4 h-4 mr-2" />
          {getNewButtonText()}
        </Button>

        {/* Notifications */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative hover:bg-muted" onClick={handleNotifications}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500 hover:bg-orange-500 border-2 border-background">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 shadow-lg border-border" align="end">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 hover:bg-muted cursor-pointer border-b border-border/50 ${!notification.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.actionUrl) {
                        router.push(notification.actionUrl)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => router.push('/dashboard/notifications')}
              >
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-muted">
              <Avatar className="h-8 w-8 ring-2 ring-border">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 shadow-lg border-border" align="end">
            <div className="flex items-center justify-start gap-2 p-3 border-b border-border">
              <Avatar className="h-10 w-10 ring-2 ring-border">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-semibold text-foreground">{user?.email?.split("@")[0] || "User"}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  {org?.name} •{" "}
                  {orgType === "nonprofit" ? "Nonprofit" : orgType === "grassroots" ? "Grassroots" : "Business"}
                </p>
              </div>
            </div>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer" onClick={handleProfileSettings}>
              <User className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer" onClick={handleOrganizationSettings}>
              <Building2 className="h-4 w-4 mr-2" />
              Organization Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer" onClick={handleBilling}>
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-destructive/10 text-destructive cursor-pointer" onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
