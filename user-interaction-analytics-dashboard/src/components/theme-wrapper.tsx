'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from './theme-toggle';
import { Transition } from '@headlessui/react';
import { trackClick } from '@/lib/tracker';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (href: string, label: string) => {
    trackClick(`nav-${label.toLowerCase()}`, pathname);
    setIsMobileMenuOpen(false);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
            <div className="flex items-center gap-6">
              <Link 
                className="flex items-center space-x-2 text-lg font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors" 
                href="/"
                onClick={() => handleNavClick('/', 'Home')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Analytics Demo</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => handleNavClick(href, label)}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    pathname === href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/subscribe"
                onClick={() => handleNavClick('/subscribe', 'Subscribe')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Subscribe
              </Link>
              <ThemeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <Transition
            show={isMobileMenuOpen}
            enter="transition duration-200 ease-out"
            enterFrom="transform -translate-y-2 opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform -translate-y-2 opacity-0"
          >
            <nav className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => handleNavClick(href, label)}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    pathname === href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/subscribe"
                onClick={() => handleNavClick('/subscribe', 'Subscribe')}
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center"
              >
                Subscribe
              </Link>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </Transition>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container max-w-screen-2xl py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Analytics Demo</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track and analyze user interactions to create exceptional digital experiences.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Quick Links</h3>
                <nav className="flex flex-col space-y-2">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => handleNavClick(href, label)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Stay Updated</h3>
                <form 
                  className="flex flex-col space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    trackClick('footer-subscribe', pathname);
                    alert('Subscription feature will be implemented soon!');
                  }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Contact</h3>
                <address className="text-sm text-gray-600 dark:text-gray-400 not-italic space-y-1">
                  <p>Email: info@example.com</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Address: 123 Analytics St</p>
                </address>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Analytics Demo. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
} 