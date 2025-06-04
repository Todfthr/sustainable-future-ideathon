"use client"

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Target, Globe, Leaf } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import Header from "@/components/layout/header";
import OrganizerHeader from "@/components/layout/organizer-header";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";

export default function AboutLearnMorePage() {
  const { t } = useLanguage();
  const router = useRouter();

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

      <div className="pt-[180px]">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="space-y-8">
            {/* STIHUB Card */}
            <div className="bg-white border-4 border-green-500 shadow-xl retro-card rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">STIHUB</h2>
              <p className="text-lg text-gray-700 text-center">
                STIHub is a S & T Ministry funded hub at a Central Institute of Technology (Deemed University) at Kokrajhar, Assam.
                <a href="https://stihub.cit.ac.in" target="_blank" rel="noopener noreferrer" className="text-green-700 underline ml-1">Website</a>
              </p>
            </div>

            {/* SmartEdge Card */}
            <div className="bg-white border-4 border-green-500 shadow-xl retro-card rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">SmartEdge</h2>
              <div className="text-lg text-gray-700 text-center space-y-2">
                <p>Ideathon is Powered by <span className="font-semibold">SmartEdge</span> – A Platform for Innovators and Creators</p>
                <p>Past impact: <span className="font-semibold">50000+</span> students/entrepreneurs</p>
              </div>
            </div>

            {/* Background of the Theme Section */}
            <div className="bg-white border-4 border-green-500 shadow-xl retro-card rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Background of the Theme</h2>


                            {/* What is Sustainable Future */}
                            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                  <Leaf className="w-6 h-6 mr-2" />
                  What is Sustainable Future?
                </h3>
                <p className="text-gray-700 mb-4 ">
                  A sustainable future is a future where the needs of the present are met without compromising the ability of future generations to meet their needs. 
                  It involves moving towards a circular economy that is resource-efficient and away from a linear economy that produces waste.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card className="border-2 border-green-300">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-700 mb-2 ">Key Factors</h4>
                      <ul className="list-disc ml-4 list-item text-gray-700 space-y-2">
                        <li>Energy: Shift in energy production to reduce emissions</li>
                        <li>Economic, social, and political challenges</li>
                        <li>Engagement with complex challenges</li>
                        <li>Good decision-making</li>
                        <li>Collaborative innovation space</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* UN Sustainable Development Goals */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                  <Globe className="w-6 h-6 mr-2" />
                  UN Sustainable Development Goals
                </h3>
                <p className="text-gray-700 mb-4">
                  The United Nations Sustainable Development Goals provide a framework for addressing global challenges such as poverty, inequality, and climate change. 
                  Each of the 17 goals represents a key aspect of sustainability.
                </p>
              </div>
              
              {/* Themes Background Image */}
              <div className="mb-8">
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/Themes_background.jpg"
                    alt="Themes Background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              


              {/* SDG Focus of the Ideathon */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  SDG Focus of the Ideathon
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    The Sustainable Future Ideathon is based on <strong>SDG Goal 12 – Responsible Consumption & Production</strong>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-2 border-green-300">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-green-700 mb-2">Main Sectors</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          <li>Sustainable Fashion</li>
                          <li>Sustainable Tourism</li>
                          <li>Sustainable Food</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-green-300">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-green-700 mb-2">Additional Focus Areas</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          <li>Combating Plastic Use</li>
                          <li>Waste to Wealth Conversion</li>
                          <li>Circular Economy Model</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
                                {/* SDG12 Image */}
                                <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/Sustaianable Future SDG12.png"
                    alt="Sustainable Future SDG12"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/">
              <span className="text-green-600 hover:text-green-800 font-semibold underline">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}