import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import About from "@/components/About";
import Services from "@/components/Services";
import WellnessOpportunity from "@/components/WellnessOpportunity";
import WhyChooseUs from "@/components/WhyChooseUs";
import WellnessJourney from "@/components/WellnessJourney";
import BMICalculator from "@/components/BMICalculator";
import Gallery from "@/components/Gallery";
import CTASection from "@/components/CTASection";
import Contact from "@/components/Contact";
import SuccessStory from "@/components/SuccessStory";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <About />
      <Services />
      <WellnessOpportunity />
      <SuccessStory />
      <WhyChooseUs />
      <WellnessJourney />
      <BMICalculator />
      <Gallery />
      <CTASection />
      <Contact />
    </>
  );
}
