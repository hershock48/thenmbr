import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Eye, CheckCircle, XCircle, DollarSign, Users, Calendar } from "lucide-react"

export default function NonprofitsPage() {
  // Mock data - would come from database
  const nonprofits = [
    {
      id: 1,
      name: "Hope Foundation",
      email: "admin@hopefoundation.org",
      status: "pending",
      joinedAt: "2024-01-15",
      totalRevenue: 1250,
      totalDonations: 5600,
      activeCampaigns: 3,
      subscribers: 145,
    },
    {
      id: 2,
      name: "Clean Water Initiative",
      email: "contact@cleanwater.org",
      status: "active",
      joinedAt: "2024-01-12",
      totalRevenue: 3400,
      totalDonations: 15200,
      activeCampaigns: 8,
      subscribers: 892,
    },
    {
      id: 3,
      name: "Education for All",
      email: "info@educationforall.org",
      status: "active",
      joinedAt: "2024-01-10",
      totalRevenue: 2100,
      totalDonations: 9800,
      activeCampaigns: 5,
      subscribers: 456,
    },
    {
      id: 4,
      name: "Animal Rescue Network",
      email: "help@animalrescue.org",
      status: "suspended",
      joinedAt: "2024-01-08",
      totalRevenue: 0,
      totalDonations: 2300,
      activeCampaigns: 0,
      subscribers: 234,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
      case "pending":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100"
      case "suspended":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 text-balance">Nonprofit Management</h1>
          <p className="text-slate-600 text-lg mt-2">Manage nonprofit accounts, approvals, and platform access</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200">
          <CheckCircle className="h-4 w-4 mr-2" />
          Bulk Approve
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search nonprofits..."
                className="pl-10 border-slate-200 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nonprofits List */}
      <div className="space-y-6">
        {nonprofits.map((nonprofit) => (
          <Card
            key={nonprofit.id}
            className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-200"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                      <span className="text-slate-700 font-bold text-sm">{nonprofit.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">{nonprofit.name}</h3>
                      <Badge className={getStatusColor(nonprofit.status)}>{nonprofit.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-sm text-slate-600">
                    <span className="font-medium">{nonprofit.email}</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(nonprofit.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">${nonprofit.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Platform Revenue</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">${nonprofit.totalDonations.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Total Donations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-violet-200 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{nonprofit.subscribers.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Subscribers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <Eye className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{nonprofit.activeCampaigns}</p>
                        <p className="text-xs text-slate-500">Active Campaigns</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {nonprofit.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" className="border-slate-200 hover:bg-slate-50 bg-transparent">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
