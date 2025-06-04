import { Suspense } from "react"
import { requireAdmin } from "@/lib/auth"
import AdminOverview from "@/components/admin/overview"

export default async function AdminDashboard() {
  // Ensure user is authenticated
  await requireAdmin()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        }
      >
        <AdminOverview />
      </Suspense>
    </div>
  )
}
