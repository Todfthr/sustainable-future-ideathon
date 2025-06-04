import Image from "next/image";

export default function AboutLearnHeader() {
  return (
    <header className="w-full bg-white/90 border-b-4 border-green-500 shadow-lg z-50">
      <div className="container mx-auto px-6 py-4 flex items-center">
        <div className="flex items-center">
          <Image
            src="/about-header.png"
            alt="About Page Header"
            width={64}
            height={64}
            className="h-16 w-16 mr-4 rounded-full object-cover"
            priority
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent retro-font">
            About the Ideathon
          </span>
        </div>
      </div>
    </header>
  );
} 