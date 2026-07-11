import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesTabSection } from "@/components/home/FeaturesTabSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { Integrations } from "@/components/home/Integrations";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <main className="bg-background min-h-screen font-sans text-text">
      <HeroSection />
      <FeaturesTabSection />
      <ProcessSection />
      <Integrations />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </main>
  );
}
