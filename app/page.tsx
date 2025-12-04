// =============================================================================
// HOME PAGE
// =============================================================================
// Main landing page assembling all sections in logical order.
// All content is data-driven from siteConfig.
// =============================================================================

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section - Full viewport introduction */}
        <Hero />

        {/* Features Section - Key benefits/advantages */}
        <Features />

        {/* Services Section - Practice areas/offerings */}
        <Services />

        {/* About Section - Company introduction with stats */}
        <About />

        {/* Testimonials Section - Customer reviews */}
        <Testimonials />

        {/* FAQ Section - Common questions */}
        <FAQ />

        {/* Contact Section - Lead capture form */}
        <ContactForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
