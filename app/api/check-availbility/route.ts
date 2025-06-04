import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json()

    if (!type || !value) {
      return NextResponse.json({ error: "Type and value are required" }, { status: 400 })
    }

    let isAvailable = true

    switch (type) {
      case "email":
        const existingUser = await prisma.user.findUnique({
          where: { email: value },
        })
        isAvailable = !existingUser
        break

      case "teamName":
        const existingTeam = await prisma.team.findFirst({
          where: { name: value },
        })
        isAvailable = !existingTeam
        break

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({
      available: isAvailable,
      message: isAvailable ? `${type} is available` : `${type} is already taken`,
    })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
