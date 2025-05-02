import React from 'react';
import { TrendingUp, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const legalLinks = [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Risk Disclosure', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'FAQ', href: '#' }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Youtube size={20} />, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <a href="#" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <TrendingUp size={28} className="text-blue-400" />
              <span>D1F</span>
            </a>
            <p className="text-gray-400 mb-6">
              Day One Funding provides traders with the capital they need to achieve their financial goals.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#statistics" className="text-gray-400 hover:text-blue-400 transition-colors">Statistics</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors">How It Works</a></li>
              <li><a href="#partners" className="text-gray-400 hover:text-blue-400 transition-colors">Partners</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-blue-400 transition-colors">Team</a></li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">123 Trading Street</p>
              <p className="mb-2">New York, NY 10001</p>
              <p className="mb-2">United States</p>
              <p className="mb-2">
                <a href="mailto:info@d1f.com" className="hover:text-blue-400 transition-colors">info@d1f.com</a>
              </p>
              <p>
                <a href="tel:+1234567890" className="hover:text-blue-400 transition-colors">+1 (234) 567-890</a>
              </p>
            </address>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Day One Funding. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Trading involves risk. Only risk capital you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}