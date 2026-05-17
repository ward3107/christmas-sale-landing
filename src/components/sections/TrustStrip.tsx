"use client";

import { Icon } from "@/components/ui/Icon";

interface TrustItem {
  iconName: string;
  primary: string;
  secondary?: string;
  accent?: "gold" | "blue" | "green";
}

const items: TrustItem[] = [
  { iconName: "Star", primary: "4.9 / 5", secondary: "דירוג גוגל", accent: "gold" },
  { iconName: "Award", primary: "מוסמך לשכת עוה״ד", accent: "blue" },
  { iconName: "ShieldCheck", primary: "100% סודיות", accent: "green" },
  { iconName: "Clock", primary: "מענה תוך 24 שעות", accent: "blue" },
  { iconName: "TrendingUp", primary: "98% אחוז הצלחה", accent: "gold" },
];

const accentClasses: Record<NonNullable<TrustItem["accent"]>, string> = {
  gold: "text-gold-500",
  blue: "text-blue-600",
  green: "text-emerald-600",
};

export function TrustStrip() {
  return (
    <section
      aria-label="חותמות אמון ודירוגים"
      className="border-y border-slate-200 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm md:text-base">
          {items.map((item) => (
            <li
              key={item.primary}
              className="flex items-center gap-2 text-slate-700"
            >
              <Icon
                name={item.iconName}
                className={`w-5 h-5 ${accentClasses[item.accent ?? "blue"]}`}
                aria-hidden="true"
              />
              <span className="font-semibold">{item.primary}</span>
              {item.secondary && (
                <span className="text-slate-500 hidden sm:inline">
                  · {item.secondary}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TrustStrip;
