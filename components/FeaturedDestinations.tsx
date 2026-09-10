import Container from "@/components/Container";
import DestinationCard from "@/components/DestinationCard";
import FadeUp from "@/components/FadeUp";
import SectionLabel from "@/components/SectionLabel";
import { getFeaturedDestinations } from "@/lib/packages";

export default async function FeaturedDestinations() {
  const topDestinations = await getFeaturedDestinations(6);

  return (
    <section id="destinations" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <FadeUp>
          <SectionLabel>Choose your next destination</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#EDEDED] md:text-4xl">
            Explore top destination
          </h2>
        </FadeUp>

        {topDestinations.length === 0 ? (
          <p className="mt-8 text-sm text-muted">Packages will appear here once they are added in the admin panel.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {topDestinations.map((destination, offset) => (
              <FadeUp key={destination.slug} delay={offset * 80} className="h-full">
                <DestinationCard destination={destination} />
              </FadeUp>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
