"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function MentorSection() {
  const { t } = useLanguage()

  return (
    <section id="mentors" className="py-20 px-6 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          {t("mentors.title")}
        </h2>
        <div className="text-center text-gray-700">
          <p>{t("mentors.description")}</p>
        </div>
      </div>
    </section>
  )
} 