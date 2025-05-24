import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#4E463F] text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo.svg"
                alt="With Us Associates"
                width={150}
                height={75}
                className="h-auto invert"
              />
            </div>
            <p className="text-gray-300 mb-4">
              CHALLENGE YOURSELF WITHOUT LIMITS
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#CABA9F]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li> */}
              <li>
                <Link href="/process" className="text-gray-300 hover:text-white transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#CABA9F]">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#trading-challenges" className="text-gray-300 hover:text-white transition-colors">
                  Trading Challenges
                </Link>
              </li>
              <li>
                <Link href="/services#funded-accounts" className="text-gray-300 hover:text-white transition-colors">
                  Funded Accounts
                </Link>
              </li>
              <li>
                <Link href="/services#education" className="text-gray-300 hover:text-white transition-colors">
                  Education & Training
                </Link>
              </li>
              <li>
                <Link href="/services#trading-tools" className="text-gray-300 hover:text-white transition-colors">
                  Trading Tools
                </Link>
              </li>
              <li>
                <Link href="/services#market-analysis" className="text-gray-300 hover:text-white transition-colors">
                  Market Analysis
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#CABA9F]">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 flex-shrink-0 text-[#CABA9F]" />
                <span className="text-gray-300">123 Business Avenue, Suite 500, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-[#CABA9F]" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-[#CABA9F]" />
                <span className="text-gray-300">info@withusfunded.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} With Us Funded. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
