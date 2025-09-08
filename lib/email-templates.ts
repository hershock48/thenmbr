// Professional Email Templates for NMBR Platform
// These templates are designed to keep subscribers engaged with their specific stories
// Enhanced with v0 design principles for maximum engagement and professional appearance

export interface StoryUpdateData {
  storyTitle: string
  storyCode: string
  progress: number
  raised: number
  goal: number
  recentUpdate: string
  organizationName: string
  organizationWebsite: string
  subscriberName: string
  unsubscribeUrl: string
  donationUrl: string
  storyImageUrl?: string
}

export interface MilestoneData {
  storyTitle: string
  storyCode: string
  milestone: string
  achievement: string
  organizationName: string
  subscriberName: string
  unsubscribeUrl: string
  donationUrl: string
  storyImageUrl?: string
}

export interface CompletionData {
  storyTitle: string
  storyCode: string
  finalAmount: number
  impact: string
  organizationName: string
  subscriberName: string
  unsubscribeUrl: string
  newStoryUrl: string
  storyImageUrl?: string
}

// Weekly Story Update Template
export function generateStoryUpdateEmail(data: StoryUpdateData) {
  const progressPercentage = Math.round((data.raised / data.goal) * 100)
  const remaining = data.goal - data.raised

  return {
    subject: `📈 ${data.storyTitle} - ${progressPercentage}% Complete!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Story Update - ${data.storyTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .progress-bar { background: #e5e7eb; height: 12px; border-radius: 6px; overflow: hidden; margin: 20px 0; }
          .progress-fill { background: linear-gradient(90deg, #0891b2, #7c3aed); height: 100%; transition: width 0.3s ease; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .stats { display: flex; justify-content: space-around; margin: 30px 0; }
          .stat { text-align: center; }
          .stat-number { font-size: 24px; font-weight: bold; color: #0891b2; }
          .stat-label { font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Your Story Update</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">NMBR #${data.storyCode}</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 10px;">Hi ${data.subscriberName}! 👋</h2>
            <p style="font-size: 18px; color: #4b5563; margin-bottom: 30px;">
              Great news! <strong>${data.storyTitle}</strong> has reached <strong>${progressPercentage}%</strong> of its goal!
            </p>

            ${data.storyImageUrl ? `<img src="${data.storyImageUrl}" alt="${data.storyTitle}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin: 20px 0;">` : ''}

            <div class="highlight">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">📢 Latest Update</h3>
              <p style="margin: 0; color: #78350f;">${data.recentUpdate}</p>
            </div>

            <div class="stats">
              <div class="stat">
                <div class="stat-number">$${data.raised.toLocaleString()}</div>
                <div class="stat-label">Raised</div>
              </div>
              <div class="stat">
                <div class="stat-number">$${remaining.toLocaleString()}</div>
                <div class="stat-label">To Go</div>
              </div>
              <div class="stat">
                <div class="stat-number">${progressPercentage}%</div>
                <div class="stat-label">Complete</div>
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${data.donationUrl}" class="cta-button">Help Complete This Story</a>
            </p>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Your support is making a real difference. Thank you for being part of this story! 💙
            </p>
          </div>

          <div class="footer">
            <p>This email was sent because you're following <strong>${data.storyTitle}</strong> (NMBR #${data.storyCode})</p>
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${(data as any).organizationWebsite || '#'}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${data.subscriberName}!

Great news! ${data.storyTitle} has reached ${progressPercentage}% of its goal!

LATEST UPDATE:
${data.recentUpdate}

PROGRESS:
- Raised: $${data.raised.toLocaleString()}
- To Go: $${remaining.toLocaleString()}
- Complete: ${progressPercentage}%

Help complete this story: ${data.donationUrl}

This email was sent because you're following ${data.storyTitle} (NMBR #${data.storyCode})
Unsubscribe: ${data.unsubscribeUrl}
    `
  }
}

// Milestone Achievement Template
export function generateMilestoneEmail(data: MilestoneData) {
  return {
    subject: `🎉 Milestone Reached! ${data.storyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Milestone Achievement - ${data.storyTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .celebration { background: #fef3c7; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #f59e0b; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">🎉 MILESTONE ACHIEVED!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">NMBR #${data.storyCode}</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 10px;">Congratulations ${data.subscriberName}! 🎊</h2>
            
            <div class="celebration">
              <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 24px;">${data.milestone}</h3>
              <p style="margin: 0; color: #78350f; font-size: 18px; font-weight: 600;">${data.achievement}</p>
            </div>

            <p style="font-size: 18px; color: #4b5563; text-align: center; margin: 30px 0;">
              Your support helped make this possible! This is a huge step forward for <strong>${data.storyTitle}</strong>.
            </p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${data.donationUrl}" class="cta-button">Continue Supporting This Story</a>
            </p>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Thank you for being part of this incredible journey! 🌟
            </p>
          </div>

          <div class="footer">
            <p>This email was sent because you're following <strong>${data.storyTitle}</strong> (NMBR #${data.storyCode})</p>
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${(data as any).organizationWebsite || '#'}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
🎉 MILESTONE ACHIEVED!

Congratulations ${data.subscriberName}!

${data.milestone}
${data.achievement}

Your support helped make this possible! This is a huge step forward for ${data.storyTitle}.

Continue supporting this story: ${data.donationUrl}

This email was sent because you're following ${data.storyTitle} (NMBR #${data.storyCode})
Unsubscribe: ${data.unsubscribeUrl}
    `
  }
}

// Story Completion Template
export function generateCompletionEmail(data: CompletionData) {
  return {
    subject: `✅ Story Complete! ${data.storyTitle} - Mission Accomplished`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Story Complete - ${data.storyTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .success { background: #d1fae5; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #10b981; }
          .impact { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">✅ MISSION ACCOMPLISHED!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">NMBR #${data.storyCode}</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 10px;">Amazing work ${data.subscriberName}! 🎊</h2>
            
            <div class="success">
              <h3 style="margin: 0 0 10px 0; color: #047857; font-size: 24px;">${data.storyTitle} is COMPLETE!</h3>
              <p style="margin: 0; color: #065f46; font-size: 18px; font-weight: 600;">We raised $${data.finalAmount.toLocaleString()} together!</p>
            </div>

            <div class="impact">
              <h4 style="margin: 0 0 10px 0; color: #0c4a6e;">🌟 The Impact You Made:</h4>
              <p style="margin: 0; color: #075985;">${data.impact}</p>
            </div>

            <p style="font-size: 18px; color: #4b5563; text-align: center; margin: 30px 0;">
              Thank you for being part of this incredible journey. Your support made this story possible!
            </p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${data.newStoryUrl}" class="cta-button">Support Another Story</a>
            </p>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              You can unsubscribe from this story since it's now complete, or continue following for impact updates! 💙
            </p>
          </div>

          <div class="footer">
            <p>This email was sent because you followed <strong>${data.storyTitle}</strong> (NMBR #${data.storyCode})</p>
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${(data as any).organizationWebsite || '#'}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
✅ MISSION ACCOMPLISHED!

Amazing work ${data.subscriberName}!

${data.storyTitle} is COMPLETE!
We raised $${data.finalAmount.toLocaleString()} together!

🌟 The Impact You Made:
${data.impact}

Thank you for being part of this incredible journey. Your support made this story possible!

Support another story: ${data.newStoryUrl}

This email was sent because you followed ${data.storyTitle} (NMBR #${data.storyCode})
Unsubscribe: ${data.unsubscribeUrl}
    `
  }
}

// Welcome Email for New Subscribers
export function generateWelcomeEmail(data: StoryUpdateData) {
  return {
    subject: `Welcome to ${data.storyTitle}! You're now part of the story 💙`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome - ${data.storyTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .welcome { background: #f0f9ff; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #0ea5e9; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Welcome to the Story! 💙</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">NMBR #${data.storyCode}</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 10px;">Hi ${data.subscriberName}! 👋</h2>
            
            <div class="welcome">
              <h3 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 20px;">You're now following ${data.storyTitle}</h3>
              <p style="margin: 0; color: #075985;">Thank you for joining this journey! You'll receive updates about this specific story's progress.</p>
            </div>

            <p style="font-size: 16px; color: #4b5563; margin: 30px 0;">
              We'll send you:
            </p>
            <ul style="color: #4b5563; font-size: 16px;">
              <li>📈 Progress updates on your story</li>
              <li>📸 Photos and videos showing impact</li>
              <li>🎉 Milestone celebrations</li>
              <li>✅ Completion notifications</li>
            </ul>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${data.donationUrl}" class="cta-button">Support This Story Now</a>
            </p>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              You can unsubscribe anytime. We only send updates about stories you're following! 💙
            </p>
          </div>

          <div class="footer">
            <p>This email was sent because you subscribed to <strong>${data.storyTitle}</strong> (NMBR #${data.storyCode})</p>
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${(data as any).organizationWebsite || '#'}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to the Story! 💙

Hi ${data.subscriberName}!

You're now following ${data.storyTitle}
Thank you for joining this journey! You'll receive updates about this specific story's progress.

We'll send you:
- Progress updates on your story
- Photos and videos showing impact
- Milestone celebrations
- Completion notifications

Support this story now: ${data.donationUrl}

You can unsubscribe anytime. We only send updates about stories you're following! 💙

This email was sent because you subscribed to ${data.storyTitle} (NMBR #${data.storyCode})
Unsubscribe: ${data.unsubscribeUrl}
    `
  }
}

// Welcome Series Templates
export interface WelcomeSeriesData {
  subscriberName: string
  organizationName: string
  organizationWebsite: string
  storyTitle: string
  storyCode: string
  storyImageUrl?: string
  unsubscribeUrl: string
  dashboardUrl: string
}

// Welcome Email #1 - Introduction
export function generateWelcomeEmail1(data: WelcomeSeriesData) {
  return {
    subject: `🎉 Welcome to ${data.organizationName}'s Impact Stories!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Impact Stories</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 50px 30px; text-align: center; position: relative; }
          .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); }
          .content { padding: 50px 30px; }
          .welcome-icon { width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 25px 0; transition: transform 0.2s ease; }
          .cta-button:hover { transform: translateY(-2px); }
          .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; }
          .feature { text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; }
          .feature-icon { width: 50px; height: 50px; background: linear-gradient(135deg, #0891b2, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 24px; }
          .footer { background: #f8fafc; padding: 40px 30px; text-align: center; font-size: 14px; color: #6b7280; }
          .social-links { margin: 20px 0; }
          .social-links a { display: inline-block; margin: 0 10px; padding: 10px; background: white; border-radius: 8px; text-decoration: none; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="welcome-icon">🎉</div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Welcome to Impact Stories!</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">You're now part of something amazing</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Hi ${data.subscriberName}! 👋</h2>
            <p style="font-size: 18px; color: #4b5563; margin-bottom: 30px; line-height: 1.7;">
              Welcome to <strong>${data.organizationName}</strong>'s impact stories! You've just joined a community of changemakers who are making a real difference in the world.
            </p>

            <div class="feature-grid">
              <div class="feature">
                <div class="feature-icon">📱</div>
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">Follow Your Story</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Get updates on the specific story you're supporting</p>
              </div>
              <div class="feature">
                <div class="feature-icon">💝</div>
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">Make an Impact</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">See exactly how your support is changing lives</p>
              </div>
              <div class="feature">
                <div class="feature-icon">📊</div>
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">Track Progress</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Watch as your story reaches its goals</p>
              </div>
              <div class="feature">
                <div class="feature-icon">🌟</div>
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">Celebrate Wins</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Be the first to know when milestones are reached</p>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #f0f9ff, #faf5ff); padding: 30px; border-radius: 16px; margin: 40px 0; text-align: center; border: 1px solid #e0e7ff;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">Your Story: ${data.storyTitle}</h3>
              <p style="margin: 0 0 20px 0; color: #4b5563;">NMBR #${data.storyCode}</p>
              <a href="${data.dashboardUrl}" class="cta-button">View Your Story</a>
            </div>

            <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 40px 0 20px 0;">
              Thank you for choosing to make a difference. Together, we're creating a better world, one story at a time. 💙
            </p>
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </div>
            <p>This email was sent to you because you subscribed to ${data.storyTitle} (NMBR #${data.storyCode})</p>
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${data.organizationWebsite}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to ${data.organizationName}'s Impact Stories!

Hi ${data.subscriberName}!

Welcome to ${data.organizationName}'s impact stories! You've just joined a community of changemakers who are making a real difference in the world.

Your Story: ${data.storyTitle} (NMBR #${data.storyCode})

What you can expect:
- Follow your specific story and get regular updates
- See exactly how your support is making an impact
- Track progress as your story reaches its goals
- Celebrate when milestones are reached

View your story: ${data.dashboardUrl}

Thank you for choosing to make a difference. Together, we're creating a better world, one story at a time.

This email was sent because you subscribed to ${data.storyTitle} (NMBR #${data.storyCode})
Unsubscribe: ${data.unsubscribeUrl}
    `
  }
}

// Donation Receipt Template
export interface DonationReceiptData {
  donorName: string
  donationAmount: number
  storyTitle: string
  storyCode: string
  organizationName: string
  organizationEIN: string
  donationDate: string
  transactionId: string
  taxDeductible: boolean
  unsubscribeUrl: string
  newStoryUrl: string
}

export function generateDonationReceipt(data: DonationReceiptData) {
  return {
    subject: `🎉 Thank you! Your donation receipt for ${data.storyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Donation Receipt</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .receipt-box { background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 30px; margin: 30px 0; }
          .amount { font-size: 36px; font-weight: 700; color: #059669; margin: 10px 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #0891b2, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; }
          .tax-info { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
            <h1 style="margin: 0; font-size: 28px;">Thank You for Your Generosity!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your donation is already making a difference</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${data.donorName}! 👋</h2>
            <p style="font-size: 18px; color: #4b5563; margin-bottom: 30px;">
              Thank you for your generous donation to <strong>${data.storyTitle}</strong>. Your support is directly helping to make this story a reality.
            </p>

            <div class="receipt-box">
              <h3 style="margin: 0 0 20px 0; color: #059669; text-align: center;">DONATION RECEIPT</h3>
              <div style="text-align: center;">
                <div class="amount">$${data.donationAmount.toLocaleString()}</div>
                <p style="margin: 0; color: #6b7280;">Donated to ${data.storyTitle}</p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">NMBR #${data.storyCode}</p>
              </div>
              <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #bbf7d0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Date:</span>
                  <span>${new Date(data.donationDate).toLocaleDateString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Transaction ID:</span>
                  <span style="font-family: monospace;">${data.transactionId}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Organization:</span>
                  <span>${data.organizationName}</span>
                </div>
              </div>
            </div>

            ${data.taxDeductible ? `
            <div class="tax-info">
              <h4 style="margin: 0 0 10px 0; color: #92400e;">📋 Tax Deductible Donation</h4>
              <p style="margin: 0; color: #78350f; font-size: 14px;">
                This donation is tax-deductible. ${data.organizationName} is a 501(c)(3) organization (EIN: ${data.organizationEIN}). 
                Please keep this receipt for your tax records.
              </p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 40px 0;">
              <h3 style="color: #1f2937; margin-bottom: 15px;">What happens next?</h3>
              <p style="color: #6b7280; margin-bottom: 25px;">
                You'll receive regular updates on how your donation is being used to help complete this story.
              </p>
              <a href="${data.newStoryUrl}" class="cta-button">Explore More Stories</a>
            </div>

            <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 40px 0 20px 0;">
              Your generosity is changing lives. Thank you for being part of this story! 💙
            </p>
          </div>

          <div class="footer">
            <p>This receipt was sent to ${data.donorName} for their donation to ${data.storyTitle}</p>
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from updates</a> | <a href="#" style="color: #6b7280;">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Thank You for Your Generosity!

Hi ${data.donorName}!

Thank you for your generous donation to ${data.storyTitle}. Your support is directly helping to make this story a reality.

DONATION RECEIPT
Amount: $${data.donationAmount.toLocaleString()}
Donated to: ${data.storyTitle} (NMBR #${data.storyCode})
Date: ${new Date(data.donationDate).toLocaleDateString()}
Transaction ID: ${data.transactionId}
Organization: ${data.organizationName}

${data.taxDeductible ? `This donation is tax-deductible. ${data.organizationName} is a 501(c)(3) organization (EIN: ${data.organizationEIN}). Please keep this receipt for your tax records.` : ''}

What happens next?
You'll receive regular updates on how your donation is being used to help complete this story.

Explore more stories: ${data.newStoryUrl}

Your generosity is changing lives. Thank you for being part of this story!

This receipt was sent to ${data.donorName} for their donation to ${data.storyTitle}
Unsubscribe: ${data.unsubscribeUrl}
    `
  }
}
