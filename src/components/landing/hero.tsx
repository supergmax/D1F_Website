"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToAbout = () => {
    const target = document.getElementById("about")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background dark:bg-background">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-background to-[#CABA9F]/60 dark:to-primary/60 z-0" /> {/*    from-grey-50 to-white  */}

  {/* SVG background filling entire hero section, aligned right */}
  <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none flex justify-end">
    <Image
      src="/images/hero-bg.svg" // Update path if needed
      alt="Decorative Background"
      fill
      className="object-contain dark:invert" // Assuming hero-bg.svg is dark, invert for dark mode
      priority
    />
  </div>

  {/* Foreground content */}
  <div
    className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
      isVisible ? "opacity-100" : "opacity-0"
    } z-10`}
  >
    <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
      <div className="mb-8 transform scale-150">
        <Image
          src="/images/WUF.svg"
          alt="With Us Funded"
          width={400}
          height={100}
          className="h-auto dark:invert" // Assuming WUF.svg is dark, invert for dark mode visibility
        />
      </div>

      <h2 className="py-12 text-xl sm:text-lg md:text-2xl lg:text-3xl font-light text-primary dark:text-secondary mt-4 tracking-wide text-center">
        CHALLENGE YOURSELF WITHOUT LIMITS
      </h2>

      <button
        onClick={scrollToAbout}
        className="mt-12 px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 font-medium"
      >
        Discover Us
      </button>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div
    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-10"
    onClick={scrollToAbout}
  >
    <span className="text-primary dark:text-secondary text-sm font-medium mb-2 tracking-wider">SCROLL</span>
    <ChevronDown size={24} className="text-primary dark:text-secondary animate-bounce" />
  </div>
</div>

  )
}
