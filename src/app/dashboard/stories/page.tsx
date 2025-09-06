'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Story } from '@/types'
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import Link from 'next/link'

export default function StoriesPage() {
  const { org } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (org?.id) {
      fetchStories()
    }
  }, [org?.id])

  const fetchStories = async () => {
    if (!org?.id) return

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setStories(data || [])
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)

      if (error) throw error

      // Remove from local state
      setStories(stories.filter(story => story.id !== storyId))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting story:', error)
      alert('Failed to delete story. Please try again.')
    }
  }

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.nmbr_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your NMBR stories and impact narratives
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/dashboard/stories/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Story
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stories by title, NMBR code, or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Plus className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first NMBR story.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/stories/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Story
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <div key={story.id} className="bg-white overflow-hidden shadow rounded-lg">
                {/* Story Image */}
                {story.photo_url && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={story.photo_url}
                      alt={story.title}
                    />
                  </div>
                )}
                
                {/* Story Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      NMBR {story.nmbr_code}
                    </span>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/stories/${story.id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(story.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {story.title}
                  </h3>
                  
                  {story.description && (
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {story.description}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Created {new Date(story.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/story/${org?.id}/${story.nmbr_code}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Story</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this story? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
