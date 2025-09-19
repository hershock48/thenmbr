import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with real database queries
const mockOrganizations = [
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
    members: 3
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
    members: 5
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
    members: 2
  },
  {
    id: '4',
    name: 'Local Food Bank',
    type: 'nonprofit',
    email: 'info@localfoodbank.org',
    status: 'inactive',
    createdAt: '2024-01-05',
    lastActive: '2024-01-15',
    nmbrCount: 6,
    revenue: 0,
    stories: 4,
    members: 8
  },
  {
    id: '5',
    name: 'Tech Startup Inc.',
    type: 'business',
    email: 'hello@techstartup.com',
    status: 'suspended',
    createdAt: '2024-01-08',
    lastActive: '2024-01-12',
    nmbrCount: 3,
    revenue: 0,
    stories: 2,
    members: 1
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all'
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Filter organizations
    let filteredOrgs = mockOrganizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase()) ||
                           org.email.toLowerCase().includes(search.toLowerCase())
      const matchesType = type === 'all' || org.type === type
      const matchesStatus = status === 'all' || org.status === status
      
      return matchesSearch && matchesType && matchesStatus
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrgs = filteredOrgs.slice(startIndex, endIndex)

    return NextResponse.json({
      organizations: paginatedOrgs,
      pagination: {
        page,
        limit,
        total: filteredOrgs.length,
        pages: Math.ceil(filteredOrgs.length / limit)
      },
      stats: {
        total: mockOrganizations.length,
        active: mockOrganizations.filter(org => org.status === 'active').length,
        business: mockOrganizations.filter(org => org.type === 'business').length,
        nonprofit: mockOrganizations.filter(org => org.type === 'nonprofit').length
      }
    })
  } catch (error) {
    console.error('Organizations API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'create':
        // Create new organization
        const newOrg = {
          id: (mockOrganizations.length + 1).toString(),
          ...data,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          nmbrCount: 0,
          revenue: 0,
          stories: 0,
          members: 1
        }
        mockOrganizations.push(newOrg)
        return NextResponse.json({ success: true, organization: newOrg })

      case 'update':
        // Update organization
        const orgIndex = mockOrganizations.findIndex(org => org.id === data.id)
        if (orgIndex === -1) {
          return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }
        mockOrganizations[orgIndex] = { ...mockOrganizations[orgIndex], ...data }
        return NextResponse.json({ success: true, organization: mockOrganizations[orgIndex] })

      case 'delete':
        // Delete organization
        const deleteIndex = mockOrganizations.findIndex(org => org.id === data.id)
        if (deleteIndex === -1) {
          return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }
        mockOrganizations.splice(deleteIndex, 1)
        return NextResponse.json({ success: true })

      case 'suspend':
        // Suspend organization
        const suspendIndex = mockOrganizations.findIndex(org => org.id === data.id)
        if (suspendIndex === -1) {
          return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }
        mockOrganizations[suspendIndex].status = 'suspended'
        return NextResponse.json({ success: true, organization: mockOrganizations[suspendIndex] })

      case 'activate':
        // Activate organization
        const activateIndex = mockOrganizations.findIndex(org => org.id === data.id)
        if (activateIndex === -1) {
          return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }
        mockOrganizations[activateIndex].status = 'active'
        return NextResponse.json({ success: true, organization: mockOrganizations[activateIndex] })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Organizations POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process organization request' },
      { status: 500 }
    )
  }
}
