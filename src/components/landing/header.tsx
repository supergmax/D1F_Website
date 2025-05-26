"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/landing/button"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

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

    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setIsLoggedIn(true)
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
        if (!error && data?.role === "admin") {
          setIsAdmin(true)
        }
      } else {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUserData() // re-fetch when login/logout happens
    })

    fetchUserData()
    window.addEventListener("scroll", handleScroll)
    return () => {
      listener.subscription.unsubscribe()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasScrolled])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const goToDashboard = () => {
    router.push(isAdmin ? "/admin" : "/profile")
  }

  const isActive = (path: string) => pathname === path

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
            {["/", "/about", "/process", "/faq", "/contact"].map((route) => (
              <Link
                key={route}
                href={route}
                className={`font-medium transition-colors ${
                  isActive(route) ? "text-[#CABA9F]" : "text-[#4E463F] hover:text-[#CABA9F]"
                }`}
              >
                {route === "/" ? "Home" : route.slice(1).replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  onClick={goToDashboard}
                  className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-[#4E463F] text-white hover:bg-[#CABA9F]"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" className="border-[#4E463F] text-[#4E463F] hover:bg-[#4E463F] hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-[#4E463F] text-white hover:bg-[#CABA9F]">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-[#4E463F]">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
