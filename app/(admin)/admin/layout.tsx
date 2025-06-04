import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { getAdminSession, logoutAdmin } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Check if user is logged in
  const admin = await getAdminSession()
  // If not logged in and not on login page, redirect to login
  // Get the current pathname from the server-side context
  const pathname = typeof window === "undefined" ? (require('next/navigation').usePathname?.() ?? "") : window.location.pathname;

//   if (!admin && !pathname.includes("/admin/login")) {
//     redirect("/admin/login")
//   }

  // If logged in and on login page, redirect to admin dashboard
//   if (admin && pathname.includes("/admin/login")) {
//     redirect("/admin")
//   }

  // If not logged in, just render the children (login page)
  if (!admin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar adminName={admin?.name} adminRole={admin?.role} onLogout={logoutAdmin} />

      <div className="lg:pl-64">
        <AdminHeader adminName={admin?.name} onLogout={logoutAdmin} />

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
