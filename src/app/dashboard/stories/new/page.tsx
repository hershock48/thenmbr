'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'

export default function NewStoryPage() {
  const { org } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    nmbr_code: '',
    title: '',
    description: '',
    photo_url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!org?.id) return

    setLoading(true)
    setError('')

    try {
      // Check if NMBR code already exists
      const { data: existingStory } = await supabase
        .from('stories')
        .select('id')
        .eq('org_id', org.id)
        .eq('nmbr_code', formData.nmbr_code)
        .single()

      if (existingStory) {
        setError('A story with this NMBR code already exists')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('stories')
        .insert({
          org_id: org.id,
          nmbr_code: formData.nmbr_code,
          title: formData.title,
          description: formData.description || null,
          photo_url: formData.photo_url || null
        })

      if (error) throw error

      router.push('/dashboard/stories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard/stories"
              className="text-gray-400 hover:text-gray-600 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create New Story</h1>
          </div>
          <p className="text-sm text-gray-500">
            Add a new NMBR story to connect donors with impact narratives
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* NMBR Code */}
                <div>
                  <label htmlFor="nmbr_code" className="block text-sm font-medium text-gray-700">
                    NMBR Code *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="nmbr_code"
                      id="nmbr_code"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., STORY001, JOHNNY2024, etc."
                      value={formData.nmbr_code}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This is the code donors will search for to find this story
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Story Title *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Meet Johnny, Help Sarah, etc."
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Story Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Tell the story of this individual and how donations will help them..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This description will be shown to donors when they search for this NMBR
                  </p>
                </div>

                {/* Photo URL */}
                <div>
                  <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700">
                    Photo URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="photo_url"
                      id="photo_url"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.photo_url}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    URL to an image that represents this story (optional)
                  </p>
                </div>

                {/* Photo Preview */}
                {formData.photo_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo Preview
                    </label>
                    <div className="relative inline-block">
                      <img
                        src={formData.photo_url}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/dashboard/stories"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
