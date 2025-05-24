"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)

        if (!hasScrolled) {
          setHasScrolled(true)
          setIsVisible(true)
        }
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasScrolled])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/images/logo.svg" alt="With Us Associates" width={120} height={60} className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${isActive("/") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${isActive("/about") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
            >
              About Us
            </Link>
            {/* <Link
              href="/services"
              className={`font-medium transition-colors ${isActive("/services") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
            >
              Servicess
            </Link> */}
            <Link
              href="/process"
              className={`font-medium transition-colors ${isActive("/process") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
            >
              Our Process
            </Link>
            <Link
              href="/faq"
              className={`font-medium transition-colors ${isActive("/faq") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`font-medium transition-colors ${isActive("/contact") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="outline" className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#4E463F] text-white hover:bg-[#CABA9F]">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-[#4E463F]">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <nav className="flex flex-col space-y-4 px-4">
              <Link
                href="/"
                className={`font-medium transition-colors ${isActive("/") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`font-medium transition-colors ${isActive("/about") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              {/* <Link
                href="/services"
                className={`font-medium transition-colors ${isActive("/services") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link> */}
              <Link
                href="/process"
                className={`font-medium transition-colors ${isActive("/process") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Process
              </Link>
              <Link
                href="/faq"
                className={`font-medium transition-colors ${isActive("/faq") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className={`font-medium transition-colors ${isActive("/contact") ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Link href="/signin">
                <Button
                  variant="outline"
                  className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white w-full"
                >
                  Login
                </Button></Link>
                <Link href="/signup">
                <Button className="bg-[#4E463F] text-white hover:bg-[#CABA9F] w-full">Register</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
