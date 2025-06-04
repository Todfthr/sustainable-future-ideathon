import Image from "next/image";

export default function MainTopHeader() {
  return (
    <div className="w-full bg-white flex items-center border-b border-green-200 px-6 py-2 z-50">
      <div className="container mx-auto flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="h-12 w-12 mr-3 rounded-full object-cover"
          priority
        />
        {/* You can add more content here if needed */}
      </div>
    </div>
  );
} 