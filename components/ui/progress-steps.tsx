"use client"

import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
  status: "completed" | "current" | "upcoming"
}

interface ProgressStepsProps {
  steps: Step[]
  className?: string
}

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <nav aria-label="Progress" className={cn("", className)}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={cn("flex items-center", stepIdx !== steps.length - 1 && "flex-1")}>
            <div className="flex items-center">
              <div className="flex items-center justify-center">
                {step.status === "completed" ? (
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                ) : step.status === "current" ? (
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center border-2 border-cyan-600 shadow-sm">
                    <Circle className="w-4 h-4 text-cyan-600 fill-current" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-300">
                    <Circle className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "completed" || step.status === "current" ? "text-slate-900" : "text-slate-500",
                  )}
                >
                  {step.title}
                </p>
                {step.description && <p className="text-xs text-slate-500">{step.description}</p>}
              </div>
            </div>
            {stepIdx !== steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={cn("h-0.5 w-full", step.status === "completed" ? "bg-cyan-600" : "bg-slate-200")} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
