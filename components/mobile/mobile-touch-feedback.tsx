"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileTouchFeedbackProps {
  children: ReactNode
  className?: string
  haptic?: boolean
  scaleOnPress?: boolean
  ripple?: boolean
}

export function MobileTouchFeedback({
  children,
  className,
  haptic = true,
  scaleOnPress = true,
  ripple = false,
}: MobileTouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const elementRef = useRef<HTMLDivElement>(null)

  const triggerHaptic = () => {
    if (haptic && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPressed(true)
    triggerHaptic()

    if (ripple && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const y = e.touches[0].clientY - rect.top

      const newRipple = {
        id: Date.now(),
        x,
        y,
      }

      setRipples((prev) => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  const handleTouchCancel = () => {
    setIsPressed(false)
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        "relative overflow-hidden transition-transform duration-150 ease-out",
        scaleOnPress && isPressed && "scale-95",
        className,
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {children}

      {/* Ripple Effects */}
      {ripple &&
        ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="w-0 h-0 bg-primary/20 rounded-full animate-ping"
              style={{
                animation: "ripple 0.6s ease-out",
                animationFillMode: "forwards",
              }}
            />
          </div>
        ))}

      <style jsx>{`
        @keyframes ripple {
          to {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
