import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
const themes = [
  {
    slug: "sustainable-fashion",
    title: "Sustainable Fashion",
    icon: "👗",
    subtitle: "Revolutionize the fashion industry with eco-friendly innovations",
    description:
      "Sustainable fashion refers to clothing and practices that are environmentally friendly, socially responsible, and economically viable, aiming to reduce the negative impacts of the fashion industry on the planet and its people.",
  },
  {
    slug: "sustainable-food",
    title: "Sustainable Food & Nutrition",
    icon: "🌱",
    subtitle: "Transform food systems for environmental sustainability and food security",
    description:
      "This theme focuses on generating innovative ideas related to the food industry, from agriculture and food production to consumption and sustainability.",
  },
  {
    slug: "sustainable-tourism",
    title: "Sustainable Tourism",
    icon: "🌍",
    subtitle: "Create responsible travel solutions for Northeast India and beyond",
    description:
      "Sustainable tourism in Northeast India faces unique challenges due to the region's ecological fragility, cultural diversity, and infrastructure limitations.",
  },
  {
    slug: "plastic-waste",
    title: "Combating Plastic Waste",
    icon: "♻️",
    subtitle: "Innovative solutions to eliminate plastic pollution in fashion, food, and tourism",
    description:
      "Plastic pollution exacerbates the deadly impacts of the triple planetary crisis: climate change, nature and biodiversity loss, and pollution and waste.",
  },
  {
    slug: "circular-economy",
    title: "Circular Economy",
    icon: "🔄",
    subtitle: "Converting waste into valuable resources in fashion, food, and tourism sectors",
    description:
      "A circular model is essential for achieving a sustainable future in the sectors of Tourism, Food, and Fashion because these sectors are resource-intensive, waste-generating, and environmentally impactful.",
  },
]

export async function POST() {
  try {
    // Delete existing themes
    await prisma.theme.deleteMany()

    // Create new themes
    const createdThemes = await prisma.theme.createMany({
      data: themes,
    })

    return NextResponse.json({
      success: true,
      message: `${createdThemes.count} themes created successfully`,
    })
  } catch (error) {
    console.error("Error seeding themes:", error)
    return NextResponse.json({ error: "Failed to seed themes" }, { status: 500 })
  }
}
