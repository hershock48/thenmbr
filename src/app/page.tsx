import Link from "next/link"
import { Heart, Users, Zap, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Donors with Impact Stories
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The NMBR Widget Platform helps nonprofits create personalized donor experiences 
            through beautiful, branded widgets that showcase individual impact stories.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/demo"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Demo
            </Link>
            <Link
              href="/widget?org=550e8400-e29b-41d4-a716-446655440000&type=story-search"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Try Widget
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Stories</h3>
              <p className="text-gray-600">
                Each NMBR connects donors to a specific individual's story, creating 
                a personal connection that drives engagement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Integration</h3>
              <p className="text-gray-600">
                Simple copy-paste widgets that seamlessly integrate with any nonprofit's 
                website and branding.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Powerful Features</h3>
              <p className="text-gray-600">
                Donation processing, email segmentation, analytics, and more - 
                all in one platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Preview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            See It In Action
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Story Search Widget</h3>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-4">Search for a NMBR to see a story</p>
                <div className="bg-white rounded border p-3 mb-4">
                  <input 
                    type="text" 
                    placeholder="Enter NMBR code..." 
                    className="w-full text-center border-none outline-none"
                    disabled
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm" disabled>
                  Search
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Donation Widget</h3>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-4">Quick donation options</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="bg-blue-600 text-white py-2 rounded text-sm" disabled>$25</button>
                  <button className="bg-blue-600 text-white py-2 rounded text-sm" disabled>$50</button>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded text-sm" disabled>
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join nonprofits already using NMBR to create deeper donor connections.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/demo"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Full Demo
            </Link>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">The NMBR Platform</h3>
          <p className="text-gray-400 mb-6">
            Connecting donors with impact stories through beautiful, branded widgets.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </div>
  )
}