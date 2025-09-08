import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with real database queries
const mockAnalyticsData = {
  overview: {
    totalUsers: 2380,
    totalOrganizations: 1847,
    totalRevenue: 45620,
    totalNMBRs: 3420,
    totalStories: 2150,
    activeSubscriptions: 1847,
    monthlyGrowth: 23.5,
    businessCount: 1203,
    nonprofitCount: 644
  },
  userGrowth: [
    { month: "Jan", users: 1200, organizations: 800 },
    { month: "Feb", users: 1450, organizations: 950 },
    { month: "Mar", users: 1680, organizations: 1100 },
    { month: "Apr", users: 1920, organizations: 1250 },
    { month: "May", users: 2150, organizations: 1400 },
    { month: "Jun", users: 2380, organizations: 1547 }
  ],
  organizationTypes: [
    { name: "Nonprofits", value: 35, color: "#3b82f6" },
    { name: "Businesses", value: 65, color: "#1e3a8a" }
  ],
  revenueData: [
    { month: "Jan", revenue: 8500, subscriptions: 120 },
    { month: "Feb", revenue: 9200, subscriptions: 135 },
    { month: "Mar", revenue: 10800, subscriptions: 150 },
    { month: "Apr", revenue: 12500, subscriptions: 170 },
    { month: "May", revenue: 14200, subscriptions: 190 },
    { month: "Jun", revenue: 16420, subscriptions: 220 }
  ],
  topOrganizations: [
    {
      id: '1',
      name: 'Ethiopian Coffee Co.',
      type: 'business',
      email: 'contact@ethiopiancoffee.com',
      status: 'active',
      createdAt: '2024-01-15',
      lastActive: '2024-01-20',
      nmbrCount: 12,
      revenue: 2450,
      stories: 8,
      members: 3,
      searchCount: 145,
      views: 320
    },
    {
      id: '2',
      name: 'Clean Water Foundation',
      type: 'nonprofit',
      email: 'info@cleanwater.org',
      status: 'active',
      createdAt: '2024-01-10',
      lastActive: '2024-01-19',
      nmbrCount: 15,
      revenue: 0,
      stories: 12,
      members: 5,
      searchCount: 278,
      views: 450
    },
    {
      id: '3',
      name: 'Sustainable Fashion Co.',
      type: 'business',
      email: 'hello@sustainablefashion.com',
      status: 'active',
      createdAt: '2024-01-12',
      lastActive: '2024-01-18',
      nmbrCount: 8,
      revenue: 1890,
      stories: 5,
      members: 2,
      searchCount: 132,
      views: 285
    }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'user_registration',
      description: 'New user registered: Sarah Johnson',
      timestamp: '2024-01-20T10:30:00Z',
      organization: 'Hope Organization'
    },
    {
      id: '2',
      type: 'nmbr_created',
      description: 'New NMBR created: NMBR-001',
      timestamp: '2024-01-20T09:15:00Z',
      organization: 'Ethiopian Coffee Co.'
    },
    {
      id: '3',
      type: 'story_published',
      description: 'Story published: "Clean Water Impact"',
      timestamp: '2024-01-20T08:45:00Z',
      organization: 'Clean Water Foundation'
    },
    {
      id: '4',
      type: 'subscription_upgraded',
      description: 'Subscription upgraded to Pro',
      timestamp: '2024-01-20T07:20:00Z',
      organization: 'Tech Startup Inc.'
    }
  ],
  performanceMetrics: {
    nmbrSearches: 12450,
    storyViews: 25680,
    newsletterSubscriptions: 3420,
    conversionRate: 12.5,
    averageSessionDuration: 4.2,
    bounceRate: 8.3
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    const type = searchParams.get('type') || 'overview'

    // Simulate different data based on time range
    let data = mockAnalyticsData

    if (timeRange === '7d') {
      // Return last 7 days data
      data = {
        ...mockAnalyticsData,
        userGrowth: mockAnalyticsData.userGrowth.slice(-2),
        revenueData: mockAnalyticsData.revenueData.slice(-2)
      }
    } else if (timeRange === '90d') {
      // Return last 90 days data (extend the arrays)
      data = {
        ...mockAnalyticsData,
        userGrowth: [
          ...mockAnalyticsData.userGrowth,
          { month: "Jul", users: 2650, organizations: 1700 },
          { month: "Aug", users: 2920, organizations: 1850 }
        ],
        revenueData: [
          ...mockAnalyticsData.revenueData,
          { month: "Jul", revenue: 18200, subscriptions: 245 },
          { month: "Aug", revenue: 20100, subscriptions: 270 }
        ]
      }
    }

    // Return specific data type if requested
    if (type === 'overview') {
      return NextResponse.json(data.overview)
    } else if (type === 'userGrowth') {
      return NextResponse.json(data.userGrowth)
    } else if (type === 'organizationTypes') {
      return NextResponse.json(data.organizationTypes)
    } else if (type === 'revenue') {
      return NextResponse.json(data.revenueData)
    } else if (type === 'organizations') {
      return NextResponse.json(data.topOrganizations)
    } else if (type === 'activity') {
      return NextResponse.json(data.recentActivity)
    } else if (type === 'performance') {
      return NextResponse.json(data.performanceMetrics)
    }

    // Return all data by default
    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    // Handle different analytics actions
    switch (action) {
      case 'export':
        // Generate export data
        const exportData = {
          timestamp: new Date().toISOString(),
          data: mockAnalyticsData,
          format: data.format || 'json'
        }
        return NextResponse.json(exportData)
      
      case 'refresh':
        // Simulate data refresh
        return NextResponse.json({ 
          success: true, 
          message: 'Analytics data refreshed',
          timestamp: new Date().toISOString()
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process analytics request' },
      { status: 500 }
    )
  }
}
