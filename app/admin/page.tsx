import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, AlertTriangle, Building2, CreditCard, Activity, Eye } from "lucide-react"

export default function AdminDashboard() {
  // Mock data - would come from database
  const stats = {
    totalNonprofits: 247,
    activeNonprofits: 189,
    totalRevenue: 45670,
    monthlyRevenue: 8920,
    totalDonations: 156780,
    activeCampaigns: 1240,
    pendingApprovals: 12,
    systemHealth: 99.8,
  }

  const recentNonprofits = [
    { id: 1, name: "Hope Foundation", status: "pending", revenue: 1250, joinedAt: "2024-01-15" },
    { id: 2, name: "Clean Water Initiative", status: "active", revenue: 3400, joinedAt: "2024-01-12" },
    { id: 3, name: "Education for All", status: "active", revenue: 2100, joinedAt: "2024-01-10" },
    { id: 4, name: "Animal Rescue Network", status: "pending", revenue: 0, joinedAt: "2024-01-08" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 text-balance">Super Admin Dashboard</h1>
        <p className="text-slate-600 text-lg mt-2">Manage nonprofits, monitor platform health, and track revenue</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Nonprofits</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.totalNonprofits}</div>
            <p className="text-sm text-emerald-600 flex items-center mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">+12</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Revenue</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-sm text-emerald-600 flex items-center mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">+18%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Donations</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">${stats.totalDonations.toLocaleString()}</div>
            <p className="text-sm text-slate-500 mt-2">Platform lifetime donations</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">System Health</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.systemHealth}%</div>
            <p className="text-sm text-emerald-600 font-medium mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Nonprofits */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Nonprofit Applications</CardTitle>
            <CardDescription className="text-slate-600">
              Latest organizations requesting to join the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNonprofits.map((nonprofit) => (
                <div
                  key={nonprofit.id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">{nonprofit.name}</p>
                    <p className="text-sm text-slate-500">
                      Applied {new Date(nonprofit.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={nonprofit.status === "active" ? "default" : "secondary"}
                      className={
                        nonprofit.status === "active"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                      }
                    >
                      {nonprofit.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-slate-200 hover:bg-slate-50 bg-transparent">
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Alerts */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Platform Alerts</CardTitle>
            <CardDescription className="text-slate-600">Important notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">Pending Approvals</p>
                  <p className="text-sm text-slate-600">
                    {stats.pendingApprovals} nonprofit applications awaiting review
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">Payment Processing</p>
                  <p className="text-sm text-slate-600">3 organizations need Stripe Connect setup</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">Revenue Milestone</p>
                  <p className="text-sm text-slate-600">Platform reached $45K total revenue this month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
