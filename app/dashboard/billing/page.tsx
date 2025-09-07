import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Settings,
  Download,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BillingPage() {
  // Mock data - in real app this would come from database
  const billingData = {
    subscription: {
      status: "active",
      plan: "Professional",
      amount: 99,
      currency: "USD",
      nextBilling: "2025-02-15",
      paymentMethod: "**** 4242",
    },
    stripeConnect: {
      connected: true,
      accountId: "acct_1234567890",
      status: "complete",
      payoutsEnabled: true,
    },
    usage: {
      currentPeriod: {
        donations: 47,
        donationVolume: 12450,
        subscribers: 89,
        widgetViews: 1247,
      },
      limits: {
        donations: 100,
        donationVolume: 25000,
        subscribers: 200,
        widgetViews: 5000,
      },
    },
    recentTransactions: [
      { id: "1", type: "donation", amount: 50, date: "2025-01-10", donor: "John D." },
      { id: "2", type: "donation", amount: 25, date: "2025-01-09", donor: "Sarah M." },
      { id: "3", type: "subscription", amount: -99, date: "2025-01-01", description: "Monthly subscription" },
    ],
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage your subscription and payment processing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Manage Subscription
          </Button>
        </div>
      </div>

      {/* Stripe Connect Status */}
      {!billingData.stripeConnect.connected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Payment processing not set up.</strong> Connect your Stripe account to start receiving donations.
            <Button variant="link" className="p-0 h-auto ml-2">
              Set up payments
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription
              </CardTitle>
              <CardDescription>Your current plan and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{billingData.subscription.plan} Plan</span>
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {billingData.subscription.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    ${billingData.subscription.amount}/{billingData.subscription.currency} per month
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Next billing</p>
                  <p className="font-medium">{billingData.subscription.nextBilling}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Payment method</p>
                  <p className="font-medium">{billingData.subscription.paymentMethod}</p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage & Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
              <CardDescription>Track your plan usage and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Donations</span>
                    <span>
                      {billingData.usage.currentPeriod.donations} / {billingData.usage.limits.donations}
                    </span>
                  </div>
                  <Progress
                    value={(billingData.usage.currentPeriod.donations / billingData.usage.limits.donations) * 100}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Donation Volume</span>
                    <span>
                      ${billingData.usage.currentPeriod.donationVolume.toLocaleString()} / $
                      {billingData.usage.limits.donationVolume.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (billingData.usage.currentPeriod.donationVolume / billingData.usage.limits.donationVolume) * 100
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subscribers</span>
                    <span>
                      {billingData.usage.currentPeriod.subscribers} / {billingData.usage.limits.subscribers}
                    </span>
                  </div>
                  <Progress
                    value={(billingData.usage.currentPeriod.subscribers / billingData.usage.limits.subscribers) * 100}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Widget Views</span>
                    <span>
                      {billingData.usage.currentPeriod.widgetViews.toLocaleString()} /{" "}
                      {billingData.usage.limits.widgetViews.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(billingData.usage.currentPeriod.widgetViews / billingData.usage.limits.widgetViews) * 100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest donations and charges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === "donation" ? "bg-green-100" : "bg-blue-100"
                        }`}
                      >
                        {transaction.type === "donation" ? (
                          <DollarSign className="w-4 h-4 text-green-600" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === "donation"
                            ? `Donation from ${transaction.donor}`
                            : transaction.description}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-gray-900"}`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stripe Connect Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                Stripe Connect
              </CardTitle>
              <CardDescription>Payment processing status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingData.stripeConnect.connected ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Connected</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account ID</span>
                      <span className="font-mono">{billingData.stripeConnect.accountId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payouts</span>
                      <span className={billingData.stripeConnect.payoutsEnabled ? "text-green-600" : "text-red-600"}>
                        {billingData.stripeConnect.payoutsEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage in Stripe
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Not Connected</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect your Stripe account to start receiving donations directly.
                  </p>
                  <Button className="w-full">Connect Stripe Account</Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>Key metrics for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Total Donations</span>
                </div>
                <span className="font-semibold">
                  ${billingData.usage.currentPeriod.donationVolume.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">New Subscribers</span>
                </div>
                <span className="font-semibold">{billingData.usage.currentPeriod.subscribers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full" />
                  <span className="text-sm">Widget Views</span>
                </div>
                <span className="font-semibold">{billingData.usage.currentPeriod.widgetViews.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Get support with billing and payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                View Documentation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                Contact Support
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                Report an Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
