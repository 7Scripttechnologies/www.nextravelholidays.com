import type { Metadata } from "next";
import Container from "@/components/Container";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ReviewsSection from "@/components/ReviewsSection";
import { getAllDestinations } from "@/lib/packages";
import { getSiteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore curated holiday destinations with NexTravel Holidays Gujarat — Kashmir, Kerala, Manali, Goa, Bali, Udaipur and more packages for travellers from Ahmedabad, Surat, Vadodara, Rajkot and all Gujarat cities.",
  keywords: [
    "holiday destinations India",
    "tour packages from Gujarat",
    "holiday packages Ahmedabad",
    "Kashmir tour",
    "Kerala package",
    "Manali Kasol",
    "Goa holiday",
    "Bali tour package",
    "NexTravel Holidays destinations",
  ],
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "Destinations | NexTravel Holidays Gujarat",
    description:
      "Browse handpicked holiday packages for travellers across Gujarat and beyond with NexTravel Holidays.",
    url: "/destinations",
  },
};

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const [destinations, images] = await Promise.all([getAllDestinations(), getSiteImages()]);

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Destinations"
          title="Explore places worth traveling for"
          description="Browse handpicked destinations across India — from mountain getaways and lake cities to beaches and backwaters — then open any tour for full details."
          image={images.destinations_hero?.src ?? "/images/maldives.jpg"}
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

            {destinations.length === 0 ? (
              <p className="text-sm text-muted">No destinations yet. Add packages from the admin panel.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {destinations.map((destination) => (
                  <DestinationCard key={destination.slug} destination={destination} />
                ))}
              </div>
            )}
          </Container>
        </section>

        <ReviewsSection />
      </main>
      <Footer />
    </>
  );
}
