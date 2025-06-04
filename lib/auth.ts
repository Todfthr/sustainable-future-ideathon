"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcrypt"

// Session duration in seconds (24 hours)
const SESSION_DURATION = 24 * 60 * 60

export async function loginAdmin(email: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return { success: false, message: "Invalid email or password" }
    }

    const passwordMatch = await compare(password, admin.password)
    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create session
    const sessionToken = crypto.randomUUID()
    const expires = new Date(Date.now() + SESSION_DURATION * 1000)
    const cookiesStore = await cookies()
    // Store session in cookie
    ;cookiesStore.set("admin_session", sessionToken, {
      httpOnly: true,
      expires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    // Store admin ID in cookie for quick access
    ;
    cookiesStore.set("admin_id", admin.id, {
      httpOnly: true,
      expires,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return { success: true, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logoutAdmin() {
    const cookiesStore = await cookies()
  cookiesStore.delete("admin_session")
  cookiesStore.delete("admin_id")
  redirect("/admin/login")
}

export async function getAdminSession() {
    const cookiesStore = await cookies()
  const sessionToken = cookiesStore.get("admin_session")?.value
  const adminId = cookiesStore.get("admin_id")?.value

  if (!sessionToken || !adminId) {
    return null
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return admin
  } catch (error) {
    console.error("Session error:", error)
    
    return null
  }
}

export async function requireAdmin() {
  const admin = await getAdminSession()
  if (!admin) {
    redirect("/admin/login")
  }
  return admin
}

export async function requireSuperAdmin() {
  const admin = await getAdminSession()
  if (!admin) {
    redirect("/admin/login")
  }
  if (admin.role !== "SUPER_ADMIN") {
    redirect("/admin")
  }
  return admin
}

export async function createAdmin(
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "SUPER_ADMIN" = "ADMIN",
) {
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return { success: false, message: "Email already in use" }
    }

    const hashedPassword = await hash(password, 10)
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    return { success: true, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } }
  } catch (error) {
    console.error("Create admin error:", error)
    return { success: false, message: "An error occurred while creating admin" }
  }
}

export async function changePassword(adminId: string, currentPassword: string, newPassword: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return { success: false, message: "Admin not found" }
    }

    const passwordMatch = await compare(currentPassword, admin.password)
    if (!passwordMatch) {
      return { success: false, message: "Current password is incorrect" }
    }

    const hashedPassword = await hash(newPassword, 10)
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    })

    return { success: true, message: "Password changed successfully" }
  } catch (error) {
    console.error("Change password error:", error)
    return { success: false, message: "An error occurred while changing password" }
  }
}
