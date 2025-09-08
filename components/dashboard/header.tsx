"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, Menu, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, org, signOut } = useAuth()
  const { terminology, orgType } = useOrganization()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getSearchPlaceholder = () => {
    switch (orgType) {
      case "nonprofit":
        return "Search stories, donors..."
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
        <Button size="sm" className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          {getNewButtonText()}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hover:bg-muted">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500 hover:bg-orange-500 border-2 border-background">
            3
          </Badge>
        </Button>

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
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-semibold text-foreground">{user?.email?.split("@")[0] || "User"}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  {org?.name} •{" "}
                  {orgType === "nonprofit" ? "Nonprofit" : orgType === "grassroots" ? "Grassroots" : "Business"}
                </p>
              </div>
            </div>
            <DropdownMenuItem className="hover:bg-muted">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted">Organization Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted">Billing</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-destructive/10 text-destructive" onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
