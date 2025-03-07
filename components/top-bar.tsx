import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TopBar() {
  return (
    <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-8 pr-4 py-2" placeholder="Search..." />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

