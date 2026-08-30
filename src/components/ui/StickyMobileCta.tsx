"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site-config";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics";

/**
 * Fixed bottom bar on mobile with two big tap targets: call + WhatsApp.
 * Hidden on md+ (desktop has the navbar CTA). Hidden until the user scrolls
 * past the hero so it doesn't compete with the primary above-fold CTA.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const { contact } = siteConfig;

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    "שלום, אשמח לקבל ייעוץ משפטי"
  )}`;

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="region"
      aria-label="פעולות מהירות"
    >
      <div className="grid grid-cols-2 gap-2 p-2">
        <a
          href={`tel:${contact.phone.replace(/-/g, "")}`}
          onClick={() => trackEvent("phone_click", { source: "sticky_cta" })}
          className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl transition-transform"
        >
          <Icon name="Phone" className="w-5 h-5" aria-hidden="true" />
          <span>התקשרו</span>
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { source: "sticky_cta" })}
          className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl transition-transform"
        >
          <Icon name="MessageCircle" className="w-5 h-5" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default StickyMobileCta;
