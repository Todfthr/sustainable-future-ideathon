"use client"

import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import ContactForm from "@/components/forms/contact-form"

export default function ContactSection() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto">
        <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
              {t("contact.title")}
            </h2>
            
            <div className="grid grid-cols-1  gap-8">
               {/* Contact Form */}
               <div >
                <ContactForm />
              </div>
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-800 font-semibold">{t("contact.email")}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Phone className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-800 font-semibold">{t("contact.phone")}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-800 font-semibold">{t("contact.address")}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-700 mb-4">Visit our websites:</p>
                  <div className="space-y-2">
                    <a 
                      href={`https://${t("contact.website")}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-semibold block"
                    >
                      {t("contact.website")}
                    </a>
                    <a 
                      href={t("contact.stihub_website")} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-semibold block"
                    >
                      {t("contact.stihub_website")}
                    </a>
                  </div>
                </div>
              </div>

             
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
