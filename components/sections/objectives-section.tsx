"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Users, Leaf } from "lucide-react"

export default function ObjectivesSection() {
  const { t } = useLanguage()

  const objectives = [
    {
      icon: <Lightbulb className="w-12 h-12 text-green-600" />,
      title: t("objectives.innovative.title"),
      description: t("objectives.innovative.description"),
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: t("objectives.engage.title"),
      description: t("objectives.engage.description"),
    },
    {
      icon: <Leaf className="w-12 h-12 text-green-600" />,
      title: t("objectives.promote.title"),
      description: t("objectives.promote.description"),
    },
  ]

  return (
    <section id="objectives" className="py-20 px-6 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          {t("objectives.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {objectives.map((objective, index) => (
            <Card
              key={index}
              className="bg-white border-3 border-green-400 hover:border-green-600 transform hover:scale-105 transition-all duration-500 shadow-lg retro-card"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-green-100 rounded-full">{objective.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-green-800">{objective.title}</h3>
                <p className="text-gray-700">{objective.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
