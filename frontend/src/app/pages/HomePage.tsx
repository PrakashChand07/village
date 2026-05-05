import { HeroSection } from "../components/HeroSection";
import { ServicesSection } from "../components/ServicesSection";
import { StatsSection } from "../components/StatsSection";
import { RuralServicesSection } from "../components/RuralServicesSection";
import { AppDownloadSection } from "../components/AppDownloadSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { NewsletterSection } from "../components/NewsletterSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <RuralServicesSection />
      <AppDownloadSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
