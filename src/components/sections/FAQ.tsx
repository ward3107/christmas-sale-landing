"use client";

// =============================================================================
// FAQ SECTION
// =============================================================================
// Accordion-style FAQ section optimized for SEO and AEO.
// Uses semantic HTML for better accessibility and search indexing.
// =============================================================================

import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";

export function FAQ() {
  const { faq } = siteConfig;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-20 md:py-28 bg-white"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            שאלות ותשובות
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {faq.sectionTitle}
          </h2>
          <p className="text-lg text-slate-600">
            {faq.sectionSubtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faq.items.map((item, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <div className="bg-slate-50 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-6 text-right hover:bg-slate-100 transition-colors"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3
                    className="text-lg font-semibold text-slate-900 pr-4"
                    itemProp="name"
                  >
                    {item.question}
                  </h3>
                  <span
                    className={`flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <Icon
                      name="ChevronDown"
                      className="w-5 h-5 text-blue-600"
                    />
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="px-6 pb-6">
                    <p
                      className="text-slate-600 leading-relaxed"
                      itemProp="text"
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-slate-600 mb-4">לא מצאתם תשובה לשאלה שלכם?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
          >
            <span>צרו איתנו קשר</span>
            <Icon name="ArrowLeft" className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
