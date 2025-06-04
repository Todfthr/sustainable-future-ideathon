import React from 'react';
import Image from 'next/image';

export default function OrganizerHeader() {
  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-900 py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side logos */}
        <div className="flex items-center space-x-4">
          <a href="https://stihub.cit.ac.in/" target="_blank" rel="noopener noreferrer">
            <Image
              src="/headerlogo_dst-logo-nobg.png" 
              alt="STIHUB Logo"
              width={150}
              height={75}
              className="object-contain"
              priority
            />
          </a>
          <a href="https://stihub.cit.ac.in/" target="_blank" rel="noopener noreferrer">
            <Image
              src="/CIT-logo.jpg"
              alt="CIT Logo"
              width={150}
              height={75}
              className="object-contain"
              priority
            />
          </a>
        </div>

        {/* SmartEdge Logo (Right) */}
        <div className="flex items-center">
          <a href="https://www.smartedge.work" target="_blank" rel="noopener noreferrer">
            <Image
              src="/headerlogo_smartedgelogo-big.png"
              alt="SmartEdge Logo"
              width={225}
              height={75}
              className="object-contain"
              priority
            />
          </a>
        </div>
      </div>
    </div>
  );
}