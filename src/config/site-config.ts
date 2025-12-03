// =============================================================================
// SITE CONFIGURATION
// =============================================================================
// This is the single source of truth for all site content.
// Modify this file to customize the entire landing page.
// =============================================================================

export interface SiteConfig {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  theme: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    accent: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    secondaryCtaText: string;
  };
  features: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{
      title: string;
      description: string;
      iconName: string;
    }>;
  };
  about: {
    title: string;
    content: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{
      title: string;
      description: string;
      iconName: string;
    }>;
  };
  testimonials: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{
      name: string;
      role: string;
      content: string;
      rating: number;
    }>;
  };
  footer: {
    copyright: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
}

export const siteConfig: SiteConfig = {
  // -------------------------------------------------------------------------
  // METADATA - SEO and page title
  // -------------------------------------------------------------------------
  metadata: {
    title: "משרד עו״ד כהן ושות׳ | ליווי משפטי מקצועי לעסקים",
    description:
      "משרד עורכי דין מוביל בתחום המשפט המסחרי. ליווי משפטי מקיף לחברות וסטארטאפים. ייעוץ, ניסוח חוזים והתמודדות עם סכסוכים עסקיים.",
    keywords: [
      "עורך דין מסחרי",
      "משרד עורכי דין",
      "ייעוץ משפטי לעסקים",
      "דיני חברות",
      "חוזים מסחריים",
    ],
  },

  // -------------------------------------------------------------------------
  // THEME - Color palette (Tailwind classes)
  // -------------------------------------------------------------------------
  theme: {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    primaryLight: "bg-blue-50",
    accent: "bg-slate-800",
  },

  // -------------------------------------------------------------------------
  // CONTACT INFORMATION
  // -------------------------------------------------------------------------
  contact: {
    phone: "050-1234567",
    whatsapp: "972501234567", // International format without +
    email: "office@cohen-law.co.il",
    address: "מגדלי ב.ס.ר 4, קומה 25, רמת גן",
  },

  // -------------------------------------------------------------------------
  // HERO SECTION
  // -------------------------------------------------------------------------
  hero: {
    badge: "מובילים בתוצאות מאז 2010",
    title: "השקט המשפטי שהעסק שלך צריך",
    subtitle:
      "אנחנו נלחמים בזירה המשפטית כדי שאתה תוכל להתמקד בלהצמיח את העסק שלך. ליווי אישי, מקצועי ויסודי בכל שלב.",
    ctaText: "תיאום פגישת ייעוץ",
    secondaryCtaText: "למידע נוסף",
  },

  // -------------------------------------------------------------------------
  // FEATURES SECTION
  // -------------------------------------------------------------------------
  features: {
    sectionTitle: "למה לבחור בנו?",
    sectionSubtitle: "מעטפת משפטית מלאה תחת קורת גג אחת",
    items: [
      {
        title: "זמינות 24/7",
        description:
          "אנחנו מבינים שעסקים לא עוצרים, וגם אנחנו לא. צוות המשרד זמין עבורכם בכל שעה.",
        iconName: "Clock",
      },
      {
        title: "הגנה מקיפה",
        description:
          "אסטרטגיה משפטית שצופה פני עתיד ומונעת בעיות לפני שהן מתרחשות.",
        iconName: "Shield",
      },
      {
        title: "ניסיון מוכח",
        description:
          "רקורד של מאות תיקים מוצלחים ולקוחות מרוצים לאורך יותר מעשור.",
        iconName: "Scale",
      },
      {
        title: "גישה אישית",
        description:
          "כל לקוח מקבל יחס אישי ומותאם לצרכים הספציפיים של העסק שלו.",
        iconName: "Users",
      },
      {
        title: "שקיפות מלאה",
        description: "תקשורת פתוחה ושקופה לאורך כל הדרך, ללא הפתעות.",
        iconName: "Eye",
      },
      {
        title: "תוצאות מדידות",
        description: "אנחנו מתמקדים בתוצאות ומודדים הצלחה לפי הישגים בפועל.",
        iconName: "TrendingUp",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ABOUT SECTION
  // -------------------------------------------------------------------------
  about: {
    title: "נעים להכיר",
    content: `המשרד שלנו הוקם מתוך הבנה שעסקים צריכים יותר מעורך דין - הם צריכים שותף לדרך.

עם ניסיון של למעלה מעשור בדיני חברות ומשפט מסחרי, אנחנו מביאים שילוב מנצח של ידע מקצועי עמוק וראייה עסקית חדה.

הצוות שלנו מורכב ממומחים בתחומים מגוונים - חוזים, מיזוגים ורכישות, קניין רוחני ויישוב סכסוכים. אנחנו מאמינים שהדרך הטובה ביותר להגן על הלקוחות שלנו היא למנוע בעיות לפני שהן מתרחשות.`,
    stats: [
      { value: "500+", label: "לקוחות מרוצים" },
      { value: "15+", label: "שנות ניסיון" },
      { value: "98%", label: "אחוז הצלחה" },
      { value: "24/7", label: "זמינות" },
    ],
  },

  // -------------------------------------------------------------------------
  // SERVICES SECTION
  // -------------------------------------------------------------------------
  services: {
    sectionTitle: "תחומי התמחות",
    sectionSubtitle: "פתרונות משפטיים מקיפים לכל אתגר עסקי",
    items: [
      {
        title: "דיני חברות",
        description:
          "הקמת חברות, הסכמי מייסדים, מבנה תאגידי ומשילות תאגידית.",
        iconName: "Building2",
      },
      {
        title: "חוזים מסחריים",
        description:
          "ניסוח, בדיקה ומשא ומתן על חוזים מסחריים מכל סוג.",
        iconName: "FileText",
      },
      {
        title: "מיזוגים ורכישות",
        description:
          "ליווי מלא בעסקאות M&A, בדיקות נאותות ומשא ומתן.",
        iconName: "Users",
      },
      {
        title: "קניין רוחני",
        description:
          "הגנה על סימני מסחר, פטנטים וזכויות יוצרים.",
        iconName: "Lightbulb",
      },
      {
        title: "יישוב סכסוכים",
        description:
          "ייצוג בהליכי גישור, בוררות וליטיגציה מסחרית.",
        iconName: "Gavel",
      },
      {
        title: "רגולציה ותאימות",
        description:
          "ייעוץ בנושאי רגולציה, פרטיות מידע ותאימות לדרישות החוק.",
        iconName: "ShieldCheck",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // TESTIMONIALS SECTION
  // -------------------------------------------------------------------------
  testimonials: {
    sectionTitle: "מה הלקוחות אומרים",
    sectionSubtitle: "הצלחות שמדברות בעד עצמן",
    items: [
      {
        name: "יוסי לוי",
        role: "מנכ״ל, טכנולוגיות לוי בע״מ",
        content:
          "משרד כהן ליווה אותנו בעסקת המיזוג הגדולה ביותר בתולדות החברה. המקצועיות והמסירות שלהם היו יוצאות דופן.",
        rating: 5,
      },
      {
        name: "רונית כהן",
        role: "מייסדת, סטארטאפ אינוביישן",
        content:
          "קיבלנו ליווי משפטי מקיף מהיום הראשון. הצוות תמיד זמין ומגיב במהירות לכל שאלה.",
        rating: 5,
      },
      {
        name: "אבי ישראלי",
        role: "סמנכ״ל כספים, קבוצת ישראלי",
        content:
          "המקצועיות והידע של הצוות חסכו לנו מאות אלפי שקלים ומנעו בעיות משפטיות רבות.",
        rating: 5,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // FOOTER
  // -------------------------------------------------------------------------
  footer: {
    copyright: "© 2024 משרד עו״ד כהן ושות׳. כל הזכויות שמורות.",
    links: [
      { label: "מדיניות פרטיות", href: "/privacy" },
      { label: "תנאי שימוש", href: "/terms" },
      { label: "נגישות", href: "/accessibility" },
    ],
  },
};

export default siteConfig;
