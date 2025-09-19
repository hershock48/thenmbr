import { NextRequest, NextResponse } from 'next/server'
import { accessibilityService } from '@/lib/accessibility-service'

export async function POST(request: NextRequest) {
  try {
    const audit = await accessibilityService.runAccessibilityAudit()
    
    return NextResponse.json({
      success: true,
      audit
    })

  } catch (error) {
    console.error('Error running accessibility audit:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run accessibility audit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return accessibility service configuration
    const config = accessibilityService.getConfig()
    
    return NextResponse.json({
      success: true,
      config
    })

  } catch (error) {
    console.error('Error fetching accessibility configuration:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch accessibility configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
