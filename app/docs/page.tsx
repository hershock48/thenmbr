import { GlobalHeader } from "@/components/layout/global-header"
import { GlobalFooter } from "@/components/layout/global-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Zap, Shield, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn the basics of NMBR Platform",
      icon: BookOpen,
      links: [
        { title: "Quick Start Guide", href: "/dashboard/help" },
        { title: "Creating Your First NMBR", href: "/dashboard/help" },
        { title: "Setting Up Your Organization", href: "/dashboard/help" },
      ]
    },
    {
      title: "API Reference",
      description: "Integrate with our REST API",
      icon: Code,
      links: [
        { title: "Authentication", href: "/dashboard/help" },
        { title: "NMBR Management", href: "/dashboard/help" },
        { title: "Webhook Events", href: "/dashboard/help" },
      ]
    },
    {
      title: "Widget Integration",
      description: "Embed our widget on your website",
      icon: Zap,
      links: [
        { title: "Widget Setup", href: "/dashboard/help" },
        { title: "Customization Options", href: "/dashboard/help" },
        { title: "Advanced Configuration", href: "/dashboard/help" },
      ]
    },
    {
      title: "Security",
      description: "Keep your data safe and secure",
      icon: Shield,
      links: [
        { title: "Data Protection", href: "/dashboard/help" },
        { title: "Privacy Policy", href: "/" },
        { title: "Security Best Practices", href: "/dashboard/help" },
      ]
    },
    {
      title: "User Management",
      description: "Manage users and permissions",
      icon: Users,
      links: [
        { title: "User Roles", href: "/dashboard/help" },
        { title: "Permission Settings", href: "/dashboard/help" },
        { title: "Team Collaboration", href: "/dashboard/help" },
      ]
    },
    {
      title: "Analytics",
      description: "Track and analyze your impact",
      icon: BarChart3,
      links: [
        { title: "Dashboard Overview", href: "/dashboard/help" },
        { title: "Custom Reports", href: "/dashboard/help" },
        { title: "Data Export", href: "/dashboard/help" },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="default" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about NMBR Platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="w-5 h-5 text-cyan-600" />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help with any questions you might have.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/dashboard/help">Visit Help Center</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <GlobalFooter />
    </div>
  )
}
