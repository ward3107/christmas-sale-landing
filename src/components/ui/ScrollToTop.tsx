"use client";

// =============================================================================
// SCROLL TO TOP BUTTON
// =============================================================================
// Fixed floating button to scroll back to top of page.
// Appears after scrolling down, positioned bottom-left for RTL layout.
// =============================================================================

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="חזרה למעלה"
    >
      <ArrowUp className="w-6 h-6 text-white" strokeWidth={2} />
    </button>
  );
}

export default ScrollToTop;
