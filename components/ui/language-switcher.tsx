"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)

  const handleLanguageChange = (lang: "en" | "as" | "hi") => {
    setLanguage(lang)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:bg-green-50"
        >
          <Globe size={16} />
          <span>{t(`language.${language}`)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-2 border-green-400">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`${language === "en" ? "bg-green-100" : ""} text-gray-700 hover:bg-green-100 hover:text-green-700`}
        >
          {t("language.en")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("as")}
          className={`${language === "as" ? "bg-green-100" : ""} text-gray-700 hover:bg-green-100 hover:text-green-700`}
        >
          {t("language.as")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("hi")}
          className={`${language === "hi" ? "bg-green-100" : ""} text-gray-700 hover:bg-green-100 hover:text-green-700`}
        >
          {t("language.hi")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
