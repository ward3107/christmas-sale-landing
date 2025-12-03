"use client";

// =============================================================================
// SERVICES SECTION
// =============================================================================
// Grid layout displaying services/practice areas.
// Professional cards with hover effects.
// =============================================================================

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";

export function Services() {
  const { services } = siteConfig;
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
    <section
      ref={sectionRef}
      id="services"
      className="py-20 md:py-28 bg-gradient-to-b from-slate-900 to-slate-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-full mb-4">
            מה אנחנו מציעים
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {services.sectionTitle}
          </h2>
          <p className="text-lg text-slate-400">{services.sectionSubtitle}</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.items.map((service, index) => (
            <div
              key={service.title}
              className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600/20 text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Icon name={service.iconName} className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>

              {/* Learn More Link */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  <span>למידע נוסף</span>
                  <Icon
                    name="ArrowRight"
                    className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
                  />
                </a>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-slate-400 mb-6">
            לא מצאתם את מה שחיפשתם? צרו קשר ונמצא את הפתרון המתאים עבורכם.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            <span>דברו איתנו</span>
            <Icon name="MessageCircle" className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;
