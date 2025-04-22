import React, { useState, useEffect } from 'react';
import { Menu, X, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';
import Button from './Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Statistics', href: '#statistics' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Partners', href: '#partners' },
    { name: 'Team', href: '#team' }
  ];

  return (
    <header 
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled 
              ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-md py-3' 
              : 'bg-transparent py-5'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
          <TrendingUp size={28} />
          <span>D1F</span>
        </Link>

        {isHomePage && (
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login"><Button variant="outline" size="sm">Login</Button></Link>
          <Link href="/register"><Button size="sm">Sign Up</Button></Link>
        </div>

        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-lg md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {isHomePage && navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}