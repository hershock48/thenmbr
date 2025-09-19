/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security configurations
  poweredByHeader: false,
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent XSS attacks
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
              "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()'
            ].join(', ')
          },
          
          // HSTS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          
          // Cross-Origin policies
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },
          
          // Additional security headers
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          }
        ]
      },
      
      // API routes specific headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      },
      
      // Static assets headers
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      
      // Images headers
      {
        source: '/(.*\\.(jpg|jpeg|png|gif|webp|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000'
          }
        ]
      }
    ]
  },
  
  // Redirects for security
  async redirects() {
    return [
      // Redirect HTTP to HTTPS in production
      ...(process.env.NODE_ENV === 'production' ? [
        {
          source: '/(.*)',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http'
            }
          ],
          destination: 'https://nmbr-platform.com/:path*',
          permanent: true
        }
      ] : []),
      
      // Redirect www to non-www
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.nmbr-platform.com'
          }
        ],
        destination: 'https://nmbr-platform.com/:path*',
        permanent: true
      }
    ]
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack security configurations
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in production for security
    if (!dev) {
      config.devtool = false
    }
    
    // Add security plugins
    config.plugins.push(
      // Add any security-related webpack plugins here
    )
    
    return config
  },
  
  // Experimental security features
  experimental: {
    // Enable server components
    serverComponents: true,
    
    // Enable middleware
    middleware: true
  }
}

module.exports = nextConfig
