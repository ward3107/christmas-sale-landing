"use client";

// =============================================================================
// TESTIMONIALS SECTION
// =============================================================================
// Customer testimonials with star ratings.
// Card-based layout with professional styling.
// =============================================================================

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";

export function Testimonials() {
  const { testimonials } = siteConfig;
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

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
        }`}
      />
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-20 md:py-28 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            המלצות
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {testimonials.sectionTitle}
          </h2>
          <p className="text-lg text-slate-600">
            {testimonials.sectionSubtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.items.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`relative bg-slate-50 rounded-2xl p-8 transition-all duration-500 hover:shadow-lg ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
              }}
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-6 text-6xl text-blue-100 font-serif leading-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4 relative z-10">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <p className="text-slate-600 leading-relaxed mb-6 relative z-10">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 relative z-10">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm text-slate-500 max-w-3xl mx-auto">
            * המלצות אלו הן דוגמאות להמלצות מלקוחות. השמות והפרטים שונו לשם הגנת פרטיות הלקוחות.
            <br />
            התוצאות עשויות להשתנות בהתאם לנסיבות הספציפיות של כל מקרה.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
