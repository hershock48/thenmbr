import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data - would come from database analytics
    const stats = {
      total: 1247,
      active: 1189,
      thisMonth: 156,
      growthRate: 12.5,
      segments: {
        water: 423,
        education: 356,
        healthcare: 289,
        recent: 156,
        inactive: 58,
      },
      engagement: {
        averageOpenRate: 68,
        averageClickRate: 24,
        mostPopularNmbr: "W001",
      },
      recentActivity: [
        { type: "subscription", email: "new.subscriber@email.com", nmbr: "W001", time: "2 hours ago" },
        { type: "update_sent", count: 423, segment: "Water Projects", time: "1 day ago" },
        { type: "unsubscribe", email: "former.subscriber@email.com", time: "2 days ago" },
        { type: "subscription", email: "another.new@email.com", nmbr: "E003", time: "3 days ago" },
      ],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching subscriber stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
