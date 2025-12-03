"use client";

// =============================================================================
// HERO SECTION
// =============================================================================
// Full viewport hero with gradient background and animated entrance.
// Modern corporate design with high-contrast typography.
// =============================================================================

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { hero, contact } = siteConfig;

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900" />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full mb-8 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">
              {hero.badge}
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {hero.title}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Primary CTA */}
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-full transition-all duration-200 shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105"
            >
              <span>{hero.ctaText}</span>
              <Icon
                name="ArrowRight"
                className="w-5 h-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
              />
            </a>

            {/* Secondary CTA */}
            <a
              href={`tel:${contact.phone.replace(/-/g, "")}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-105"
            >
              <Icon name="Phone" className="w-5 h-5" />
              <span>{contact.phone}</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div
            className={`mt-16 pt-8 border-t border-white/10 transition-all duration-700 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Icon name="Shield" className="w-5 h-5 text-blue-400" />
                <span className="text-sm">אבטחת מידע מלאה</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" className="w-5 h-5 text-blue-400" />
                <span className="text-sm">מענה תוך 24 שעות</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Users" className="w-5 h-5 text-blue-400" />
                <span className="text-sm">500+ לקוחות מרוצים</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#features"
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          aria-label="גלול למטה"
        >
          <span className="text-xs">גלול למטה</span>
          <Icon name="ChevronDown" className="w-6 h-6" />
        </a>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

export default Hero;
