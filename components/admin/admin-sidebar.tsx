"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Tag, Award, UserCog, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AdminSidebarProps {
  adminName: string
  adminRole: string
  onLogout: () => void
}

export default function AdminSidebar({ adminName, adminRole, onLogout }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      name: "Teams",
      href: "/admin/teams",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Submissions",
      href: "/admin/submissions",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Themes",
      href: "/admin/themes",
      icon: <Tag className="w-5 h-5" />,
    },
    {
      name: "Judges",
      href: "/admin/judges",
      icon: <Award className="w-5 h-5" />,
    },
  ]

  // Only show admin users management for super admins
  if (adminRole === "SUPER_ADMIN") {
    navItems.push({
      name: "Admin Users",
      href: "/admin/users",
      icon: <UserCog className="w-5 h-5" />,
    })
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and title */}
          <div className="flex items-center justify-center p-4 border-b border-gray-200">
            <Image
              src="/logo.png"
              alt="Sustainable Future Ideathon Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <div className="ml-3 text-lg font-bold text-green-600">Admin Panel</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        isActive ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500">{adminRole}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  )
}
