"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  snapPoints?: number[] // Percentage heights [30, 60, 90]
  className?: string
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [30, 60, 90],
  className,
}: MobileBottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(1) // Start at middle snap point
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  const height = snapPoints[currentSnapPoint]

  // Handle touch events for dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const newY = e.touches[0].clientY
    setCurrentY(newY)

    // Prevent scrolling when dragging
    e.preventDefault()
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaY = currentY - startY
    const threshold = 50

    if (deltaY > threshold) {
      // Dragged down - go to lower snap point or close
      if (currentSnapPoint > 0) {
        setCurrentSnapPoint(currentSnapPoint - 1)
      } else {
        onClose()
      }
    } else if (deltaY < -threshold) {
      // Dragged up - go to higher snap point
      if (currentSnapPoint < snapPoints.length - 1) {
        setCurrentSnapPoint(currentSnapPoint + 1)
      }
    }

    setIsDragging(false)
    setStartY(0)
    setCurrentY(0)
  }

  // Close on backdrop tap
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t shadow-2xl transition-all duration-300 ease-out",
          className,
        )}
        style={{
          height: `${height}vh`,
          transform: isDragging ? `translateY(${Math.max(0, currentY - startY)}px)` : "translateY(0)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-4">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>

        {/* Snap Point Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {snapPoints.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentSnapPoint ? "bg-primary" : "bg-muted-foreground/30",
              )}
              onClick={() => setCurrentSnapPoint(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
