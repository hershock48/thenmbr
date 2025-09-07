import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, User } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search nonprofits, users, or transactions..."
            className="pl-10 w-full border-0 bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="hover:bg-slate-50">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="hover:bg-slate-50">
          <User className="h-4 w-4" />
          <span className="ml-2 font-medium text-slate-700">Admin User</span>
        </Button>
      </div>
    </header>
  )
}
