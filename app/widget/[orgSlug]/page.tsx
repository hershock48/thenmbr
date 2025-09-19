import { WidgetContainer } from "@/components/widget/widget-container"
import { notFound } from "next/navigation"

interface WidgetPageProps {
  params: {
    orgSlug: string
  }
  searchParams: {
    theme?: string
    primaryColor?: string
    secondaryColor?: string
  }
}

export default function WidgetPage({ params, searchParams }: WidgetPageProps) {
  // In a real app, this would fetch organization data from database
  const mockOrganization = {
    id: "b4599b27-2070-475c-a210-ecb9dcf0b46a", // Real org ID from your database
    name: "Hope Foundation",
    slug: "hope-foundation",
    primaryColor: searchParams.primaryColor || "#2563eb",
    secondaryColor: searchParams.secondaryColor || "#ffffff",
    logo: "/hope-foundation-logo.jpg",
  }

  if (params.orgSlug !== "hope-foundation") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <WidgetContainer organization={mockOrganization} />
    </div>
  )
}
