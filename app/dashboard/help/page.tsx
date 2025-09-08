"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  Video, 
  FileText, 
  Mail, 
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const [searchError, setSearchError] = useState("")

  // FAQ data
  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first NMBR?",
          answer: "To create your first NMBR, go to the NMBRs page and click 'Create New NMBR'. Fill in the story details, set your fundraising goal, and activate your campaign. Your NMBR will be ready to share with supporters."
        },
        {
          question: "How do I embed the widget on my website?",
          answer: "Go to the Widget page in your dashboard. Customize the appearance and copy the embed code. Paste it into your website's HTML where you want the widget to appear."
        },
        {
          question: "How do I connect my Stripe account?",
          answer: "Navigate to the Billing page and click 'Connect Stripe Account'. Follow the Stripe Connect flow to link your payment processing account."
        }
      ]
    },
    {
      category: "NMBRs & Stories",
      questions: [
        {
          question: "Can I edit a NMBR after it's published?",
          answer: "Yes, you can edit most details of your NMBR from the NMBRs page. However, some changes may require approval if the NMBR is already active."
        },
        {
          question: "How do I track donations for my NMBR?",
          answer: "All donation tracking is available in the Analytics page. You can see real-time donation data, donor information, and campaign performance metrics."
        },
        {
          question: "What happens when someone enters a NMBR code?",
          answer: "When someone enters a NMBR code, they'll see the story behind the bracelet, can subscribe for updates, and can make a donation to support the cause."
        }
      ]
    },
    {
      category: "Billing & Payments",
      questions: [
        {
          question: "How much does NMBR Platform cost?",
          answer: "We offer flexible pricing plans starting at $29/month. Check the Billing page for detailed pricing information and plan features."
        },
        {
          question: "When will I receive my donations?",
          answer: "Donations are processed through Stripe and typically appear in your account within 2-7 business days, depending on your payout schedule."
        },
        {
          question: "Can I change my subscription plan?",
          answer: "Yes, you can upgrade or downgrade your plan at any time from the Billing page. Changes take effect at your next billing cycle."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "The widget isn't displaying correctly on my website",
          answer: "Check that you've copied the complete embed code and that your website supports iframes. Try the JavaScript version if the iframe doesn't work."
        },
        {
          question: "I'm not receiving email notifications",
          answer: "Check your spam folder and ensure your email address is correct in Settings. You can also verify your notification preferences in the Notifications tab."
        },
        {
          question: "How do I reset my password?",
          answer: "Go to Settings > Security and use the 'Change Password' option. You'll need to enter your current password and create a new one."
        }
      ]
    }
  ]

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!contactForm.name.trim()) {
      errors.name = "Name is required"
    }
    
    if (!contactForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(contactForm.email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!contactForm.subject.trim()) {
      errors.subject = "Subject is required"
    }
    
    if (!contactForm.message.trim()) {
      errors.message = "Message is required"
    } else if (contactForm.message.length < 10) {
      errors.message = "Message must be at least 10 characters long"
    }
    
    return errors
  }

  // Filtered FAQ based on search
  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus("success")
      setContactForm({ name: "", email: "", subject: "", message: "", priority: "medium" })
      setTimeout(() => setSubmitStatus(""), 5000)
    } catch (error) {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus(""), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle search with error handling
  const handleSearch = (query: string) => {
    setSearchError("")
    if (query.length > 100) {
      setSearchError("Search query is too long. Please use fewer characters.")
      return
    }
    setSearchQuery(query)
  }

  // Handle external resource clicks
  const handleResourceClick = (resource: string) => {
    setSubmitStatus(`Redirecting to ${resource}...`)
    setTimeout(() => setSubmitStatus(""), 3000)
    // In a real app, these would open actual resources
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Find answers to common questions and get the help you need</p>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            maxLength={100}
          />
          {searchError && (
            <p className="text-red-600 text-sm mt-1">{searchError}</p>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-700 text-sm">Support ticket submitted successfully! We'll get back to you within 24 hours.</span>
        </div>
      )}
      
      {submitStatus === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 text-sm">Failed to submit support ticket. Please try again or contact us directly.</span>
        </div>
      )}

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {searchQuery && (
            <div className="text-sm text-gray-600">
              Found {filteredFAQ.reduce((acc, cat) => acc + cat.questions.length, 0)} results for "{searchQuery}"
            </div>
          )}
          
          {filteredFAQ.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">Try searching with different keywords or browse our categories below.</p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </CardContent>
            </Card>
          ) : (
            filteredFAQ.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Contact Us Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Send us a message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className={formErrors.name ? "border-red-500" : ""}
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-600 text-sm">{formErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className={formErrors.email ? "border-red-500" : ""}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-600 text-sm">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      className={formErrors.subject ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.subject && (
                      <p className="text-red-600 text-sm">{formErrors.subject}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={contactForm.priority}
                      onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className={`min-h-32 ${formErrors.message ? "border-red-500" : ""}`}
                      required
                    />
                    {formErrors.message && (
                      <p className="text-red-600 text-sm">{formErrors.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {contactForm.message.length}/500 characters
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Other ways to reach us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <a 
                        href="mailto:support@nmbr-platform.com" 
                        className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline"
                      >
                        support@nmbr-platform.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <a 
                        href="tel:+18006663743" 
                        className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline"
                      >
                        1-800-NMBR-HELP
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <button 
                        onClick={() => setSubmitStatus("Live chat will be available soon!")}
                        className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline"
                      >
                        Available 9 AM - 6 PM EST
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Urgent</span>
                    <Badge variant="destructive">2 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High</span>
                    <Badge variant="secondary">4 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium</span>
                    <Badge variant="outline">24 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low</span>
                    <Badge variant="outline">48 hours</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Documentation
                </CardTitle>
                <CardDescription>
                  Complete guides and API documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleResourceClick("Documentation")}
                >
                  View Docs
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Tutorials
                </CardTitle>
                <CardDescription>
                  Step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleResourceClick("Video Tutorials")}
                >
                  Watch Videos
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Best Practices
                </CardTitle>
                <CardDescription>
                  Tips for successful NMBR campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleResourceClick("Best Practices Guide")}
                >
                  Read Guide
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                System Status
              </CardTitle>
              <CardDescription>
                Current status of all NMBR Platform services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">API Services</p>
                      <p className="text-sm text-gray-600">All systems operational</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Payment Processing</p>
                      <p className="text-sm text-gray-600">Stripe integration working normally</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Email Services</p>
                      <p className="text-sm text-gray-600">Notifications and newsletters working</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
