import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, Menu, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/60 bg-white/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button variant="ghost" size="sm" className="lg:hidden hover:bg-cyan-50">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400 pl-3" />
          <Input
            placeholder="Search NMBRs, subscribers..."
            className="pl-10 border-0 bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Quick Actions */}
        <Button size="sm" className="hidden sm:flex bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New NMBR
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500 hover:bg-orange-500 border-2 border-white">
            3
          </Badge>
        </Button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-slate-50">
              <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">JS</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 shadow-lg border-slate-200" align="end">
            <div className="flex items-center justify-start gap-2 p-3 border-b border-slate-100">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-semibold text-slate-900">Jane Smith</p>
                <p className="w-[200px] truncate text-sm text-slate-500">admin@hopefoundation.org</p>
              </div>
            </div>
            <DropdownMenuItem className="hover:bg-slate-50">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">Organization Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">Billing</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-red-50 text-red-600">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
