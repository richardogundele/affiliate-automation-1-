"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings2, Package, Megaphone, Bell, Users } from "lucide-react"

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Products", icon: Package, href: "/products" },
  { name: "Campaigns", icon: Megaphone, href: "/campaigns" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Leads", icon: Users, href: "/leads" },
  // { name: "Settings", icon: Settings2, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-purple-600">AffilAI</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-4">Welcome Richard</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-600 font-semibold mr-3">
            AA
          </div>
          <div>
            <p className="text-sm font-medium">Abdul Aziz</p>
            <p className="text-xs text-gray-500">app@jesusintech.ai</p>
          </div>
        </div>
      </div>
    </div>
  )
}

