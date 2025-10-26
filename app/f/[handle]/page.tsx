"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Hash, Users, DollarSign, Heart, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Fundraiser, Donation, Team } from '@/types'

export default function FundraiserPage() {
  const params = useParams()
  const handle = params.handle as string
  
  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRaised, setTotalRaised] = useState(0)
  const [donationAmount, setDonationAmount] = useState('100')

  useEffect(() => {
    if (!handle) return
    
    

    async function fetchData() {
      try {
        // Fetch fundraiser
        const { data: fundraiserData, error: fundraiserError } = await supabase
          .from('fundraisers')
          .select('*')
          .eq('handle', handle)
          .eq('status', 'live')
          .single()

        if (fundraiserError || !fundraiserData) {
          console.error('Fundraiser error:', fundraiserError)
          setLoading(false)
          return
        }

        setFundraiser(fundraiserData)

        // Fetch team
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', fundraiserData.team_id)
          .single()

        if (!teamError && teamData) {
          setTeam(teamData)
        }

        // Fetch donations
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select('*')
          .eq('fundraiser_id', fundraiserData.id)
          .eq('status', 'succeeded')

        if (!donationsError && donationsData) {
          setDonations(donationsData)
          const total = donationsData.reduce((sum, d) => sum + (d.amount || 0), 0)
          setTotalRaised(total)
        }

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [handle])

  const handleDonate = async () => {
    if (!fundraiser) return
    
    // TODO: Integrate with Stripe Checkout
    alert(`Donating $${donationAmount} to ${fundraiser.page_title}`)
    
    // This would redirect to Stripe Checkout
    // window.location.href = `/api/checkout?fundraiserId=${fundraiser.id}&amountCents=${parseFloat(donationAmount) * 100}`
  }

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

  if (!fundraiser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Fundraiser Not Found</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercent = fundraiser.goal_cents > 0 ? (totalRaised / fundraiser.goal_cents) * 100 : 0

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
            <div className="flex gap-2">
              {team && (
                <Link href={`/t/${team.slug}`}>
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    View Team
                  </Button>
                </Link>
              )}
              <Button variant="ghost">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">#{fundraiser.nmbr_code}</span>
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{fundraiser.page_title}</h1>
                <p className="text-lg text-gray-600">{fundraiser.page_subtitle}</p>
              </div>
            </div>
            
            <Card className="p-8">
              <CardContent>
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${totalRaised.toLocaleString()} / ${fundraiser.goal_cents.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-4 mb-4" />
                <div className="flex justify-between text-sm text-gray-600 mb-6">
                  <span>{Math.round(progressPercent)}% funded</span>
                  <span>{donations.length} supporters</span>
                </div>

                {/* Donate Widget */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleDonate}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      Donate
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => setDonationAmount('25')} size="sm">
                      $25
                    </Button>
                    <Button variant="outline" onClick={() => setDonationAmount('50')} size="sm">
                      $50
                    </Button>
                    <Button variant="outline" onClick={() => setDonationAmount('100')} size="sm">
                      $100
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">My Story</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {fundraiser.story || 'Story coming soon...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Supporters */}
      {donations.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Recent Supporters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-gray-600">
                          {donation.donor_email ? donation.donor_email.split('@')[0] : 'Anonymous'}
                        </span>
                      </div>
                      <span className="font-semibold text-green-600">
                        ${donation.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Disclosure */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500 text-center">
            Gifts on this page support a student's program fees and trip costs with YOTERA and are 
            <strong> not tax-deductible</strong>. For charitable, tax-deductible giving to Be A Number, 
            please donate through their site.
          </p>
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

