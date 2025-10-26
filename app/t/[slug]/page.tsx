"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Hash, Users, DollarSign, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Team, Fundraiser, Donation } from '@/types'

export default function TeamPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [team, setTeam] = useState<Team | null>(null)
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRaised, setTotalRaised] = useState(0)

  useEffect(() => {
    if (!slug) return
    
    
    

    async function fetchData() {
      try {
        // Fetch team
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('slug', slug)
          .single()

        if (teamError || !teamData) {
          console.error('Team error:', teamError)
          setLoading(false)
          return
        }

        setTeam(teamData)

        // Fetch fundraisers for this team
        const { data: fundraisersData, error: fundraisersError } = await supabase
          .from('fundraisers')
          .select('*')
          .eq('team_id', teamData.id)
          .eq('status', 'live')

        if (!fundraisersError && fundraisersData) {
          setFundraisers(fundraisersData)

          // Fetch donations for this team
          const { data: donationsData, error: donationsError } = await supabase
            .from('donations')
            .select('*')
            .eq('team_id', teamData.id)
            .eq('status', 'succeeded')

          if (!donationsError && donationsData) {
            setDonations(donationsData)
            const total = donationsData.reduce((sum, d) => sum + (d.amount || 0), 0)
            setTotalRaised(total)
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercent = team.goal_cents > 0 ? (totalRaised / team.goal_cents) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Hash className="w-8 h-8 text-blue-600" />
              <Link href="/" className="text-xl font-bold">
                The NMBR Platform
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Platform</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-xl text-gray-600">
              Support our students as they make an impact
            </p>
          </div>
        </div>
      </section>

      {/* Team Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  ${totalRaised.toLocaleString()} / ${team.goal_cents.toLocaleString()}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <span>{Math.round(progressPercent)}% funded</span>
                <span>{donations.length} supporters</span>
              </div>
            </CardContent>
          </Card>

          {/* Fundraisers */}
          {fundraisers.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {fundraisers.map((fr) => {
                const frDonations = donations.filter(d => d.fundraiser_id === fr.id)
                const frRaised = frDonations.reduce((sum, d) => sum + (d.amount || 0), 0)
                const frProgress = fr.goal_cents > 0 ? (frRaised / fr.goal_cents) * 100 : 0
                
                return (
                  <Card key={fr.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-blue-600">#{fr.nmbr_code}</span>
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <CardTitle className="text-xl">{fr.page_title}</CardTitle>
                      <CardDescription>{fr.page_subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Raised</span>
                            <span className="font-medium">
                              ${frRaised.toLocaleString()} / ${fr.goal_cents.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={frProgress} className="h-2" />
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Heart className="w-4 h-4 text-red-500" />
                            {frDonations.length} donors
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            {Math.round(frProgress)}%
                          </div>
                        </div>

                        {/* CTA */}
                        <Link href={`/f/${fr.handle}`}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            View & Support
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No active fundraisers yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Choose a Student</h3>
                <p className="text-gray-600">
                  Each student has their own unique NMBR code and fundraising page
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Donate</h3>
                <p className="text-gray-600">
                  Support their trip and community work in Uganda
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Follow Along</h3>
                <p className="text-gray-600">
                  Receive updates about the impact your donation creates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 The NMBR Platform. Built for purposeful fundraising.
          </p>
        </div>
      </footer>
    </div>
  )
}

