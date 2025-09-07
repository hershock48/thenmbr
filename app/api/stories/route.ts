import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const org = searchParams.get('org')
    const nmbr = searchParams.get('nmbr')

    if (!org) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // For demo purposes, always return mock data
    // TODO: Replace with actual database queries when Supabase is configured
    {
      // Return compelling mock data for demo purposes
      const mockStories = [
        {
          id: 'story-1',
          org_id: org,
          nmbr_code: '1',
          title: 'Maria\'s Journey to Clean Water',
          description: 'Meet Maria, a 12-year-old girl from a remote village in Guatemala. Every day, she walks 3 miles to collect water from a contaminated stream, carrying a heavy bucket that often makes her late for school. Maria dreams of becoming a teacher, but her education suffers because of the time spent fetching water. Your support helps us build a community well just 200 meters from her home, giving Maria and 200 other families access to clean, safe drinking water. This well will transform Maria\'s life, allowing her to focus on her studies and pursue her dream of teaching. The well will also include a water filtration system and regular maintenance to ensure long-term sustainability. Your donation directly impacts Maria\'s future and the health of her entire community.',
          photo_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=faces',
          goal_amount: 8500,
          current_amount: 5200,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-2',
          org_id: org,
          nmbr_code: '2',
          title: 'Ahmed\'s Medical School Dream',
          description: 'Ahmed is a brilliant 18-year-old from a refugee family in Jordan. Despite living in a refugee camp, he has maintained top grades and dreams of becoming a doctor to help others in his community. However, his family cannot afford the $2,000 annual tuition for medical school. Ahmed works part-time as a translator, but it\'s not enough. Your sponsorship covers his first year of medical school, including tuition, books, and basic living expenses. Ahmed plans to specialize in emergency medicine and return to work in refugee camps, providing critical healthcare to those who need it most. His story represents hope and resilience - with your help, he can break the cycle of poverty and become a beacon of hope for his community. Every dollar you donate brings Ahmed closer to his dream of healing others.',
          photo_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&crop=faces',
          goal_amount: 12000,
          current_amount: 7800,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-3',
          org_id: org,
          nmbr_code: '3',
          title: 'Sarah\'s Fight Against Cancer',
          description: 'Sarah is a 28-year-old single mother of two young children, diagnosed with stage 2 breast cancer. She works as a nurse but had to take unpaid leave for treatment. Her insurance covers only 60% of her medical costs, leaving her with $15,000 in out-of-pocket expenses. Sarah\'s children, ages 5 and 7, are her world, and she\'s determined to beat this disease for them. Your donation helps cover her chemotherapy treatments, medications, and basic living expenses during her recovery. Sarah\'s story is one of courage and determination - she continues to volunteer at her children\'s school even during treatment, showing incredible strength. With your support, Sarah can focus on healing without the constant worry of medical bills. She dreams of returning to nursing and helping other cancer patients once she\'s recovered. Your contribution directly saves a life and keeps a family together.',
          photo_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=faces',
          goal_amount: 15000,
          current_amount: 9200,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-4',
          org_id: org,
          nmbr_code: '4',
          title: 'Emergency Relief for Earthquake Victims',
          description: 'A devastating 7.2 magnitude earthquake struck the region, leaving thousands homeless and without basic necessities. Our emergency response team is on the ground providing immediate relief, but we need your help to scale our efforts. Your donation provides emergency shelter, clean water, medical supplies, and food for families who have lost everything. We\'re working around the clock to reach the most vulnerable - children, elderly, and those with disabilities. Every dollar goes directly to relief efforts, with 95% of donations reaching those in need. Our team includes local volunteers who understand the community and can ensure aid reaches the right people. This is a race against time, and your support can mean the difference between life and death for many families.',
          photo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          goal_amount: 25000,
          current_amount: 18750,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-5',
          org_id: org,
          nmbr_code: '5',
          title: 'Building Hope: New School for 200 Children',
          description: 'In a rural village where education is a luxury, 200 children currently study under a tree or in makeshift shelters. When it rains, school is cancelled. When it\'s too hot, children faint from heat exhaustion. We\'re building a proper school with classrooms, desks, clean water, and electricity. This school will serve not just the children, but the entire community as a center for adult education, health clinics, and community meetings. The school will be built using sustainable materials and solar power, ensuring it lasts for generations. Local craftsmen will be employed in construction, providing income to families. Education is the foundation of change, and this school will transform the future of an entire village. Your donation builds more than a building - it builds hope, opportunity, and a pathway out of poverty.',
          photo_url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
          goal_amount: 35000,
          current_amount: 22100,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      // Filter by NMBR code if provided
      const filteredStories = nmbr 
        ? mockStories.filter(story => story.nmbr_code === nmbr)
        : mockStories

      return NextResponse.json({ stories: filteredStories })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
