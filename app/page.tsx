// =============================================================================
// HOME PAGE
// =============================================================================
// Section order optimized for legal conversion psychology:
// Hero → TrustStrip → Features (why us) → Services → Testimonials (proof)
// → About (meet the team) → FAQ (objection handling) → Contact (convert)
// =============================================================================

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Features } from "@/components/sections/Features";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { ContactForm } from "@/components/forms/ContactForm";
import { StickyMobileCta } from "@/components/ui/StickyMobileCta";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <Hero />
      <TrustStrip />
      <Features />
      <Services />
      <Testimonials />
      <About />
      <FAQ />
      <ContactForm />

      <Footer />
      <StickyMobileCta />
    </>
  );
}
