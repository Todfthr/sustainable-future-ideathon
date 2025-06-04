import React from "react";
import Image from "next/image";

const partners = [
  {
    name: "B&S Ventures",
    caption: "Venture Partner",
    img: "/partner_B&S.jpg",
  },
  {
    name: "Ideashacks Ventures",
    caption: "Coworking & Venture Partner",
    img: "/partner_IDEASHACKSVENTURES.png",
  },
  {
    name: "Incuspaze",
    caption: "Incubation Partner",
    img: "/partner_incuspaze.svg",
  },
  {
    name: "Strong Moments",
    caption: "Technology Partner",
    img: "/partner_StrongMoments.png",
  },
  {
    name: "Fluxor",
    caption: "Supporting Partner",
    img: "/partner_webhacks.png",
  },
  {
    name: "ImpactX",
    caption: "Media Partner",
    img: "/partner_ImpactX.webp",
  },
];

export default function PartnerPanel() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-heading">
          OUR PARTNERS
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-10 animate-fade-in-up">
          {partners.map((partner) => (
            <div key={partner.name} className="flex flex-col items-center w-64">
              <div className="bg-white border-4 border-green-500 shadow-xl rounded-xl p-4 mb-2 w-56 h-32 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                <Image
                  src={partner.img}
                  alt={partner.name}
                  width={200}
                  height={80}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-800 text-base leading-tight">
                  {partner.name}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {partner.caption}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 