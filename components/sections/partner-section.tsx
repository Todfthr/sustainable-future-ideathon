"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function PartnerSection() {
  const { t } = useLanguage()

  const partners = [
    {
      name: "ImpactX Media",
      image: "/partners/impactx.png",
      role: "Media Partner"
    },
    {
      name: "Ideashacks",
      image: "/partners/ideashacks.png",
      role: "Coworking Partner"
    },
    {
      name: "WebHacks",
      image: "/partners/webhacks.png",
      role: "Hacker Community"
    },
    {
      name: "SmartEdge Community",
      image: "/partners/smartedge.png",
      role: "Community Partner"
    }
  ]

  return (
    <section id="partners" className="py-20 px-6 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          {t("partners.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <Card key={index} className="bg-white border-3 border-green-400 hover:border-green-600 transition-all duration-300 shadow-lg retro-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-1">{partner.name}</h4>
                <p className="text-green-600">{partner.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 