import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedDesigners } from "@/components/home/FeaturedDesigners";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Statistics } from "@/components/home/Statistics";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <main className="bg-background min-h-screen font-sans text-text">
      <HeroSection />
      <CategorySection />
      <FeaturedDesigners />
      <WhyChooseUs />
      <Statistics />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </main>
  );
}
