"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award } from "lucide-react"

export default function ParticipateSection() {
  const { t } = useLanguage()

  return (
    <section id="participate" className="py-20 px-6 bg-gradient-to-r from-emerald-50 to-green-50">
      <div className="container mx-auto">
        <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
              {t("participate.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">{t("participate.eligibility.title")}</h3>
                <p className="text-gray-700">{t("participate.eligibility.description")}</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">{t("participate.team.title")}</h3>
                <p className="text-gray-700">{t("participate.team.description")}</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">{t("participate.process.title")}</h3>
                <p className="text-gray-700">{t("participate.process.description")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
