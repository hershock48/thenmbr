/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Bundle analyzer (uncomment to analyze bundle)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },

  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Tree shaking for better dead code elimination
      config.optimization.usedExports = true
      config.optimization.sideEffects = false

      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: "ui",
            chunks: "all",
            priority: 20,
          },
          dashboard: {
            test: /[\\/]components[\\/]dashboard[\\/]/,
            name: "dashboard",
            chunks: "all",
            priority: 30,
          },
        },
      }
    }

    return config
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=60",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/dashboard/newsletter",
        destination: "/dashboard/newsletters",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
