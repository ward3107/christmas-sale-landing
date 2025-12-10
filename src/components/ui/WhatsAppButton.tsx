"use client";

// =============================================================================
// WHATSAPP FLOATING BUTTON
// =============================================================================
// Fixed floating button for WhatsApp contact.
// Positioned bottom-right with pulse animation.
// =============================================================================

import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site-config";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const { contact } = siteConfig;
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show button after a delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // WhatsApp URL with pre-filled message
  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    "שלום, אשמח לקבל מידע נוסף על השירותים שלכם."
  )}`;

  return (
    <div
      className={`fixed bottom-20 sm:bottom-24 md:bottom-6 right-4 sm:right-6 z-50 transition-all duration-500 opacity-60 hover:opacity-100 ${
        isVisible ? "translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-slate-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          דברו איתנו בוואטסאפ
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-slate-800 rotate-45" />
        </div>
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-110"
        aria-label="שלחו הודעה בוואטסאפ"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pulse Animation Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

        {/* Icon */}
        <MessageCircle className="w-8 h-8 text-white" strokeWidth={2} />
      </a>
    </div>
  );
}

export default WhatsAppButton;
