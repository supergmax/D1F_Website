"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/landing/button"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isMainPage = pathname === "/"

  // Removed hasScrolled state as it's not needed with the simplified logic
  // const [hasScrolled, setHasScrolled] = useState(false) 

  useEffect(() => {
    if (!isMainPage) {
      setIsScrolled(true)
      setIsVisible(true)
      return // No scroll listener needed for non-main pages, header is always visible and "scrolled"
    }

    // Initial state for main page: header starts hidden and transparent
    // setIsVisible should default to false or be set to false here for main page initial load
    // However, to avoid flash of content, initial state is set via class opacity-0
    // We only need to manage changes on scroll for the main page.
    // Let's ensure initial states for main page are set correctly before scroll listener.
    setIsScrolled(window.scrollY > 10);
    setIsVisible(window.scrollY > 10); // Initially visible if already scrolled, else hidden

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
        setIsVisible(true)
      } else {
        setIsScrolled(false)
        setIsVisible(false) // Hide when scrolled to top on main page
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMainPage]) // Rerun effect if isMainPage changes

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isMainPage
          ? `${isScrolled ? "bg-background dark:bg-card shadow-md dark:shadow-gray-700 py-2" : "bg-transparent py-4"} ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
            }`
          : "bg-background dark:bg-card shadow-md dark:shadow-gray-700 py-2 opacity-100 translate-y-0"
      }`}
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
              className={`font-medium transition-colors ${isActive("/") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${isActive("/about") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
            >
              About Us
            </Link>
            {/* <Link
              href="/services"
              className={`font-medium transition-colors ${isActive("/services") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
            >
              Servicess
            </Link> */}
            <Link
              href="/process"
              className={`font-medium transition-colors ${isActive("/process") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
            >
              Our Process
            </Link>
            <Link
              href="/faq"
              className={`font-medium transition-colors ${isActive("/faq") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`font-medium transition-colors ${isActive("/contact") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            <Link href="/signin">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-primary dark:text-secondary">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 py-4 rounded-lg shadow-lg dark:shadow-gray-700 ${isMainPage && !isScrolled ? "bg-transparent" : "bg-background dark:bg-card"}`}>
            <nav className="flex flex-col space-y-4 px-4">
              <Link
                href="/"
                className={`font-medium transition-colors ${isActive("/") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`font-medium transition-colors ${isActive("/about") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              {/* <Link
                href="/services"
                className={`font-medium transition-colors ${isActive("/services") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link> */}
              <Link
                href="/process"
                className={`font-medium transition-colors ${isActive("/process") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Process
              </Link>
              <Link
                href="/faq"
                className={`font-medium transition-colors ${isActive("/faq") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className={`font-medium transition-colors ${isActive("/contact") ? "text-secondary dark:text-primary" : "text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t dark:border-border">
                <Button
                  variant="outline"
                  aria-label="Toggle theme"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {theme === "light" ? <Moon size={20} className="mr-2" /> : <Sun size={20} className="mr-2" />}
                  Toggle Theme
                </Button>
                <Link href="/signin">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
                >Login</Button>
                </Link>
                <Link href="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground w-full">Register</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
