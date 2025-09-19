import type React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Standardized loading spinner with consistent variants
interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "default" | "primary" | "secondary"
  className?: string
}

export function LoadingSpinner({ size = "md", variant = "default", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  }

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
  }

  return <Loader2 className={cn("animate-spin", sizeClasses[size], variantClasses[variant], className)} />
}

// Standardized skeleton loader
interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({ className, variant = "rectangular", animation = "pulse" }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-md",
  }

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]",
    none: "",
  }

  return <div className={cn("bg-muted", variantClasses[variant], animationClasses[animation], className)} />
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingOverlay({ isLoading, children, message, size = "md" }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size={size} variant="primary" />
            {message && <p className="text-sm text-muted-foreground font-medium">{message}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
