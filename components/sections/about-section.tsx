"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto">
        <Card className="bg-white border-4 border-green-500 hover:border-green-600 transition-all duration-500 shadow-xl retro-card">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
              {t("about.title")}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto font-medium">
              {t("about.description")}
            </p>
            <div className="mt-4 text-green-600 font-semibold text-center hover:text-green-700">
              <a href="/about/learn-more">Learn More →</a>
            </div>
          </CardContent>
        </Card>

        {/* Why This Ideathon Section */}
        <Card className="bg-white border-4 border-green-500 hover:border-green-600 transition-all duration-500 shadow-xl retro-card mt-8">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
              Why This Ideathon
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto font-medium space-y-2">
              <p>Focus on Northeast India - Assam</p>
              <p>Promoting sustainable development in fragile ecosystems</p>
              <p>Weaving a sustainable future through Innovation and Creativity</p>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
