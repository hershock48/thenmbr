import { GlobalHeader } from "@/components/layout/global-header"
import { GlobalFooter } from "@/components/layout/global-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Heart, Zap, Shield } from "lucide-react"

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "5+ years",
      description: "Join our engineering team to build the next generation of fundraising technology.",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Lead product strategy and work with cross-functional teams to deliver amazing user experiences.",
      skills: ["Product Strategy", "User Research", "Analytics", "Agile", "Stakeholder Management"]
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "3+ years",
      description: "Create intuitive and beautiful user experiences that help nonprofits connect with donors.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      experience: "2+ years",
      description: "Help our nonprofit partners succeed and grow their impact through our platform.",
      skills: ["Customer Success", "Nonprofit Sector", "Data Analysis", "Communication", "Problem Solving"]
    }
  ]

  const benefits = [
    {
      icon: Heart,
      title: "Mission-Driven Work",
      description: "Make a real impact by helping nonprofits raise more money for their causes."
    },
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "Work with passionate, talented people who care about making a difference."
    },
    {
      icon: Zap,
      title: "Growth Opportunities",
      description: "Learn new skills and advance your career in a fast-growing startup environment."
    },
    {
      icon: Shield,
      title: "Comprehensive Benefits",
      description: "Health insurance, 401k, unlimited PTO, and flexible work arrangements."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="default" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground">
            Help us revolutionize fundraising and make every donation personal
          </p>
        </div>
        
        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Work at NMBR?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Open Positions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{position.title}</CardTitle>
                      <CardDescription className="mt-1">{position.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{position.type}</Badge>
                      <Badge variant="outline">{position.department}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {position.experience}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Culture Section */}
        <Card className="bg-gradient-to-r from-cyan-50 to-purple-50 border-cyan-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Culture</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
              At NMBR, we believe that great products come from great teams. We're building a culture 
              where everyone can do their best work, learn from each other, and make a meaningful impact 
              on the world.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline">Learn More About Our Culture</Button>
              <Button>View All Openings</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <GlobalFooter />
    </div>
  )
}
