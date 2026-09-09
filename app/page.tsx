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
import { getSiteImages } from "@/lib/site-images";

export default async function HomePage() {
  const images = await getSiteImages();

  return (
    <>
      <Navbar />
      <main>
        <Hero imageSrc={images.home_hero?.src ?? "/images/hero-visual.jpg"} />
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
