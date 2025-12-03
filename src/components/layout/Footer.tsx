"use client";

// =============================================================================
// FOOTER COMPONENT
// =============================================================================
// Site footer with links, contact info, and copyright.
// Clean professional design with social links.
// =============================================================================

import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const { contact, footer, metadata } = siteConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-4"
            >
              <Icon name="Scale" className="w-8 h-8 text-blue-400" />
              <span>{metadata.title.split("|")[0].trim()}</span>
            </Link>
            <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
              {metadata.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Icon name="Facebook" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Icon name="Linkedin" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Icon name="Twitter" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              קישורים מהירים
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#hero"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  דף הבית
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  שירותים
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  אודות
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  צור קשר
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">צור קשר</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${contact.phone.replace(/-/g, "")}`}
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
                >
                  <Icon name="Phone" className="w-5 h-5 text-blue-400" />
                  <span>{contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
                >
                  <Icon name="Mail" className="w-5 h-5 text-blue-400" />
                  <span>{contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Icon
                  name="MapPin"
                  className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1"
                />
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-slate-500 text-sm">
              {footer.copyright.replace("2024", currentYear.toString())}
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-500 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
