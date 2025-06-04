"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"

export default function ScheduleSection() {
  const { t } = useLanguage()

  const schedule = [
    { date: "June 5, 2025", event: t("schedule.announcement"), icon: "📅" },
    { date: "July 30, 2025", event: t("schedule.registration"), icon: "⏳" },
    { date: "August 5, 2025", event: t("schedule.launch"), icon: "🚀" },
    { date: "August 6, 2025", event: t("schedule.submission_begin"), icon: "💡" },
    { date: "August 6, 2025", event: t("schedule.submission_close"), icon: "🔒" },
    { date: "August 7, 2025", event: t("schedule.shortlist"), icon: "✅" },
    { date: "August 7, 2025", event: t("schedule.presentation"), icon: "🎤" },
    { date: "August 7, 2025", event: t("schedule.results"), icon: "🏆" },
  ]

  return (
    <section id="schedule" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          {t("schedule.title")}
        </h2>
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <Card
              key={index}
              className="bg-white border-l-8 border-green-500 hover:border-green-600 transform hover:translate-x-2 transition-all duration-300 shadow-lg retro-card"
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="text-2xl bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <span className="text-green-600 font-bold min-w-[120px]">{item.date}</span>
                    <span className="text-gray-800 font-semibold">{item.event}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
