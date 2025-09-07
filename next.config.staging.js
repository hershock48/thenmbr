/** @type {import('next').NextConfig} */
const nextConfig = {
  // Staging-specific configuration
  env: {
    APP_ENV: 'staging',
    APP_NAME: 'NMBR Platform (Staging)',
    APP_VERSION: '1.0.0-staging'
  },

  // Enable experimental features for staging
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    optimizeCss: true,
    optimizePackageImports: ['@supabase/supabase-js', 'stripe']
  },

  // Staging-specific build configuration
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
  compress: true,

  // Image optimization for staging
  images: {
    domains: [
      'staging.nmbrplatform.com',
      'cdn-staging.nmbrplatform.com',
      'your-staging-project.supabase.co',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Staging-specific headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-Environment',
            value: 'staging'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          },
          {
            key: 'X-Environment',
            value: 'staging'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // Staging-specific redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false
      },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false
      }
    ]
  },

  // Staging-specific rewrites
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health'
      },
      {
        source: '/staging-debug',
        destination: '/api/debug/staging'
      }
    ]
  },

  // Webpack configuration for staging
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Staging-specific webpack optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all'
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            priority: 10,
            chunks: 'all'
          },
          stripe: {
            test: /[\\/]node_modules[\\/]stripe[\\/]/,
            name: 'stripe',
            priority: 10,
            chunks: 'all'
          }
        }
      }
    }

    // Add staging-specific plugins
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.APP_ENV': JSON.stringify('staging'),
        'process.env.DEBUG_MODE': JSON.stringify(true),
        'process.env.PROFILING_ENABLED': JSON.stringify(true)
      })
    )

    return config
  },

  // Staging-specific compiler options
  compiler: {
    removeConsole: false, // Keep console logs in staging
    styledComponents: true
  },

  // Staging-specific TypeScript configuration
  typescript: {
    ignoreBuildErrors: false, // Show TypeScript errors in staging
    tsconfigPath: './tsconfig.staging.json'
  },

  // Staging-specific ESLint configuration
  eslint: {
    ignoreDuringBuilds: false, // Show ESLint errors in staging
    dirs: ['pages', 'components', 'lib', 'app']
  },

  // Staging-specific performance configuration
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2
  },

  // Staging-specific development configuration
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right'
  },

  // Staging-specific logging
  logging: {
    fetches: {
      fullUrl: true
    }
  },

  // Staging-specific security configuration
  security: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
        connectSrc: ["'self'", "https://api.stripe.com", "https://*.supabase.co"],
        frameSrc: ["'self'", "https://js.stripe.com", "https://checkout.stripe.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  }
}

module.exports = nextConfig
