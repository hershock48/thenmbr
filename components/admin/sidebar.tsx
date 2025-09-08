"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Building2, DollarSign, Users, Settings, BarChart3, Hash } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Organizations", href: "/admin/organizations", icon: Building2 },
  { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Team", href: "/admin/team", icon: Users },
  { name: "NMBRs", href: "/admin/nmbrs", icon: Hash },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200/60 lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">#</span>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-transparent opacity-30 rounded-xl"></div>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 tracking-tight">NMBR Admin</h1>
            <p className="text-xs text-slate-500">Super Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-red-50 text-red-700 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm",
                  )}
                >
                  <item.icon className="h-4 w-4 transition-colors" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
