import { NextResponse } from "next/server"
import { createAdmin } from "@/lib/auth"

export async function POST() {
  try {
    // Create the initial super admin
    const result = await createAdmin(
      "Super Admin",
      "admin@smartedge.in",
      "admin123", // Change this to a secure password
      "SUPER_ADMIN",
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Super admin created successfully",
        admin: result.admin,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error creating super admin:", error)
    return NextResponse.json({ error: "Failed to create super admin" }, { status: 500 })
  }
}
