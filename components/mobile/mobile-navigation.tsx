"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Mail, Users, BarChart3, Settings, Menu, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MobileNavigationProps {
  organizationName: string
  organizationSlug: string
}

export function MobileNavigation({ organizationName, organizationSlug }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", badge: null },
    { href: "/dashboard/newsletters", icon: Mail, label: "Newsletters", badge: "3" },
    { href: "/dashboard/subscribers", icon: Users, label: "Subscribers", badge: null },
    { href: "/dashboard/nmbrs", icon: BarChart3, label: "Stories", badge: null },
    { href: "/dashboard/widget", icon: Settings, label: "Widget", badge: null },
  ]

  // Handle swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touchEnd = e.changedTouches[0].clientX
    const distance = touchStart - touchEnd

    // Swipe left to close (distance > 50)
    if (distance > 50) {
      setIsOpen(false)
    }
  }

  // Close on outside tap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const triggerHaptic = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden h-10 w-10 p-0"
        onClick={() => {
          triggerHaptic()
          setIsOpen(true)
        }}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Navigation Panel */}
          <div
            ref={overlayRef}
            className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-card border-r shadow-2xl transform transition-transform duration-300 ease-out"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground truncate">{organizationName}</h2>
                <p className="text-sm text-muted-foreground">@{organizationSlug}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 mx-2 rounded-lg transition-all duration-200 active:scale-95",
                      isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/50 text-foreground",
                    )}
                    onClick={() => {
                      triggerHaptic()
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge variant="secondary" className="h-5 px-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30">
              <div className="text-xs text-muted-foreground text-center">Swipe left to close</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
