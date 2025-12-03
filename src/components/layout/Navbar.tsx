"use client";

// =============================================================================
// NAVBAR COMPONENT
// =============================================================================
// Sticky navigation bar with glassmorphism effect.
// Fully responsive with mobile hamburger menu.
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Navigation links
  const navLinks = [
    { label: "ראשי", href: "#hero" },
    { label: "שירותים", href: "#services" },
    { label: "אודות", href: "#about" },
    { label: "צור קשר", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors"
          >
            <Icon name="Scale" className="w-7 h-7 text-blue-600" />
            <span className="hidden sm:inline">
              {siteConfig.metadata.title.split("|")[0].trim()}
            </span>
            <span className="sm:hidden">כהן ושות׳</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-slate-600 hover:text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/-/g, "")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105"
            >
              <Icon name="Phone" className="w-4 h-4" />
              <span>התקשרו עכשיו</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={isMobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={isMobileMenuOpen}
          >
            <Icon
              name={isMobileMenuOpen ? "X" : "Menu"}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 pb-6" : "max-h-0"
          }`}
        >
          <div className="pt-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-4 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/-/g, "")}`}
              className="flex items-center justify-center gap-2 mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
            >
              <Icon name="Phone" className="w-4 h-4" />
              <span>התקשרו עכשיו</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
