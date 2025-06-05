"use client"

import React from "react"
import { useEffect, useState } from "react"
import Header from "@/components/layout/header"
import OrganizerHeader from "@/components/layout/organizer-header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import AboutSection from "@/components/sections/about-section"
import ObjectivesSection from "@/components/sections/objectives-section"
import ThemesSection from "@/components/sections/themes-section"
import ParticipateSection from "@/components/sections/participate-section"
import ScheduleSection from "@/components/sections/schedule-section"
import JudgingSection from "@/components/sections/judging-section"
import ContactSection from "@/components/sections/contact-section"
import PartnerPanel from "@/components/sections/partner-panel"
import { useLanguage } from "@/context/language-context"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const { language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-lime-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        {/* Retro geometric shapes */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-green-300/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-bounce-slow"></div>
      </div>

      <div className="fixed top-0 w-full z-50">
        <OrganizerHeader />
        <Header />
      </div>

      <div className="pt-[120px]">
        <HeroSection scrollY={scrollY} />
        <AboutSection />
        <ObjectivesSection />
        <ThemesSection />
        <ParticipateSection />
        <ScheduleSection />
        <JudgingSection />
        <ContactSection />
        <PartnerPanel />
      </div>

      <Footer />
    </div>
  )
}
