import type { Metadata } from "next";
import Container from "@/components/Container";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ReviewsSection from "@/components/ReviewsSection";
import { getAllDestinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Destinations — NexTravel Holidays",
  description:
    "Explore top travel destinations with NexTravel Holidays — Kashmir, Kerala, Manali, Udaipur and more curated escapes.",
};

export default function DestinationsPage() {
  const destinations = getAllDestinations();

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Destinations"
          title="Explore places worth traveling for"
          description="Browse handpicked destinations across India — from mountain getaways and lake cities to beaches and backwaters — then open any tour for full details."
          image="/images/maldives.jpg"
          imageAlt="Beautiful travel destination"
          cta={{ href: "/destinations", label: "View Destinations" }}
          secondaryCta={{ href: "/contact", label: "Plan My Trip" }}
        />

        <section className="py-14 md:py-20">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#EDEDED]">
                All destinations
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                Choose a destination to see the full itinerary, highlights, inclusions and booking
                options.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {destinations.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </div>
          </Container>
        </section>

        <ReviewsSection />
      </main>
      <Footer />
    </>
  );
}
