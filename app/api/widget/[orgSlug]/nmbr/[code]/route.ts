import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { orgSlug: string; code: string } }) {
  const { orgSlug, code } = params

  // Mock data - in real app this would query the database
  const mockNmbrs: Record<string, any> = {
    HOPE001: {
      id: "1",
      code: "HOPE001",
      title: "Clean Water for Village",
      story:
        "This bracelet represents our mission to bring clean water to a remote village in Kenya. Every donation helps us get closer to installing a sustainable water system that will serve 500 families.",
      image: "/water-well-village.jpg",
      video: "https://example.com/water-project-video.mp4",
      goal: 5000,
      raised: 3250,
      subscribers: 89,
      status: "active",
      organization: {
        id: "1",
        name: "Hope Foundation",
        slug: "hope-foundation",
        primaryColor: "#2563eb",
        secondaryColor: "#ffffff",
      },
    },
    HOPE002: {
      id: "2",
      code: "HOPE002",
      title: "School Supplies Drive",
      story:
        "Education is the key to breaking the cycle of poverty. This NMBR supports our school supplies drive, providing books, pencils, and learning materials to children in underserved communities.",
      image: "/school-children-books.jpg",
      goal: 3000,
      raised: 4800,
      subscribers: 156,
      status: "completed",
      organization: {
        id: "1",
        name: "Hope Foundation",
        slug: "hope-foundation",
        primaryColor: "#2563eb",
        secondaryColor: "#ffffff",
      },
    },
  }

  const nmbr = mockNmbrs[code.toUpperCase()]

  if (!nmbr || nmbr.organization.slug !== orgSlug) {
    return NextResponse.json({ error: "NMBR not found" }, { status: 404 })
  }

  return NextResponse.json(nmbr)
}
