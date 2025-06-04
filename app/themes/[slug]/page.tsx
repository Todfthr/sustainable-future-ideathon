"use client"

import { useParams } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Lightbulb, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { themeData } from "@/lib/theme-data"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

export default function ThemePage() {
  const params = useParams()
  const { t } = useLanguage()
  const slug = params.slug as string

  const theme = themeData[slug]

  if (!theme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Header />
        <div className="pt-32 px-6 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Theme Not Found</h1>
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-green-300/20 rotate-45 animate-spin-slow"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-green-100 to-white">
        <div className="container mx-auto">
          <Link href="/#themes">
            <Button variant="ghost" className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Themes
            </Button>
          </Link>

          <div className="text-center mb-12">
            <div className="text-6xl mb-6 bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              {theme.icon}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-title">
              {theme.title}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">{theme.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <Card className="bg-white border-4 border-green-500 shadow-xl retro-card mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
                Overview
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {theme.overview.map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Challenges Section */}
      {theme.challenges && (
        <section className="py-12 px-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
              Key Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {theme.challenges.map((challenge: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; impact: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                <Card
                  key={index}
                  className="bg-white border-3 border-green-400 hover:border-green-600 transition-all duration-300 shadow-lg retro-card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-green-800">{challenge.title}</h3>
                        <p className="text-gray-700">{challenge.description}</p>
                        {challenge.impact && (
                          <p className="text-sm text-red-600 mt-2 font-medium">
                            <strong>Impact:</strong> {challenge.impact}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Problem Areas Section */}
      {theme.problemAreas && (
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
              Problem Areas to Ideate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {theme.problemAreas.map((area: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                <Card
                  key={index}
                  className="bg-white border-3 border-green-400 hover:border-green-600 transition-all duration-300 shadow-lg retro-card"
                >
                  <CardContent className="p-6">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-green-800">{area.title}</h3>
                    <p className="text-gray-700">{area.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Innovation Opportunities Section */}
      {theme.opportunities && (
        <section className="py-12 px-6 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
              Innovation Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {theme.opportunities.map((opportunity: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                <Card
                  key={index}
                  className="bg-white border-3 border-green-400 hover:border-green-600 transition-all duration-300 shadow-lg retro-card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-green-800">{opportunity.title}</h3>
                        <p className="text-gray-700">{opportunity.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 px-6">
        <div className="container mx-auto text-center">
          <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
                Ready to Innovate?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Join the Sustainable Future Ideathon and help create solutions for {theme.title.toLowerCase()}
              </p>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 retro-button">
                  Register Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
