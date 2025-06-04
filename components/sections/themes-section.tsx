"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function ThemesSection() {
  const { t } = useLanguage()

  const themes = [
    {
      icon: "👗",
      title: t("themes.fashion.title"),
      description: t("themes.fashion.description"),
      slug: "sustainable-fashion",
    },
    {
      icon: "🌱",
      title: t("themes.food.title"),
      description: t("themes.food.description"),
      slug: "sustainable-food",
    },
    {
      icon: "🌍",
      title: t("themes.tourism.title"),
      description: t("themes.tourism.description"),
      slug: "sustainable-tourism",
    },
    {
      icon: "♻️",
      title: t("themes.plastic.title"),
      description: t("themes.plastic.description"),
      slug: "plastic-waste",
    },
    {
      icon: "🔄",
      title: t("themes.waste.title"),
      description: t("themes.waste.description"),
      slug: "circular-economy",
    },
  ]

  return (
    <section id="themes" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          {t("themes.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <Link key={index} href={`/themes/${theme.slug}`}>
              <Card className="bg-white border-3 border-green-400 hover:border-green-600 transform hover:scale-105 transition-all duration-500 group shadow-lg retro-card cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    {theme.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-green-800">{theme.title}</h3>
                  <p className="text-gray-700">{theme.description}</p>
                  <div className="mt-4 text-green-600 font-semibold group-hover:text-green-700">Learn More →</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
