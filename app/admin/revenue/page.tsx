import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Download, CreditCard } from "lucide-react"

export default function RevenuePage() {
  // Mock data - would come from database
  const revenueStats = {
    totalRevenue: 45670,
    monthlyRevenue: 8920,
    averagePerNonprofit: 185,
    platformFeeRate: 2.9,
    totalTransactions: 1247,
    monthlyGrowth: 18.5,
  }

  const recentTransactions = [
    {
      id: 1,
      nonprofit: "Hope Foundation",
      amount: 125.5,
      fee: 3.64,
      date: "2024-01-15T10:30:00Z",
      status: "completed",
    },
    {
      id: 2,
      nonprofit: "Clean Water Initiative",
      amount: 250.0,
      fee: 7.25,
      date: "2024-01-15T09:15:00Z",
      status: "completed",
    },
    {
      id: 3,
      nonprofit: "Education for All",
      amount: 75.0,
      fee: 2.18,
      date: "2024-01-15T08:45:00Z",
      status: "pending",
    },
    {
      id: 4,
      nonprofit: "Animal Rescue Network",
      amount: 500.0,
      fee: 14.5,
      date: "2024-01-14T16:20:00Z",
      status: "completed",
    },
  ]

  const monthlyData = [
    { month: "Aug", revenue: 3200 },
    { month: "Sep", revenue: 4100 },
    { month: "Oct", revenue: 5300 },
    { month: "Nov", revenue: 6800 },
    { month: "Dec", revenue: 7500 },
    { month: "Jan", revenue: 8920 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 text-balance">Revenue Analytics</h1>
          <p className="text-slate-600 text-lg mt-2">Track platform revenue, fees, and financial performance</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">${revenueStats.totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-slate-500 mt-2">Platform lifetime revenue</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Revenue</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">${revenueStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-sm text-emerald-600 flex items-center mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">+{revenueStats.monthlyGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg per Nonprofit</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">${revenueStats.averagePerNonprofit}</div>
            <p className="text-sm text-slate-500 mt-2">Monthly average revenue</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Platform Fee</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{revenueStats.platformFeeRate}%</div>
            <p className="text-sm text-slate-500 mt-2">+ Stripe processing fees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Monthly Revenue Trend</CardTitle>
            <CardDescription className="text-slate-600">Platform revenue growth over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                  <span className="font-medium text-slate-900">{data.month} 2024</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(data.revenue / 10000) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 w-20 text-right">${data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Transactions</CardTitle>
            <CardDescription className="text-slate-600">Latest platform fee collections from donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{transaction.nonprofit}</p>
                    <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                        className={
                          transaction.status === "completed"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-slate-900">${transaction.fee.toFixed(2)}</span>
                      <span className="text-slate-500"> fee</span>
                    </div>
                    <div className="text-xs text-slate-500">from ${transaction.amount.toFixed(2)} donation</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
