'use client'

import { useState, useEffect } from 'react'

export default function TestWidget() {
  const [orgId, setOrgId] = useState<string | null>(null)
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const org = urlParams.get('org')
    setOrgId(org)
    
    if (org) {
      testAPI(org)
    }
  }, [])

  const testAPI = async (org: string) => {
    setLoading(true)
    try {
      console.log('Testing API with org:', org)
      const response = await fetch(`/api/stories?org=${org}&nmbr=1`)
      const data = await response.json()
      console.log('API Response:', data)
      setStories(data.stories || [])
    } catch (error) {
      console.error('API Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Test Widget</h1>
        <p>Org ID: {orgId || 'Not found'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Stories: {stories.length}</p>
        {stories.map(story => (
          <div key={story.id} className="p-4 border rounded mb-2">
            <h3>{story.title}</h3>
            <p>{story.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
