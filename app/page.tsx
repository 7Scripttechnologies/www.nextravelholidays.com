import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBrands from "@/components/TrustedBrands";
import ValueSection from "@/components/ValueSection";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import DreamDestination from "@/components/DreamDestination";
import ExperienceSection from "@/components/ExperienceSection";
import ExpertGuides from "@/components/ExpertGuides";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBrands />
        <ValueSection />
        <FeaturedDestinations />
        <DreamDestination />
        {/* Temporarily hidden: Top destination / PopularDestinations */}
        {/* <PopularDestinations /> */}
        <ExperienceSection />
        <ExpertGuides />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  );
}
