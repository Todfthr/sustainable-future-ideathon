"use client"

import { useLanguage } from "@/context/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="py-8 px-6 border-t-4 border-green-500 bg-white">
      <div className="container mx-auto text-center">
        <p className="text-gray-700 font-semibold">{t("footer.copyright")}</p>
      </div>
    </footer>
  )
}
