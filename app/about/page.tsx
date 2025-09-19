import { GlobalHeader } from "@/components/layout/global-header"
import { GlobalFooter } from "@/components/layout/global-footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader variant="default" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About NMBR Platform</h1>
          <p className="text-xl text-muted-foreground">
            The complete story-driven fundraising platform for nonprofits
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            NMBR Platform transforms traditional fundraising by connecting donors directly to the people they help through numbered stories. Our innovative approach makes every donation personal and meaningful.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            To turn stories into impact by connecting donors directly to the people they help through numbered stories. We believe that when donors can see exactly how their contribution creates change, they give more generously and build lasting relationships with your cause.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground mb-6">
            Nonprofits create numbered stories about the people they help. Donors receive a physical bracelet with a unique number that connects them to a specific story. When they enter their number on our platform, they see the impact of their donation and can follow the story's progress.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Impact</h2>
          <p className="text-muted-foreground">
            Since launching, we've helped nonprofits raise over $2.5 million through story-driven fundraising, connecting thousands of donors to the people they've helped around the world. Our platform has enabled sustainable donor relationships that go beyond one-time donations.
          </p>
        </div>
      </main>
      
      <GlobalFooter />
    </div>
  )
}
