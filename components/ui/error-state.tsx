"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title = "Something went wrong", message, onRetry, className }: ErrorStateProps) {
  return (
    <Card className={`border-red-200 bg-red-50/50 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
        <p className="text-red-700 mb-4">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
