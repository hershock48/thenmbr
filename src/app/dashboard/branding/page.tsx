'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Nonprofit } from '@/types'
import { Upload, Eye, Save, Palette, Type, Image } from 'lucide-react'

const FONT_OPTIONS = [
  { name: 'Inter', value: 'Inter', category: 'Sans-serif' },
  { name: 'Roboto', value: 'Roboto', category: 'Sans-serif' },
  { name: 'Open Sans', value: 'Open Sans', category: 'Sans-serif' },
  { name: 'Lato', value: 'Lato', category: 'Sans-serif' },
  { name: 'Poppins', value: 'Poppins', category: 'Sans-serif' },
  { name: 'Montserrat', value: 'Montserrat', category: 'Sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display', category: 'Serif' },
  { name: 'Merriweather', value: 'Merriweather', category: 'Serif' },
  { name: 'Source Serif Pro', value: 'Source Serif Pro', category: 'Serif' },
  { name: 'Crimson Text', value: 'Crimson Text', category: 'Serif' },
  { name: 'Fira Code', value: 'Fira Code', category: 'Monospace' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono', category: 'Monospace' },
]

const BRAND_PACKAGES = [
  {
    name: 'Professional Blue',
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#3b82f6',
    description: 'Clean and trustworthy'
  },
  {
    name: 'Warm Orange',
    primary: '#ea580c',
    secondary: '#c2410c',
    accent: '#fb923c',
    description: 'Energetic and friendly'
  },
  {
    name: 'Forest Green',
    primary: '#16a34a',
    secondary: '#15803d',
    accent: '#22c55e',
    description: 'Natural and growth-focused'
  },
  {
    name: 'Royal Purple',
    primary: '#7c3aed',
    secondary: '#6d28d9',
    accent: '#8b5cf6',
    description: 'Creative and innovative'
  },
  {
    name: 'Coral Pink',
    primary: '#e11d48',
    secondary: '#be123c',
    accent: '#f43f5e',
    description: 'Compassionate and caring'
  },
  {
    name: 'Ocean Teal',
    primary: '#0d9488',
    secondary: '#0f766e',
    accent: '#14b8a6',
    description: 'Calm and reliable'
  }
]

export default function BrandingPage() {
  const { org } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [branding, setBranding] = useState({
    logo_url: '',
    brand_color: '#3b82f6',
    secondary_color: '#1e40af',
    accent_color: '#60a5fa',
    font_family: 'Inter',
    show_powered_by: true
  })

  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (org?.id) {
      fetchBranding()
    }
  }, [org?.id])

  const fetchBranding = async () => {
    if (!org?.id) return

    try {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('logo_url, brand_color, secondary_color, accent_color, font_family, show_powered_by')
        .eq('id', org.id)
        .single()

      if (error) throw error

      if (data) {
        setBranding({
          logo_url: data.logo_url || '',
          brand_color: data.brand_color || '#3b82f6',
          secondary_color: data.secondary_color || '#1e40af',
          accent_color: data.accent_color || '#60a5fa',
          font_family: data.font_family || 'Inter',
          show_powered_by: data.show_powered_by ?? true
        })
      }
    } catch (error) {
      console.error('Error fetching branding:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!org?.id) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('nonprofits')
        .update({
          logo_url: branding.logo_url || null,
          brand_color: branding.brand_color,
          secondary_color: branding.secondary_color,
          accent_color: branding.accent_color,
          font_family: branding.font_family,
          show_powered_by: branding.show_powered_by
        })
        .eq('id', org.id)

      if (error) throw error

      setSuccess('Branding updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update branding')
    } finally {
      setSaving(false)
    }
  }

  const handleBrandPackage = (pkg: typeof BRAND_PACKAGES[0]) => {
    setBranding(prev => ({
      ...prev,
      brand_color: pkg.primary,
      secondary_color: pkg.secondary,
      accent_color: pkg.accent
    }))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setBranding(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
          <p className="mt-1 text-sm text-gray-500">
            Customize your widget's appearance with your organization's branding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Image className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Logo</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
                      Logo URL
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        name="logo_url"
                        id="logo_url"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="https://example.com/logo.png"
                        value={branding.logo_url}
                        onChange={(e) => handleInputChange('logo_url', e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      URL to your organization's logo (recommended: 200x100px)
                    </p>
                  </div>
                  
                  {branding.logo_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Preview
                      </label>
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <img
                          src={branding.logo_url}
                          alt="Logo preview"
                          className="h-12 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Packages */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Palette className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Quick Color Themes</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {BRAND_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.name}
                      onClick={() => handleBrandPackage(pkg)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 text-left"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: pkg.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: pkg.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: pkg.accent }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{pkg.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Colors */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Palette className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Custom Colors</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="brand_color" className="block text-sm font-medium text-gray-700">
                      Primary Color
                    </label>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        type="color"
                        id="brand_color"
                        value={branding.brand_color}
                        onChange={(e) => handleInputChange('brand_color', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.brand_color}
                        onChange={(e) => handleInputChange('brand_color', e.target.value)}
                        className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700">
                      Secondary Color
                    </label>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        type="color"
                        id="secondary_color"
                        value={branding.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="accent_color" className="block text-sm font-medium text-gray-700">
                      Accent Color
                    </label>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        type="color"
                        id="accent_color"
                        value={branding.accent_color}
                        onChange={(e) => handleInputChange('accent_color', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.accent_color}
                        onChange={(e) => handleInputChange('accent_color', e.target.value)}
                        className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Type className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Typography</h3>
                </div>
                <div>
                  <label htmlFor="font_family" className="block text-sm font-medium text-gray-700">
                    Font Family
                  </label>
                  <select
                    id="font_family"
                    value={branding.font_family}
                    onChange={(e) => handleInputChange('font_family', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Choose a font that matches your organization's style
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Footer Settings</h3>
                <div className="flex items-center">
                  <input
                    id="show_powered_by"
                    name="show_powered_by"
                    type="checkbox"
                    checked={branding.show_powered_by}
                    onChange={(e) => handleInputChange('show_powered_by', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="show_powered_by" className="ml-2 block text-sm text-gray-900">
                    Show "Powered by The NMBR" footer
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Display our branding in the widget footer (can be hidden for premium accounts)
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="text-sm text-green-600">{success}</div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              
              {previewMode && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div 
                    className="bg-white rounded-lg shadow-sm p-6"
                    style={{
                      fontFamily: branding.font_family,
                      '--brand-color': branding.brand_color,
                      '--secondary-color': branding.secondary_color,
                      '--accent-color': branding.accent_color
                    } as React.CSSProperties}
                  >
                    {/* Widget Preview */}
                    <div className="text-center">
                      {branding.logo_url && (
                        <div className="mb-4">
                          <img
                            src={branding.logo_url}
                            alt="Logo"
                            className="h-12 mx-auto object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                      
                      <h2 
                        className="text-xl font-bold mb-2"
                        style={{ color: branding.brand_color }}
                      >
                        Search Your NMBR
                      </h2>
                      
                      <p className="text-gray-600 mb-4">
                        Enter your NMBR code to find your impact story
                      </p>
                      
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Enter NMBR code..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{ 
                            borderColor: branding.brand_color,
                            '--tw-ring-color': branding.brand_color
                          } as React.CSSProperties}
                        />
                      </div>
                      
                      <div className="flex space-x-3 justify-center">
                        <button
                          className="px-6 py-2 text-white rounded-md font-medium"
                          style={{ backgroundColor: branding.brand_color }}
                        >
                          Search
                        </button>
                        <button
                          className="px-6 py-2 border rounded-md font-medium"
                          style={{ 
                            borderColor: branding.brand_color,
                            color: branding.brand_color
                          }}
                        >
                          Donate
                        </button>
                      </div>
                      
                      {branding.show_powered_by && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Powered by <span className="font-semibold">The NMBR</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
