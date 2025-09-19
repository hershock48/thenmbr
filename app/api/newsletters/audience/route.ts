import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const storyIds = searchParams.get('storyIds')?.split(',') || []

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Mock data for now - replace with actual database queries
    const mockStories = [
      {
        id: 'story-1',
        title: 'Clean Water Project',
        nmbr_code: 'NMBR001',
        subscriber_count: 45,
        subscribers: [
          { id: 'sub-1', email: 'john@example.com', first_name: 'John', last_name: 'Doe' },
          { id: 'sub-2', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith' },
          { id: 'sub-3', email: 'bob@example.com', first_name: 'Bob', last_name: 'Johnson' }
        ]
      },
      {
        id: 'story-2',
        title: 'Education for All',
        nmbr_code: 'NMBR002',
        subscriber_count: 32,
        subscribers: [
          { id: 'sub-4', email: 'alice@example.com', first_name: 'Alice', last_name: 'Brown' },
          { id: 'sub-5', email: 'charlie@example.com', first_name: 'Charlie', last_name: 'Wilson' }
        ]
      },
      {
        id: 'story-3',
        title: 'Community Garden',
        nmbr_code: 'NMBR003',
        subscriber_count: 28,
        subscribers: [
          { id: 'sub-6', email: 'diana@example.com', first_name: 'Diana', last_name: 'Davis' },
          { id: 'sub-7', email: 'eve@example.com', first_name: 'Eve', last_name: 'Miller' }
        ]
      }
    ]

    // If no specific story IDs, return all stories
    const filteredStories = storyIds.length > 0 
      ? mockStories.filter(story => storyIds.includes(story.id))
      : mockStories

    // Calculate total subscribers
    const totalSubscribers = mockStories.reduce((total, story) => total + story.subscriber_count, 0)

    return NextResponse.json({
      stories: filteredStories,
      totalSubscribers,
      selectedStories: filteredStories.map(story => ({
        id: story.id,
        title: story.title,
        nmbr_code: story.nmbr_code,
        subscriber_count: story.subscriber_count
      }))
    })

  } catch (error) {
    console.error('Error fetching audience data:', error)
    return NextResponse.json({ error: 'Failed to fetch audience data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { organizationId, storyIds, newsletterContent } = await request.json()

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Mock newsletter sending - replace with actual email service integration
    console.log('Sending newsletter:', {
      organizationId,
      storyIds,
      newsletterContent,
      timestamp: new Date().toISOString()
    })

    // Simulate sending to different audiences
    let recipientCount = 0
    if (storyIds && storyIds.length > 0) {
      // Send to specific NMBR subscribers
      recipientCount = storyIds.length * 25 // Mock count
    } else {
      // Send to all subscribers
      recipientCount = 127 // Mock total
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter sent successfully to ${recipientCount} recipients`,
      recipientCount,
      sentAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
