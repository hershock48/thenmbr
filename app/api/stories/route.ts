import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const org = searchParams.get('org')
    const nmbr = searchParams.get('nmbr')

    if (!org) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // For demo purposes, always return mock data
    // Note: Replace with actual database queries when Supabase is configured
    {
      // Determine if this is a business or nonprofit based on org ID
      const isBusinessDemo = org === 'demo-business-456'
      
      // Return different mock data based on organization type
      const mockStories = isBusinessDemo ? [
        // Business Demo Stories
        {
          id: 'story-1',
          org_id: org,
          nmbr_code: '1',
          title: 'Handcrafted Coffee from Ethiopian Highlands',
          description: 'This premium coffee comes from small family farms in the Ethiopian highlands, where traditional cultivation methods have been passed down for generations. Each bean is hand-picked at peak ripeness and sun-dried on raised beds. The farmers receive fair trade prices, ensuring sustainable livelihoods for their families. This particular batch was harvested by the Tesfaye family, who have been growing coffee for over 50 years. Their dedication to quality and environmental stewardship results in a rich, complex flavor profile with notes of dark chocolate and citrus. By purchasing this coffee, you\'re directly supporting sustainable farming practices and helping preserve traditional agricultural knowledge. The Tesfaye family uses their earnings to send their children to school and invest in community infrastructure.',
          photo_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop&crop=faces',
          goal_amount: 2500,
          current_amount: 1800,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-2',
          org_id: org,
          nmbr_code: '2',
          title: 'Sustainable Bamboo Phone Case',
          description: 'This eco-friendly phone case is made from 100% biodegradable bamboo fiber, crafted by skilled artisans in Vietnam. Each case is unique, featuring natural bamboo grain patterns that make it a one-of-a-kind piece. The manufacturing process uses zero-waste techniques and renewable energy, making it completely carbon-neutral. The artisans, led by master craftsman Nguyen Van Minh, have been perfecting bamboo techniques for over 20 years. Your purchase supports fair wages for the artisan community and helps preserve traditional Vietnamese craftsmanship. The case provides excellent protection while being completely compostable at the end of its life. This represents a perfect blend of modern technology and traditional sustainability.',
          photo_url: 'https://images.unsplash.com/photo-1511707171631-9bb0b6bc2d28?w=800&h=600&fit=crop&crop=faces',
          goal_amount: 1500,
          current_amount: 1200,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'story-3',
          org_id: org,
          nmbr_code: '3',
          title: 'Artisan Ceramic Dinnerware Set',
          description: 'This handcrafted ceramic dinnerware set is created by master potter Elena Rodriguez in her studio in Oaxaca, Mexico. Each piece is thrown on a traditional potter\'s wheel and decorated with indigenous Zapotec patterns that have been passed down through generations. The clay is sourced locally from sustainable deposits, and the glazes are made from natural minerals. Elena employs local women in her studio, providing them with skills training and fair wages. The dinnerware is both functional art and a celebration of Mexican cultural heritage. Your purchase helps preserve traditional pottery techniques and supports women\'s economic empowerment in rural Mexico. Each set is unique, signed by Elena, and comes with a certificate of authenticity.',
          photo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=faces',
          goal_amount: 3200,
          current_amount: 2400,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] : [
        // Nonprofit Demo Stories
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
