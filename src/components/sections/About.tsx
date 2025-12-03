"use client";

// =============================================================================
// ABOUT SECTION
// =============================================================================
// Company introduction with statistics counters.
// Clean two-column layout with animated stats.
// =============================================================================

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";

export function About() {
  const { about, contact } = siteConfig;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              קצת עלינו
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              {about.title}
            </h2>

            {/* Content paragraphs */}
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed mb-8">
              {about.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-6 text-slate-600">
              <a
                href={`tel:${contact.phone.replace(/-/g, "")}`}
                className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Icon name="Phone" className="w-5 h-5 text-blue-600" />
                <span>{contact.phone}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Icon name="Mail" className="w-5 h-5 text-blue-600" />
                <span>{contact.email}</span>
              </a>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="grid grid-cols-2 gap-6">
              {about.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-all duration-300 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                  }}
                >
                  {/* Stat Value */}
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>

                  {/* Stat Label */}
                  <div className="text-slate-600 font-medium">{stat.label}</div>

                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-300" />
                </div>
              ))}
            </div>

            {/* Address Card */}
            <div className="mt-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon name="MapPin" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">המשרד שלנו</h3>
                  <p className="text-blue-100">{contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
