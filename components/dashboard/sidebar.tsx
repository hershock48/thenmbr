"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogOut, Menu, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useOrganization } from "@/contexts/OrganizationContext"
import { useRouter } from "next/navigation"

// Mobile Sidebar Component
function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const { org, signOut } = useAuth()
  const { navigation, orgType } = useOrganization()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getOrgTypeColor = () => {
    switch (orgType) {
      case "nonprofit":
        return "from-rose-500 to-pink-600"
      case "grassroots":
        return "from-emerald-500 to-teal-600"
      case "business":
        return "from-blue-500 to-indigo-600"
      default:
        return "from-primary to-primary/80"
    }
  }

  const getOrgTypeName = () => {
    switch (orgType) {
      case "nonprofit":
        return "Nonprofit"
      case "grassroots":
        return "Grassroots"
      case "business":
        return "Business"
      default:
        return "Organization"
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card/95 backdrop-blur-sm px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div
                className={`relative w-10 h-10 bg-gradient-to-br ${getOrgTypeColor()} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold text-lg drop-shadow-sm">#</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-20 rounded-xl"></div>
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">NMBR</span>
            </div>
          </div>

          <div
            className={`bg-gradient-to-r ${getOrgTypeColor().replace("to-", "to-").replace("from-", "from-").replace("-500", "-50").replace("-600", "-100")} rounded-xl p-4 border border-border`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${getOrgTypeColor()} rounded-xl flex items-center justify-center shadow-sm`}
              >
                <span className="text-white font-bold text-sm drop-shadow-sm">{org?.name?.charAt(0) || "O"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{org?.name || "Organization"}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground truncate">{org?.website || "No website"}</p>
                  <Badge variant="secondary" className="text-xs">
                    {getOrgTypeName()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200",
                          "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:shadow-sm",
                        )}
                        title={item.description}
                      >
                        <item.icon className="h-5 w-5 shrink-0 transition-colors" />
                        {item.name}
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-100"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="space-y-1">
                  <Link
                    href="/dashboard/help"
                    onClick={() => setOpen(false)}
                    className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                  >
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    Help & Support
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 shrink-0 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar() {
  const { org, signOut } = useAuth()
  const { navigation, orgType } = useOrganization()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getOrgTypeColor = () => {
    switch (orgType) {
      case "nonprofit":
        return "from-rose-500 to-pink-600"
      case "grassroots":
        return "from-emerald-500 to-teal-600"
      case "business":
        return "from-blue-500 to-indigo-600"
      default:
        return "from-primary to-primary/80"
    }
  }

  const getOrgTypeName = () => {
    switch (orgType) {
      case "nonprofit":
        return "Nonprofit"
      case "grassroots":
        return "Grassroots"
      case "business":
        return "Business"
      default:
        return "Organization"
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card/95 backdrop-blur-sm border-r border-border px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div
                className={`relative w-10 h-10 bg-gradient-to-br ${getOrgTypeColor()} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold text-lg drop-shadow-sm">#</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-20 rounded-xl"></div>
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">NMBR</span>
            </div>
          </div>

          <div
            className={`bg-gradient-to-r ${getOrgTypeColor().replace("to-", "to-").replace("from-", "from-").replace("-500", "-50").replace("-600", "-100")} rounded-xl p-4 border border-border`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${getOrgTypeColor()} rounded-xl flex items-center justify-center shadow-sm`}
              >
                <span className="text-white font-bold text-sm drop-shadow-sm">{org?.name?.charAt(0) || "O"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{org?.name || "Organization"}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground truncate">{org?.website || "No website"}</p>
                  <Badge variant="secondary" className="text-xs">
                    {getOrgTypeName()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200",
                          "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:shadow-sm",
                        )}
                        title={item.description}
                      >
                        <item.icon className="h-5 w-5 shrink-0 transition-colors" />
                        {item.name}
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-100"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="space-y-1">
                  <Link
                    href="/dashboard/help"
                    className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                  >
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    Help & Support
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 shrink-0 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />
    </>
  )
}
