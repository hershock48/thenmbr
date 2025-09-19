// Email Templates for NMBR Platform
// These templates are designed to keep subscribers engaged with their specific stories

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
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${data.organizationWebsite}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
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
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${data.organizationWebsite}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
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
              <h3 style="margin: 0 0 10px 0; color: #0c4a6e;">🌟 The Impact You Made:</h3>
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
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${data.organizationWebsite}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
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
            <p><a href="${data.unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from this story</a> | <a href="${data.organizationWebsite}" style="color: #6b7280;">Visit ${data.organizationName}</a></p>
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
