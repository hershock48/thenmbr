import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Search, Filter, Edit, Eye, Share2, MoreHorizontal, ImageIcon, Video, Target, Home } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

export default function NMBRsPage() {
  const nmbrs = [
    {
      id: 1,
      code: "HOPE001",
      title: "Clean Water for Village",
      story:
        "This bracelet represents our mission to bring clean water to a remote village in Kenya. Every donation helps us get closer to installing a sustainable water system that will serve 500 families.",
      subscribers: 89,
      raised: 3250,
      goal: 5000,
      status: "active",
      image: "/water-well-village.jpg",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      code: "HOPE002",
      title: "School Supplies Drive",
      story:
        "Education is the key to breaking the cycle of poverty. This NMBR supports our school supplies drive, providing books, pencils, and learning materials to children in underserved communities.",
      subscribers: 156,
      raised: 4800,
      goal: 3000,
      status: "completed",
      image: "/school-children-books.jpg",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      code: "HOPE003",
      title: "Medical Equipment Fund",
      story:
        "Our local clinic desperately needs new medical equipment to serve the community better. This NMBR helps us raise funds for essential medical devices that will save lives.",
      subscribers: 203,
      raised: 7200,
      goal: 10000,
      status: "active",
      image: "/medical-equipment-clinic.jpg",
      createdAt: "2024-01-08",
    },
  ]

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-slate-900 font-medium">NMBRs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">NMBRs</h1>
          <p className="text-slate-600 text-lg">Manage your bracelet campaigns and their stories</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Create New NMBR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">Create New NMBR</DialogTitle>
              <DialogDescription className="text-slate-600">
                Create a new bracelet campaign with its associated story and fundraising goal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-slate-700 font-medium">
                    NMBR Code
                  </Label>
                  <Input
                    id="code"
                    placeholder="e.g., HOPE005"
                    className="border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-slate-700 font-medium">
                    Fundraising Goal ($)
                  </Label>
                  <Input
                    id="goal"
                    type="number"
                    placeholder="5000"
                    className="border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 font-medium">
                  Campaign Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Emergency Relief Fund"
                  className="border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story" className="text-slate-700 font-medium">
                  Story
                </Label>
                <Textarea
                  id="story"
                  placeholder="Tell the compelling story behind this NMBR..."
                  className="min-h-32 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Media</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 bg-transparent">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 bg-transparent">
                    <Video className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50 bg-transparent">
                  Save as Draft
                </Button>
                <Button className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800">
                  Create & Activate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search NMBRs..."
                className="pl-9 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40 border-slate-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-raised">Most Raised</SelectItem>
                <SelectItem value="most-subscribers">Most Subscribers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* NMBRs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nmbrs.map((nmbr) => (
          <Card
            key={nmbr.id}
            className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              <img
                src={nmbr.image || "/placeholder.svg"}
                alt={nmbr.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <Badge
                className={`absolute top-3 right-3 shadow-lg ${
                  nmbr.status === "active"
                    ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                    : nmbr.status === "completed"
                      ? "bg-blue-500 hover:bg-blue-500 text-white"
                      : "bg-slate-500 hover:bg-slate-500 text-white"
                }`}
              >
                {nmbr.status}
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-slate-900 mb-1">{nmbr.title}</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Code: {nmbr.code}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="shadow-lg border-slate-200">
                    <DropdownMenuItem className="hover:bg-slate-50">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Story
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50">
                      <Share2 className="w-4 h-4 mr-2" />
                      Get Widget Code
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50">
                      <Target className="w-4 h-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">{nmbr.story}</p>

              {/* Progress */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Progress</span>
                  <span className="font-bold text-slate-900">
                    ${nmbr.raised.toLocaleString()} / ${nmbr.goal.toLocaleString()}
                  </span>
                </div>
                <Progress value={(nmbr.raised / nmbr.goal) * 100} className="h-3 bg-slate-100" />
                <div className="text-xs text-slate-500 font-medium">
                  {Math.round((nmbr.raised / nmbr.goal) * 100)}% of goal reached
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 font-medium">{nmbr.subscribers} subscribers</span>
                <span className="text-slate-500">Created {new Date(nmbr.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
