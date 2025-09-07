"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertCircle, Search, Inbox, RefreshCw } from "lucide-react"

// Standardized empty state component
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 p-3 rounded-full bg-muted">
        {icon || <Inbox className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant={action.variant || "default"} className="min-w-[120px]">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Standardized error state component
interface ErrorStateProps {
  title?: string
  description?: string
  error?: Error | string
  retry?: () => void
  className?: string
}

export function ErrorState({ title = "Something went wrong", description, error, retry, className }: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 p-3 rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {(description || errorMessage) && (
        <p className="text-muted-foreground mb-6 max-w-sm">{description || errorMessage}</p>
      )}
      {retry && (
        <Button onClick={retry} variant="outline" className="min-w-[120px] bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

// No results state for search/filters
interface NoResultsStateProps {
  searchTerm?: string
  onClear?: () => void
  className?: string
}

export function NoResultsState({ searchTerm, onClear, className }: NoResultsStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 p-3 rounded-full bg-muted">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {searchTerm
          ? `No results found for "${searchTerm}". Try adjusting your search terms.`
          : "No items match your current filters. Try adjusting your criteria."}
      </p>
      {onClear && (
        <Button onClick={onClear} variant="outline">
          Clear filters
        </Button>
      )}
    </div>
  )
}
