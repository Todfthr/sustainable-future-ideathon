"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  adminName: string
  onLogout: () => void
}

export default function AdminHeader({ adminName, onLogout }: AdminHeaderProps) {
  const pathname = usePathname()

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard"
    if (pathname.startsWith("/admin/teams")) return "Teams Management"
    if (pathname.startsWith("/admin/submissions")) return "Submissions Management"
    if (pathname.startsWith("/admin/themes")) return "Themes Management"
    if (pathname.startsWith("/admin/judges")) return "Judges Management"
    if (pathname.startsWith("/admin/users")) return "Admin Users Management"
    if (pathname.startsWith("/admin/login")) return "Admin Login"
    return "Admin Panel"
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>

        <div className="flex items-center space-x-4">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm">
              View Site
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                <User className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">{adminName}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={onLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
