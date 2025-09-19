import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hash, Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Shield className="w-4 h-4 mr-2" />
              Privacy & Data Protection
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Your Data, Your
              <span className="text-primary"> Trust</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to protecting your privacy and the data of your donors. 
              Learn how we handle your information with transparency and security.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Last updated: September 9, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-6 h-6 text-primary" />
                  Our Commitment to Privacy
                </CardTitle>
                <CardDescription>
                  NMBR is built with privacy and security at its core. We understand that nonprofits handle sensitive donor information and we're committed to protecting it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">End-to-End Encryption</h3>
                    <p className="text-sm text-muted-foreground">All data is encrypted in transit and at rest</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Secure Storage</h3>
                    <p className="text-sm text-muted-foreground">Data stored in SOC 2 compliant infrastructure</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Access Controls</h3>
                    <p className="text-sm text-muted-foreground">Role-based permissions and audit logs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle>What Information We Collect</CardTitle>
                <CardDescription>
                  We only collect the information necessary to provide our services and improve your experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Information You Provide</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Account Information:</strong> Name, email, organization details, and contact information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Story Content:</strong> Impact stories, photos, and updates you create</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Donor Information:</strong> Email addresses and donation preferences (with consent)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Information We Collect Automatically</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Usage Data:</strong> How you interact with our platform and features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Analytics:</strong> Anonymous usage statistics to improve our services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Technical Data:</strong> IP address, browser type, and device information</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Data */}
            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
                <CardDescription>
                  We use your information only for legitimate business purposes and to provide you with the best possible service.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-700">Service Delivery</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Process donations and manage donor relationships</li>
                      <li>• Send impact updates and newsletters</li>
                      <li>• Provide customer support</li>
                      <li>• Maintain your account and preferences</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-700">Platform Improvement</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Analyze usage patterns to improve features</li>
                      <li>• Develop new tools and capabilities</li>
                      <li>• Ensure platform security and reliability</li>
                      <li>• Provide personalized recommendations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>Data Sharing and Third Parties</CardTitle>
                <CardDescription>
                  We do not sell your data. We only share information when necessary to provide our services or as required by law.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800">We Never Sell Your Data</h3>
                      <p className="text-sm text-red-700 mt-1">
                        We do not sell, rent, or trade your personal information or donor data to third parties for marketing purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">When We Share Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Service Providers:</strong> Trusted partners like Stripe for payment processing (with strict data protection agreements)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Consent:</strong> When you explicitly authorize us to share information</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
                <CardDescription>
                  You have control over your personal information. Here's how you can manage it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Access and Control</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• View and download your data</li>
                      <li>• Update your account information</li>
                      <li>• Manage communication preferences</li>
                      <li>• Delete your account and data</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Data Protection</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Request data portability</li>
                      <li>• Object to certain data processing</li>
                      <li>• Request data correction</li>
                      <li>• Withdraw consent at any time</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About Privacy?</CardTitle>
                <CardDescription>
                  We're here to help. Contact us with any questions about our privacy practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    If you have questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@thenmbr.com</p>
                    <p><strong>Address:</strong> NMBR Platform, Privacy Team, [Your Address]</p>
                    <p><strong>Response Time:</strong> We'll respond within 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  )
}
