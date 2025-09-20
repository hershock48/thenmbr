export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const trialEmailTemplates = {
  // Day 1 - Welcome & Setup
  day1_welcome: (organizationName: string): EmailTemplate => ({
    subject: `Welcome to NMBR, ${organizationName}! Let's create your first impact story`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to NMBR!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Let's turn your stories into lasting donor connections</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${organizationName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to NMBR! You're now part of a community of nonprofits using story-driven fundraising 
            to create deeper connections with their donors.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🎯 Your Next Steps:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Complete your organization profile</li>
              <li>Create your first impact story</li>
              <li>Set up your first NMBR</li>
              <li>Test the donor experience</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Get Started Now
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Need help? Reply to this email or check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help">help center</a>.
          </p>
        </div>
      </div>
    `,
    text: `Welcome to NMBR! Hi ${organizationName}, you're now part of a community of nonprofits using story-driven fundraising. Your next steps: 1) Complete your profile 2) Create your first impact story 3) Set up your first NMBR 4) Test the donor experience. Get started at ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  }),

  // Day 3 - Feature Spotlight
  day3_analytics: (organizationName: string): EmailTemplate => ({
    subject: `See the impact of your NMBRs with detailed analytics`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Track Your Impact</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">See how your stories connect with donors</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${organizationName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Ready to see how your impact stories are performing? Your NMBR analytics dashboard 
            shows you exactly how donors are engaging with your stories.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📊 What You Can Track:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Story Views:</strong> How many people are reading your stories</li>
              <li><strong>Donor Engagement:</strong> Which stories resonate most</li>
              <li><strong>Email Captures:</strong> Growing your supporter base</li>
              <li><strong>Conversion Rates:</strong> Stories that drive donations</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Analytics
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> Check your analytics daily to see which stories are performing best and optimize your impact messaging.
            </p>
          </div>
        </div>
      </div>
    `,
    text: `Track Your Impact - Hi ${organizationName}, see how your impact stories are performing with NMBR analytics. Track story views, donor engagement, email captures, and conversion rates. View your analytics at ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics`
  }),

  // Day 7 - Upgrade Teaser
  day7_upgrade_teaser: (organizationName: string, nmbrsCreated: number): EmailTemplate => ({
    subject: `You've created ${nmbrsCreated} NMBR${nmbrsCreated !== 1 ? 's' : ''}! Ready to scale?`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Amazing Progress!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You're already making an impact</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${organizationName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! You've created ${nmbrsCreated} NMBR${nmbrsCreated !== 1 ? 's' : ''} and you're already 
            connecting donors to your impact stories. That's fantastic progress in just one week!
          </p>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-top: 0;">🚀 Ready to Scale?</h3>
            <p style="color: #4a6741; margin-bottom: 15px;">
              With the Growth plan, you can create up to 5 NMBRs and unlock advanced features:
            </p>
            <ul style="color: #4a6741; line-height: 1.8;">
              <li>Advanced analytics & donor journey tracking</li>
              <li>Enhanced branding (remove "Powered by NMBR")</li>
              <li>Marketplace self-serve ordering</li>
              <li>Mailchimp/Constant Contact integration</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Upgrade Options
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Your trial continues for 7 more days. No pressure - upgrade when you're ready!
          </p>
        </div>
      </div>
    `,
    text: `Amazing Progress! Hi ${organizationName}, congratulations on creating ${nmbrsCreated} NMBR${nmbrsCreated !== 1 ? 's' : ''}! You're already connecting donors to your impact stories. Ready to scale? The Growth plan offers 5 NMBRs, advanced analytics, enhanced branding, and marketplace integration. View upgrade options at ${process.env.NEXT_PUBLIC_APP_URL}/pricing`
  }),

  // Day 12 - Urgency
  day12_urgency: (organizationName: string): EmailTemplate => ({
    subject: `⚠️ Only 2 days left in your NMBR trial`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">⏰ Trial Ending Soon</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Don't lose access to your NMBRs</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${organizationName}!</h2>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Important Notice</h3>
            <p style="color: #856404; margin-bottom: 0;">
              Your free trial ends in 2 days. After that, your NMBRs will be archived and you'll lose access to your donor data unless you upgrade.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We'd hate to see you lose all the progress you've made. Upgrade today and continue building 
            lasting relationships with your donors through impact stories.
          </p>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-top: 0;">🎁 Special Offer - 20% Off!</h3>
            <p style="color: #4a6741; margin-bottom: 0;">
              Get 20% off your first 3 months when you upgrade today. Use code <strong>TRIAL20</strong> at checkout.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
               style="background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Upgrade Now - Save 20%
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Questions? Reply to this email - we're here to help!
          </p>
        </div>
      </div>
    `,
    text: `Trial Ending Soon - Hi ${organizationName}, your free trial ends in 2 days. Don't lose access to your NMBRs and donor data. Special offer: 20% off your first 3 months with code TRIAL20. Upgrade now at ${process.env.NEXT_PUBLIC_APP_URL}/pricing`
  }),

  // Day 14 - Final Push
  day14_final: (organizationName: string): EmailTemplate => ({
    subject: `🚨 Your NMBR trial ends TODAY - Last chance to upgrade`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff4757 0%, #c44569 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🚨 Final Notice</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your trial ends today</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${organizationName}!</h2>
          
          <div style="background: #ffebee; border: 1px solid #ffcdd2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #c62828; margin-top: 0;">⏰ Today is the Last Day</h3>
            <p style="color: #d32f2f; margin-bottom: 0;">
              Your free trial expires at midnight tonight. After that, your account will be suspended and you'll lose access to all your NMBRs and donor data.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This is your final opportunity to continue using NMBR. We've loved seeing the impact stories you've created, 
            and we'd hate to lose you as part of our community.
          </p>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-top: 0;">🎁 Final Offer - 30% Off!</h3>
            <p style="color: #4a6741; margin-bottom: 0;">
              Because we really want you to stay, we're offering 30% off your first 3 months. 
              Use code <strong>STAY30</strong> at checkout.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
               style="background: #ff4757; color: white; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Upgrade Now - Save 30%
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you have any questions or need help, reply to this email immediately. We're here to help!
          </p>
        </div>
      </div>
    `,
    text: `Final Notice - Hi ${organizationName}, your NMBR trial ends TODAY at midnight. Don't lose access to your NMBRs and donor data. Final offer: 30% off your first 3 months with code STAY30. Upgrade now at ${process.env.NEXT_PUBLIC_APP_URL}/pricing`
  })
}

// Helper function to send trial emails with Resend
export async function sendTrialEmail(
  email: string,
  templateType: keyof typeof trialEmailTemplates,
  organizationName: string,
  additionalData?: { nmbrsCreated?: number }
) {
  const template = trialEmailTemplates[templateType]
  
  // Add additional data if provided
  let finalTemplate: EmailTemplate
  if (templateType === 'day7_upgrade_teaser' && additionalData?.nmbrsCreated !== undefined) {
    finalTemplate = template(organizationName, additionalData.nmbrsCreated)
  } else {
    finalTemplate = template(organizationName)
  }
  
  try {
    // Import Resend dynamically to avoid build issues
    const { Resend } = await import('resend')
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@thenmbr.com', // Using verified domain
      to: [email],
      subject: finalTemplate.subject,
      html: finalTemplate.html,
      text: finalTemplate.text,
      tags: [
        { name: 'email-type', value: 'trial-sequence' },
        { name: 'template-type', value: templateType },
        { name: 'organization', value: organizationName.replace(/\s+/g, '-').toLowerCase() }
      ]
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return {
      success: true,
      messageId: data?.id || `trial-${templateType}-${Date.now()}`
    }
  } catch (error) {
    console.error('Trial email error:', error)
    throw error
  }
}
