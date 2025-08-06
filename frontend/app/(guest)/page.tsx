import Features from "@/components/guest/features";
import HeroSection from "@/components/guest/hero-section";
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
    </main>
  );
}
