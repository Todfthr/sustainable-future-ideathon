"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import LanguageSwitcher from "@/components/ui/language-switcher"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import OrganizerHeader from "@/components/layout/organizer-header"

export default function Header() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { name: t("nav.about"), href: "/#about" },
    { name: t("nav.objectives"), href: "/#objectives" },
    { name: t("nav.themes"), href: "/#themes" },
    { name: t("nav.participate"), href: "/#participate" },
    { name: t("nav.schedule"), href: "/#schedule" },
    { name: t("nav.judging"), href: "/#judging" },
    { name: t("nav.contact"), href: "/#contact" },
  ]

  const handleNavigation = (href: string) => {
    if (href.startsWith('/#')) {
      // For hash links, navigate to home page and then scroll
      router.push('/')
      setTimeout(() => {
        const element = document.querySelector(href.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      // For regular links, just navigate
      router.push(href)
    }
  }

  return (
    <>
      <OrganizerHeader />
      <nav className="w-full z-50 backdrop-blur-md bg-white/90 border-b-4 border-green-500 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-font">
              <div className="flex items-center">
                <Image
                  src={"/logo.png"}
                  alt="Hackathon Logo"
                  width={38}
                  height={38}
                  className="h-10 w-10 mr-2 rounded-full"
                />
                <span className="text-2xl">IDEATHON</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 relative group font-semibold"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 text-gray-700 hover:text-green-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-b-2 border-green-400">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigation(item.href)
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-green-600 font-semibold"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
