// Professional Newsletter Templates for NMBR Platform
// These templates provide Mailchimp/Squarespace-level customization

export interface NewsletterTheme {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant'
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    textLight: string
    border: string
  }
  fonts: {
    heading: string
    body: string
    button: string
  }
  layout: {
    headerStyle: 'centered' | 'left' | 'right'
    contentWidth: 'narrow' | 'medium' | 'wide'
    buttonStyle: 'rounded' | 'square' | 'pill'
    imageStyle: 'rounded' | 'square' | 'circle'
  }
}

export interface NewsletterBlock {
  id: string
  type: 'header' | 'text' | 'image' | 'button' | 'progress' | 'story' | 'spacer' | 'divider'
  content: any
  styling: any
  order: number
}

export interface NewsletterTemplate {
  id: string
  name: string
  description: string
  theme: NewsletterTheme
  blocks: NewsletterBlock[]
  isDefault: boolean
}

// Professional Themes
export const newsletterThemes: NewsletterTheme[] = [
  {
    id: 'modern-cyan',
    name: 'Modern Cyan',
    description: 'Clean, modern design with cyan accents',
    category: 'modern',
    preview: '/themes/modern-cyan-preview.jpg',
    colors: {
      primary: '#0891b2',
      secondary: '#7c3aed',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
      textLight: '#6b7280',
      border: '#e5e7eb'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      button: 'Inter, sans-serif'
    },
    layout: {
      headerStyle: 'centered',
      contentWidth: 'medium',
      buttonStyle: 'rounded',
      imageStyle: 'rounded'
    }
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Sophisticated design with purple gradients',
    category: 'elegant',
    preview: '/themes/elegant-purple-preview.jpg',
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#10b981',
      background: '#fafafa',
      text: '#1f2937',
      textLight: '#6b7280',
      border: '#d1d5db'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, sans-serif',
      button: 'Inter, sans-serif'
    },
    layout: {
      headerStyle: 'centered',
      contentWidth: 'narrow',
      buttonStyle: 'pill',
      imageStyle: 'rounded'
    }
  },
  {
    id: 'bold-orange',
    name: 'Bold Orange',
    description: 'High-energy design with bold orange accents',
    category: 'bold',
    preview: '/themes/bold-orange-preview.jpg',
    colors: {
      primary: '#f97316',
      secondary: '#dc2626',
      accent: '#059669',
      background: '#ffffff',
      text: '#1f2937',
      textLight: '#6b7280',
      border: '#f3f4f6'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif',
      button: 'Poppins, sans-serif'
    },
    layout: {
      headerStyle: 'left',
      contentWidth: 'wide',
      buttonStyle: 'square',
      imageStyle: 'square'
    }
  },
  {
    id: 'minimal-green',
    name: 'Minimal Green',
    description: 'Clean, minimal design with green accents',
    category: 'minimal',
    preview: '/themes/minimal-green-preview.jpg',
    colors: {
      primary: '#059669',
      secondary: '#0891b2',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#374151',
      textLight: '#9ca3af',
      border: '#e5e7eb'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      button: 'Inter, sans-serif'
    },
    layout: {
      headerStyle: 'centered',
      contentWidth: 'medium',
      buttonStyle: 'rounded',
      imageStyle: 'rounded'
    }
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Professional, trustworthy design',
    category: 'classic',
    preview: '/themes/classic-blue-preview.jpg',
    colors: {
      primary: '#1e40af',
      secondary: '#7c2d12',
      accent: '#dc2626',
      background: '#f8fafc',
      text: '#1e293b',
      textLight: '#64748b',
      border: '#cbd5e1'
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Source Sans Pro, sans-serif',
      button: 'Source Sans Pro, sans-serif'
    },
    layout: {
      headerStyle: 'centered',
      contentWidth: 'medium',
      buttonStyle: 'rounded',
      imageStyle: 'rounded'
    }
  }
]

// Pre-built Newsletter Templates
export const newsletterTemplates: NewsletterTemplate[] = [
  {
    id: 'story-update-modern',
    name: 'Story Progress Update',
    description: 'Perfect for weekly story progress updates',
    theme: newsletterThemes[0], // Modern Cyan
    isDefault: true,
    blocks: [
      {
        id: 'header-1',
        type: 'header',
        order: 1,
        content: {
          title: '{STORY_TITLE}',
          subtitle: 'Your Impact Story Update',
          logo: '{ORGANIZATION_LOGO}',
          logoText: '{ORGANIZATION_NAME}'
        },
        styling: {
          backgroundColor: '#0891b2',
          textColor: '#ffffff',
          padding: '40px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 'greeting-1',
        type: 'text',
        order: 2,
        content: {
          text: 'Hi {SUBSCRIBER_NAME}! 👋<br><br>Great news! <strong>{STORY_TITLE}</strong> has reached <strong>{PROGRESS_PERCENTAGE}%</strong> of its goal!'
        },
        styling: {
          fontSize: '18px',
          lineHeight: '1.6',
          padding: '30px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 'image-1',
        type: 'image',
        order: 3,
        content: {
          src: '{STORY_IMAGE}',
          alt: '{STORY_TITLE}',
          caption: 'Your impact in action'
        },
        styling: {
          width: '100%',
          borderRadius: '12px',
          margin: '20px 0'
        }
      },
      {
        id: 'progress-1',
        type: 'progress',
        order: 4,
        content: {
          raised: '{RAISED_AMOUNT}',
          goal: '{GOAL_AMOUNT}',
          percentage: '{PROGRESS_PERCENTAGE}',
          remaining: '{REMAINING_AMOUNT}'
        },
        styling: {
          backgroundColor: '#f0f9ff',
          border: '2px solid #0891b2',
          borderRadius: '12px',
          padding: '25px',
          margin: '25px 0'
        }
      },
      {
        id: 'update-1',
        type: 'text',
        order: 5,
        content: {
          text: '<h3>📢 Latest Update</h3><p>{CUSTOM_MESSAGE}</p>'
        },
        styling: {
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '8px',
          padding: '20px',
          margin: '25px 0'
        }
      },
      {
        id: 'button-1',
        type: 'button',
        order: 6,
        content: {
          text: 'Help Complete This Story',
          url: '{DONATION_URL}',
          style: 'primary'
        },
        styling: {
          backgroundColor: '#0891b2',
          textColor: '#ffffff',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          margin: '30px 0'
        }
      },
      {
        id: 'footer-1',
        type: 'text',
        order: 7,
        content: {
          text: '<p style="text-align: center; color: #6b7280; font-size: 14px;">Thank you for being part of this story! 💙<br><br><a href="{UNSUBSCRIBE_URL}">Unsubscribe from this story</a> | <a href="{ORGANIZATION_WEBSITE}">Visit {ORGANIZATION_NAME}</a></p>'
        },
        styling: {
          padding: '30px 20px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e5e7eb'
        }
      }
    ]
  },
  {
    id: 'milestone-celebration',
    name: 'Milestone Celebration',
    description: 'Perfect for celebrating major achievements',
    theme: newsletterThemes[1], // Elegant Purple
    isDefault: false,
    blocks: [
      {
        id: 'header-2',
        type: 'header',
        order: 1,
        content: {
          title: '🎉 MILESTONE ACHIEVED!',
          subtitle: '{STORY_TITLE}',
          logo: '{ORGANIZATION_LOGO}',
          logoText: '{ORGANIZATION_NAME}'
        },
        styling: {
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          textColor: '#ffffff',
          padding: '50px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 'celebration-2',
        type: 'text',
        order: 2,
        content: {
          text: '<h2>Congratulations {SUBSCRIBER_NAME}! 🎊</h2><div style="background: #fef3c7; padding: 25px; border-radius: 12px; border: 2px solid #f59e0b; text-align: center; margin: 30px 0;"><h3 style="color: #92400e; font-size: 24px; margin: 0 0 10px 0;">{MILESTONE_TITLE}</h3><p style="color: #78350f; font-size: 18px; font-weight: 600; margin: 0;">{MILESTONE_DESCRIPTION}</p></div>'
        },
        styling: {
          fontSize: '18px',
          lineHeight: '1.6',
          padding: '30px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 'image-2',
        type: 'image',
        order: 3,
        content: {
          src: '{STORY_IMAGE}',
          alt: '{STORY_TITLE}',
          caption: 'Your impact in action'
        },
        styling: {
          width: '100%',
          borderRadius: '16px',
          margin: '30px 0'
        }
      },
      {
        id: 'button-2',
        type: 'button',
        order: 4,
        content: {
          text: 'Continue Supporting This Story',
          url: '{DONATION_URL}',
          style: 'primary'
        },
        styling: {
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          textColor: '#ffffff',
          padding: '18px 35px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          margin: '30px 0'
        }
      },
      {
        id: 'footer-2',
        type: 'text',
        order: 5,
        content: {
          text: '<p style="text-align: center; color: #6b7280; font-size: 14px;">Thank you for being part of this incredible journey! 🌟<br><br><a href="{UNSUBSCRIBE_URL}">Unsubscribe from this story</a> | <a href="{ORGANIZATION_WEBSITE}">Visit {ORGANIZATION_NAME}</a></p>'
        },
        styling: {
          padding: '30px 20px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e5e7eb'
        }
      }
    ]
  },
  {
    id: 'story-completion',
    name: 'Story Completion',
    description: 'Perfect for celebrating completed stories',
    theme: newsletterThemes[2], // Bold Orange
    isDefault: false,
    blocks: [
      {
        id: 'header-3',
        type: 'header',
        order: 1,
        content: {
          title: '✅ MISSION ACCOMPLISHED!',
          subtitle: '{STORY_TITLE}',
          logo: '{ORGANIZATION_LOGO}',
          logoText: '{ORGANIZATION_NAME}'
        },
        styling: {
          background: 'linear-gradient(135deg, #f97316, #dc2626)',
          textColor: '#ffffff',
          padding: '50px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 'success-3',
        type: 'text',
        order: 2,
        content: {
          text: '<h2>Amazing work {SUBSCRIBER_NAME}! 🎊</h2><div style="background: #d1fae5; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #10b981;"><h3 style="color: #047857; font-size: 24px; margin: 0 0 10px 0;">{STORY_TITLE} is COMPLETE!</h3><p style="color: #065f46; font-size: 18px; font-weight: 600; margin: 0;">We raised ${FINAL_AMOUNT} together!</p></div>'
        },
        styling: {
          fontSize: '18px',
          lineHeight: '1.6',
          padding: '30px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 'impact-3',
        type: 'text',
        order: 3,
        content: {
          text: '<div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;"><h3 style="margin: 0 0 10px 0; color: #0c4a6e;">🌟 The Impact You Made:</h3><p style="margin: 0; color: #075985;">{IMPACT_DESCRIPTION}</p></div>'
        },
        styling: {
          padding: '0 20px'
        }
      },
      {
        id: 'image-3',
        type: 'image',
        order: 4,
        content: {
          src: '{STORY_IMAGE}',
          alt: '{STORY_TITLE}',
          caption: 'Mission accomplished!'
        },
        styling: {
          width: '100%',
          borderRadius: '12px',
          margin: '30px 0'
        }
      },
      {
        id: 'button-3',
        type: 'button',
        order: 5,
        content: {
          text: 'Support Another Story',
          url: '{NEW_STORY_URL}',
          style: 'primary'
        },
        styling: {
          background: 'linear-gradient(135deg, #f97316, #dc2626)',
          textColor: '#ffffff',
          padding: '18px 35px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          margin: '30px 0'
        }
      },
      {
        id: 'footer-3',
        type: 'text',
        order: 6,
        content: {
          text: '<p style="text-align: center; color: #6b7280; font-size: 14px;">You can unsubscribe from this story since it\'s now complete, or continue following for impact updates! 💙<br><br><a href="{UNSUBSCRIBE_URL}">Unsubscribe from this story</a> | <a href="{ORGANIZATION_WEBSITE}">Visit {ORGANIZATION_NAME}</a></p>'
        },
        styling: {
          padding: '30px 20px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e5e7eb'
        }
      }
    ]
  }
]

// Generate HTML from template
export function generateNewsletterHTML(template: NewsletterTemplate, data: any): string {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${template.name}</title>
      <style>
        body { 
          font-family: ${template.theme.fonts.body}; 
          line-height: 1.6; 
          color: ${template.theme.colors.text}; 
          margin: 0; 
          padding: 0; 
          background-color: ${template.theme.colors.background}; 
        }
        .container { 
          max-width: ${template.layout.contentWidth === 'narrow' ? '600px' : template.layout.contentWidth === 'wide' ? '800px' : '700px'}; 
          margin: 0 auto; 
          background: white; 
        }
        .block { margin: 0; }
        .button { 
          display: inline-block; 
          text-decoration: none; 
          font-family: ${template.theme.fonts.button};
          font-weight: 600;
        }
        .progress-bar { 
          background: #e5e7eb; 
          height: 12px; 
          border-radius: 6px; 
          overflow: hidden; 
        }
        .progress-fill { 
          background: linear-gradient(90deg, ${template.theme.colors.primary}, ${template.theme.colors.secondary}); 
          height: 100%; 
          transition: width 0.3s ease; 
        }
        @media (max-width: 600px) {
          .container { max-width: 100%; }
          .block { padding: 15px !important; }
        }
      </style>
    </head>
    <body>
      <div class="container">
  `

  // Process each block
  template.blocks
    .sort((a, b) => a.order - b.order)
    .forEach(block => {
      html += generateBlockHTML(block, data, template.theme)
    })

  html += `
      </div>
    </body>
    </html>
  `

  return html
}

function generateBlockHTML(block: NewsletterBlock, data: any, theme: NewsletterTheme): string {
  const content = replacePlaceholders(block.content, data)
  const styling = block.styling || {}

  switch (block.type) {
    case 'header':
      return `
        <div class="block" style="${generateInlineStyles(styling)}">
          <h1 style="margin: 0; font-family: ${theme.fonts.heading}; font-size: 28px;">${content.title}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${content.subtitle}</p>
        </div>
      `

    case 'text':
      return `
        <div class="block" style="${generateInlineStyles(styling)}">
          ${content.text}
        </div>
      `

    case 'image':
      return `
        <div class="block" style="${generateInlineStyles(styling)}">
          <img src="${content.src}" alt="${content.alt}" style="width: 100%; height: auto; border-radius: ${theme.layout.imageStyle === 'circle' ? '50%' : theme.layout.imageStyle === 'square' ? '0' : '12px'};" />
          ${content.caption ? `<p style="text-align: center; font-size: 14px; color: ${theme.colors.textLight}; margin: 10px 0 0 0;">${content.caption}</p>` : ''}
        </div>
      `

    case 'button':
      return `
        <div class="block" style="${generateInlineStyles(styling)}">
          <a href="${content.url}" class="button" style="
            background: ${content.style === 'primary' ? theme.colors.primary : theme.colors.secondary};
            color: white;
            padding: 15px 30px;
            border-radius: ${theme.layout.buttonStyle === 'pill' ? '25px' : theme.layout.buttonStyle === 'square' ? '0' : '8px'};
            text-decoration: none;
            display: inline-block;
          ">${content.text}</a>
        </div>
      `

    case 'progress':
      const percentage = Math.round((parseFloat(content.raised.replace(/[^0-9.]/g, '')) / parseFloat(content.goal.replace(/[^0-9.]/g, ''))) * 100)
      return `
        <div class="block" style="${generateInlineStyles(styling)}">
          <div style="display: flex; justify-content: space-around; margin: 20px 0;">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: ${theme.colors.primary};">${content.raised}</div>
              <div style="font-size: 14px; color: ${theme.colors.textLight};">Raised</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: ${theme.colors.primary};">${content.remaining}</div>
              <div style="font-size: 14px; color: ${theme.colors.textLight};">To Go</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: ${theme.colors.primary};">${percentage}%</div>
              <div style="font-size: 14px; color: ${theme.colors.textLight};">Complete</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%;"></div>
          </div>
        </div>
      `

    case 'spacer':
      return `
        <div class="block" style="height: ${content.height || '30px'};"></div>
      `

    case 'divider':
      return `
        <div class="block" style="border-top: 1px solid ${theme.colors.border}; margin: 30px 0;"></div>
      `

    default:
      return ''
  }
}

function replacePlaceholders(content: any, data: any): any {
  if (typeof content === 'string') {
    return content.replace(/\{([^}]+)\}/g, (match, key) => {
      return data[key] || match
    })
  } else if (typeof content === 'object' && content !== null) {
    const result: any = {}
    for (const [key, value] of Object.entries(content)) {
      result[key] = replacePlaceholders(value, data)
    }
    return result
  }
  return content
}

function generateInlineStyles(styles: any): string {
  return Object.entries(styles)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ')
}
