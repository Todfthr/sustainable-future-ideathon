"use client"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface HeroSectionProps {
  scrollY: number
}

export default function HeroSection({ scrollY }: HeroSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 bg-gradient-to-b from-green-100 to-white">
      <div className="text-center z-10 px-6" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
        {/* Logo in Hero */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Sustainable Future Ideathon Logo"
            width={120}
            height={120}
            className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-4"
          />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent retro-title animate-pulse">
          {t("hero.title")}
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-gray-700 font-semibold">{t("hero.date")}</p>
        <p className="text-lg mb-8 text-gray-600">{t("hero.organizer")}</p>
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-green-800 retro-subtitle">{t("hero.tagline")}</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">{t("hero.description")}</p>
          <Link href="/register">
            <Button className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 retro-button">
              {t("hero.register")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-green-600" />
      </div>
    </section>
  )
}
