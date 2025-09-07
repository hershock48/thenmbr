import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Standardized progress bar with variants
interface ProgressBarProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "error"
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const variantClasses = {
    default: "[&>div]:bg-primary",
    success: "[&>div]:bg-green-500",
    warning: "[&>div]:bg-yellow-500",
    error: "[&>div]:bg-red-500",
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">{label}</span>
          {showLabel && <span className="text-muted-foreground">{Math.round(percentage)}%</span>}
        </div>
      )}
      <Progress value={percentage} className={cn(sizeClasses[size], variantClasses[variant])} />
    </div>
  )
}

// Step indicator component
interface Step {
  id: string
  title: string
  description?: string
  status: "pending" | "current" | "completed"
}

interface StepIndicatorProps {
  steps: Step[]
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StepIndicator({ steps, orientation = "horizontal", size = "md", className }: StepIndicatorProps) {
  const sizeClasses = {
    sm: {
      circle: "w-6 h-6 text-xs",
      text: "text-xs",
      gap: "gap-2",
    },
    md: {
      circle: "w-8 h-8 text-sm",
      text: "text-sm",
      gap: "gap-3",
    },
    lg: {
      circle: "w-10 h-10 text-base",
      text: "text-base",
      gap: "gap-4",
    },
  }

  const isHorizontal = orientation === "horizontal"

  return (
    <div className={cn("flex", isHorizontal ? "items-center justify-between" : "flex-col space-y-4", className)}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn("flex items-center", isHorizontal ? "flex-col text-center" : "flex-row", sizeClasses[size].gap)}
        >
          <div
            className={cn(
              "rounded-full border-2 flex items-center justify-center font-medium transition-colors",
              sizeClasses[size].circle,
              step.status === "completed" && "bg-primary border-primary text-primary-foreground",
              step.status === "current" && "border-primary text-primary bg-primary/10",
              step.status === "pending" && "border-muted-foreground/30 text-muted-foreground",
            )}
          >
            {step.status === "completed" ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
          </div>

          <div className={cn(isHorizontal ? "mt-2" : "ml-3 flex-1")}>
            <div
              className={cn(
                "font-medium",
                sizeClasses[size].text,
                step.status === "current" && "text-primary",
                step.status === "pending" && "text-muted-foreground",
              )}
            >
              {step.title}
            </div>
            {step.description && (
              <div className={cn("text-muted-foreground mt-1", size === "sm" ? "text-xs" : "text-sm")}>
                {step.description}
              </div>
            )}
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className={cn("bg-border", isHorizontal ? "h-px flex-1 mx-4" : "w-px h-6 ml-4 -mt-2 mb-2")} />
          )}
        </div>
      ))}
    </div>
  )
}

// Circular progress indicator
interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: "default" | "success" | "warning" | "error"
  showLabel?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "default",
  showLabel = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colors = {
    default: "stroke-primary",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    error: "stroke-red-500",
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-300 ease-out", colors[variant])}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}
