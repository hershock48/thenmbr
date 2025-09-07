import type React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2 } from "lucide-react"

// Standardized form field wrapper
interface FormFieldProps {
  label: string
  error?: string
  success?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, success, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {hint && !error && !success && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="h-3 w-3" />
          {success}
        </div>
      )}
    </div>
  )
}

// Enhanced input with validation states
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  success?: string
}

export function ValidatedInput({ error, success, className, ...props }: ValidatedInputProps) {
  return (
    <Input
      className={cn(
        error && "border-destructive focus-visible:ring-destructive",
        success && "border-green-500 focus-visible:ring-green-500",
        className,
      )}
      {...props}
    />
  )
}

// Enhanced textarea with validation states
interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  success?: string
}

export function ValidatedTextarea({ error, success, className, ...props }: ValidatedTextareaProps) {
  return (
    <Textarea
      className={cn(
        error && "border-destructive focus-visible:ring-destructive",
        success && "border-green-500 focus-visible:ring-green-500",
        className,
      )}
      {...props}
    />
  )
}

// Form section with consistent styling
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
