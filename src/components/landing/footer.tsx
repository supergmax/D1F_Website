import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-primary dark:bg-primary dark:text-gray-300">
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
                className="h-auto" // Logo filter ignored
              />
            </div>
            <p className="text-primary/80 dark:text-gray-400 mb-4">
              CHALLENGE YOURSELF WITHOUT LIMITS
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-primary/80 hover:text-primary dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-primary/80 hover:text-primary dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-primary/80 hover:text-primary dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-primary/80 hover:text-primary dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link href="/services" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Services
                </Link>
              </li> */}
              <li>
                <Link href="/process" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#trading-challenges" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Trading Challenges
                </Link>
              </li>
              <li>
                <Link href="/services#funded-accounts" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Funded Accounts
                </Link>
              </li>
              <li>
                <Link href="/services#education" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Education & Training
                </Link>
              </li>
              <li>
                <Link href="/services#trading-tools" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Trading Tools
                </Link>
              </li>
              <li>
                <Link href="/services#market-analysis" className="text-primary/90 hover:text-primary dark:text-gray-300 dark:hover:text-secondary transition-colors">
                  Market Analysis
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 flex-shrink-0 text-primary dark:text-secondary" />
                <span className="text-primary/90 dark:text-gray-300">123 Business Avenue, Suite 500, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-primary dark:text-secondary" />
                <span className="text-primary/90 dark:text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-primary dark:text-secondary" />
                <span className="text-primary/90 dark:text-gray-300">info@withusfunded.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 dark:border-secondary/30 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary/70 dark:text-gray-400/80 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} With Us Funded. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-primary/70 hover:text-primary dark:text-gray-400/80 dark:hover:text-gray-200 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary/70 hover:text-primary dark:text-gray-400/80 dark:hover:text-gray-200 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-primary/70 hover:text-primary dark:text-gray-400/80 dark:hover:text-gray-200 text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
