"use client"

import React from "react"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const judgingCriteria = [
  {
    title: "Innovation",
    points: "(20 points)",
    description: "Novelty and creativity of the solution.",
  },
  {
    title: "Impact",
    points: "(20 points)",
    description: "Potential for real-world impact and scalability.",
  },
  {
    title: "Presentation",
    points: "(10 points)",
    description: "Clarity and effectiveness of the pitch.",
  },
  {
    title: "Feasibility",
    points: "(15 points)",
    description: "Practicality and potential for implementation.",
  },
  {
    title: "Relevance",
    points: "(15 points)",
    description: "Alignment with the chosen theme and ideathon goals.",
  },
  {
    title: "Community Impact",
    points: "(15 points)",
    description: "Potential positive social and environmental impact.",
  },
  {
    title: "Bonus for Circular/Plastic Solutions",
    points: "(5 points)",
    description: "Additional points for solutions focusing on circular economy or plastic waste.",
  },
]

const juryMembers = [
  {
    name: "Dr. Pranav Kumar Singh",
    role: "Principal Investigator, STIHUB",
    img: "/jury_pranav_sir.jpeg",
  },
  {
    name: "Dr. Anuck Islary",
    role: "Co - Principal Investigator, STIHUB",
    img: "/jury_Anuck_Islary.jpeg",
  },
  {
    name: "Dr. Abhijit Padun",
    role: "Co - Principal Investigator,STIHUB",
    img: "/jury_Abhijit-Padun.jpeg",
  },
  {
    name: "Er. Dolly Bhasin",
    role: "Founder - SmartEdge",
    img: "/jury_DollyBhasin.jpg",
  },
  // {
  //   name: "Ishant Sachdeva",
  //   role: "Co-founder, B&S - Ventures",
  //   img: "/jury_IshantSachdeva.jpg",
  // },
]

export default function JudgingSection() {
  const { t } = useLanguage()

  return (
    <section id="judging" className="py-16 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900">
      <div className="container mx-auto">
        {/* Jury Members Section */}
        <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          {t("judging.title")}
        </h2>
        <h3 className="text-center text-xl font-semibold text-green-800 mb-12">
          {t("judging.jury_members")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {juryMembers.map((member) => (
            <Card key={member.name} className="bg-white border-3 border-green-400 hover:border-green-600 transition-all duration-300 shadow-lg retro-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-green-200">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h4>
                <p className="text-green-600">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Judging Criteria Section */}
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          {t("judging.criteria_title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {judgingCriteria.map((criterion) => (
            <Card
              key={criterion.title}
              className="bg-white border-4 border-green-500 shadow-xl retro-card transition-transform duration-300 hover:scale-105"
            >
              <CardContent className="p-4 flex justify-between items-center">
                <span className="text-gray-800 font-semibold">{criterion.title}</span>
                <span className="text-green-600 font-bold text-lg bg-green-100 px-3 py-1 rounded-full">
                  {criterion.points}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
