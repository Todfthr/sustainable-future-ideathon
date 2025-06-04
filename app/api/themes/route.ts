import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        icon: true,
        subtitle: true,
        description: true,
      },
      orderBy: {
        title: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      data: themes,
    })
  } catch (error) {
    console.error("Error fetching themes:", error)
    return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 })
  }
}
