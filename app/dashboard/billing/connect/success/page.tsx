import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function StripeConnectSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Payment Processing Connected!</CardTitle>
          <CardDescription>
            Your Stripe account has been successfully connected. You can now receive donations directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">What's Next?</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Donations will be deposited directly to your bank account</li>
              <li>• Platform fees (5%) will be automatically deducted</li>
              <li>• You'll receive email notifications for all transactions</li>
              <li>• Access detailed reports in your Stripe dashboard</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/dashboard/billing">
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Billing Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
