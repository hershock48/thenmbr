import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Heart,
  Users,
  Mail,
  BarChart3,
  Settings,
  CreditCard,
  Share2,
  HelpCircle,
  LogOut,
  Menu,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "NMBRs", href: "/dashboard/nmbrs", icon: Heart },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users },
  { name: "Newsletters", href: "/dashboard/newsletters", icon: Mail },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  { name: "Widget", href: "/dashboard/widget", icon: Share2 },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

// Mobile Sidebar Component
function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
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

          {/* Organization Info */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">HF</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Hope Foundation</p>
                <p className="text-xs text-slate-600">hope-foundation.org</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
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
                          "text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/80 hover:shadow-sm",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0 transition-colors" />
                        {item.name}
                        {item.name === "NMBRs" && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-100"
                          >
                            24
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
                    className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/80 transition-all duration-200"
                  >
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    Help & Support
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-700 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
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
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/95 backdrop-blur-sm border-r border-slate-200/60 px-6 pb-4">
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

          {/* Organization Info */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">HF</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Hope Foundation</p>
                <p className="text-xs text-slate-600">hope-foundation.org</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
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
                          "text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/80 hover:shadow-sm",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0 transition-colors" />
                        {item.name}
                        {item.name === "NMBRs" && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-100"
                          >
                            24
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
                    className="group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/80 transition-all duration-200"
                  >
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    Help & Support
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-700 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
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
