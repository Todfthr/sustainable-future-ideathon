"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/language-context"
import { Mail, Phone, User, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { FORMCARRY_CONFIG } from "@/lib/formcarry-config"

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export default function ContactForm() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create a plain object with the form data
      const formDataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        _replyto: formData.email,
        _subject: "New Contact Form Submission from IDEATHON",
        _to: FORMCARRY_CONFIG.recipientEmail,
        _cc: FORMCARRY_CONFIG.recipientEmail,
        _autoresponse: "Thank you for contacting IDEATHON. We have received your message and will get back to you soon.",
        _template: "default",
        _captcha: "false",
        _honeypot: "false",
        _redirect: "false",
        _ajax: "true",
        _email: FORMCARRY_CONFIG.recipientEmail
      }

      console.log("Sending form data:", formDataToSend) // Debug log

      const response = await fetch(`${FORMCARRY_CONFIG.endpoint}/${FORMCARRY_CONFIG.formId}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      })

      console.log("Response status:", response.status) // Debug log

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("Form submission error details:", errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Form submission result:", result) // Debug log
      
      if (result.status === "success") {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        throw new Error(result.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white border-4 border-green-500 shadow-xl retro-card">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800 retro-heading">
          <MessageSquare className="w-6 h-6 mr-2" />
          Send us a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="border-2 border-green-300 focus:border-green-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="border-2 border-green-300 focus:border-green-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              className="border-2 border-green-300 focus:border-green-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-gray-700 font-semibold flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => updateFormData("message", e.target.value)}
              className="border-2 border-green-300 focus:border-green-500 min-h-[150px]"
              placeholder="Enter your message..."
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white retro-button"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 