"use client"

import { useState } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import RegistrationForm from "@/components/forms/registration-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-green-300/20 rotate-45 animate-spin-slow"></div>
      </div>

      <Header />
      
      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-title">
              Register for Ideathon
            </h1>
            <p className="text-lg text-gray-700">
              Join the Sustainable Future Ideathon and help create innovative solutions for a better tomorrow
            </p>
          </div>
          
          <RegistrationForm />
        </div>
      </div>

      <Footer />
    </div>
  )
}
