import Contact from "@/components/guest/contact";
import FAQs from "@/components/guest/faqs";
import Features from "@/components/guest/features";
import HeroSection from "@/components/guest/hero-section";
import HowItWorks from "@/components/guest/how-it-works";
import WhyChronify from "@/components/guest/why-chronify";

export default function Home() {
  return (
    <main className="w-full">
      {/*HeroSection*/}
      <HeroSection />
      {/* Why Chronify */}
      <WhyChronify />
      {/* Features */}
      <Features />
      {/* How It Works */}
      <HowItWorks />
      {/* FAQs */}
      <FAQs />
      {/* Contact */}
      <Contact />
    </main>
  );
}
