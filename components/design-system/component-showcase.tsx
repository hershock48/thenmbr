"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner, Skeleton, LoadingOverlay } from "@/components/patterns/loading-states"
import { EmptyState, ErrorState, NoResultsState } from "@/components/patterns/data-states"
import { FormField, ValidatedInput, FormSection } from "@/components/patterns/form-patterns"
import { ProgressBar, StepIndicator, CircularProgress } from "@/components/patterns/progress-indicators"
import { useState } from "react"
import { Inbox } from "lucide-react"

// Component showcase for design system documentation
export function ComponentShowcase() {
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [inputError, setInputError] = useState("")

  const steps = [
    { id: "1", title: "Account Setup", description: "Create your organization profile", status: "completed" as const },
    { id: "2", title: "Configure Settings", description: "Set up your preferences", status: "current" as const },
    {
      id: "3",
      title: "Launch Campaign",
      description: "Start your first fundraising campaign",
      status: "pending" as const,
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">NMBR Design System</h1>
        <p className="text-muted-foreground">Standardized components and patterns for the NMBR Platform</p>
      </div>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Consistent loading indicators and skeleton screens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Loading Spinners</h4>
            <div className="flex items-center gap-4">
              <LoadingSpinner size="xs" />
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
              <LoadingSpinner size="xl" />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Skeleton Loaders</h4>
            <div className="space-y-3">
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-1/2" />
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="w-1/3" />
                  <Skeleton variant="text" className="w-1/4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Loading Overlay</h4>
            <LoadingOverlay isLoading={isLoading} message="Processing...">
              <div className="p-6 bg-muted rounded-lg">
                <p>Content that can be overlaid with loading state</p>
                <Button
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 2000)
                  }}
                  className="mt-3"
                >
                  Trigger Loading
                </Button>
              </div>
            </LoadingOverlay>
          </div>
        </CardContent>
      </Card>

      {/* Data States */}
      <Card>
        <CardHeader>
          <CardTitle>Data States</CardTitle>
          <CardDescription>Empty states, error states, and no results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="font-medium mb-3">Empty State</h4>
            <EmptyState
              icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
              title="No campaigns yet"
              description="Create your first fundraising campaign to get started"
              action={{
                label: "Create Campaign",
                onClick: () => console.log("Create campaign"),
              }}
            />
          </div>

          <div>
            <h4 className="font-medium mb-3">Error State</h4>
            <ErrorState
              title="Failed to load data"
              description="There was a problem loading your campaigns"
              retry={() => console.log("Retry")}
            />
          </div>

          <div>
            <h4 className="font-medium mb-3">No Results</h4>
            <NoResultsState searchTerm="nonprofit" onClear={() => console.log("Clear search")} />
          </div>
        </CardContent>
      </Card>

      {/* Form Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Form Patterns</CardTitle>
          <CardDescription>Standardized form fields and validation</CardDescription>
        </CardHeader>
        <CardContent>
          <FormSection title="Organization Details" description="Basic information about your organization">
            <FormField label="Organization Name" required hint="This will be displayed on your campaigns">
              <ValidatedInput
                placeholder="Enter organization name"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setInputError(e.target.value.length < 3 ? "Name must be at least 3 characters" : "")
                }}
                error={inputError}
              />
            </FormField>

            <FormField label="Email Address" required success="Email verified">
              <ValidatedInput type="email" placeholder="contact@organization.org" success="Email verified" />
            </FormField>
          </FormSection>
        </CardContent>
      </Card>

      {/* Progress Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Indicators</CardTitle>
          <CardDescription>Progress bars, step indicators, and circular progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="font-medium mb-3">Progress Bars</h4>
            <div className="space-y-4">
              <ProgressBar value={75} label="Campaign Progress" showLabel />
              <ProgressBar value={45} variant="warning" size="sm" />
              <ProgressBar value={90} variant="success" size="lg" />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Step Indicator</h4>
            <StepIndicator steps={steps} />
          </div>

          <div>
            <h4 className="font-medium mb-3">Circular Progress</h4>
            <div className="flex gap-6">
              <CircularProgress value={75} size={100} />
              <CircularProgress value={45} variant="warning" size={80} />
              <CircularProgress value={90} variant="success" size={60} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Design Tokens</CardTitle>
          <CardDescription>Colors, typography, and spacing standards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <div className="w-full h-12 bg-primary rounded"></div>
                <p className="text-xs font-medium">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-secondary rounded"></div>
                <p className="text-xs font-medium">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-green-500 rounded"></div>
                <p className="text-xs font-medium">Success</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-red-500 rounded"></div>
                <p className="text-xs font-medium">Error</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Typography</h4>
            <div className="space-y-2">
              <p className="text-4xl font-bold">Heading 1</p>
              <p className="text-2xl font-semibold">Heading 2</p>
              <p className="text-lg font-medium">Heading 3</p>
              <p className="text-base">Body text</p>
              <p className="text-sm text-muted-foreground">Caption text</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Component Sizes</h4>
            <div className="flex items-center gap-3">
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
