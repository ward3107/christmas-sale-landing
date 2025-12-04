// =============================================================================
// JSON-LD STRUCTURED DATA
// =============================================================================
// Schema.org structured data for SEO and rich search results.
// Includes LegalService, WebPage, and FAQPage schemas.
// =============================================================================

import { siteConfig } from "@/config/site-config";

interface JsonLdProps {
  url: string;
}

export function JsonLd({ url }: JsonLdProps) {
  const { metadata, contact, faq, about } = siteConfig;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // LegalService / Organization Schema
      {
        "@type": "LegalService",
        "@id": `${url}/#organization`,
        name: "משרד עו״ד כהן ושות׳",
        alternateName: "Cohen Law Office",
        url: url,
        logo: `${url}/logo.png`,
        image: `${url}/og-image.jpg`,
        description: metadata.description,
        telephone: contact.phone,
        email: contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "מגדלי ב.ס.ר 4, קומה 25",
          addressLocality: "רמת גן",
          addressCountry: "IL",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "32.0853",
          longitude: "34.8118",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        priceRange: "$$",
        areaServed: {
          "@type": "Country",
          name: "Israel",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: about.stats.find(s => s.label.includes("לקוחות"))?.value.replace("+", "") || "500",
        },
        sameAs: [
          // Add social media URLs here when available
        ],
      },
      // WebPage Schema
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url: url,
        name: metadata.title,
        description: metadata.description,
        inLanguage: "he-IL",
        isPartOf: { "@id": `${url}/#organization` },
        about: {
          "@type": "Thing",
          name: "שירותים משפטיים לעסקים",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${url}/og-image.jpg`,
        },
      },
      // FAQPage Schema
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      // BreadcrumbList Schema
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "דף הבית",
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default JsonLd;
