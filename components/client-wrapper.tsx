"use client"

import React, { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import HeroSection from "@/components/sections/hero-section"

interface ClientWrapperProps {
  children: React.ReactNode
}

interface HeroSectionProps {
  scrollY: number
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [scrollY, setScrollY] = useState(0)
  const { language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Find and clone only the HeroSection component with scrollY prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<HeroSectionProps>(child) && child.type === HeroSection) {
      return React.cloneElement(child, { scrollY })
    }
    return child
  })

  return <>{childrenWithProps}</>
} 