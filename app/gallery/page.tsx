import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import FadeUp from "@/components/FadeUp";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { getGalleryItems, type GalleryAspect } from "@/data/gallery";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gallery — NexTravel Holidays",
  description:
    "Browse travel moments from NexTravel Holidays — mountains, beaches, cities and adventures captured on our journeys.",
};

const aspectClass: Record<GalleryAspect, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

export default function GalleryPage() {
  const items = getGalleryItems();

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Gallery"
          title="Moments from the journeys we plan"
          description="A visual look at the places, people and adventures that make every NexTravel holiday memorable."
          image="/images/alps.jpg"
          imageAlt="Travel gallery inspiration"
          cta={{ href: "/destinations", label: "Explore Destinations" }}
          secondaryCta={{ href: "/contact", label: "Plan My Trip" }}
        />

        <section className="py-10 md:py-16">
          <Container>
            <FadeUp className="mb-8 max-w-2xl md:mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#EDEDED]">
                Travel gallery
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted md:text-base">
                Real destinations, real atmosphere — browse highlights from trips we craft for
                travelers like you.
              </p>
            </FadeUp>
          </Container>

          {/* Edge-to-edge masonry */}
          <div className="ml-[20px] mr-[20px] columns-2 gap-1 sm:columns-2 sm:gap-1.5 lg:columns-3 lg:gap-2">
            {items.map((item) => (
              <figure
                key={item.id}
                className={cn(
                  "group relative mb-1 break-inside-avoid overflow-hidden bg-[#111111] sm:mb-1.5 lg:mb-2",
                  aspectClass[item.aspect],
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
              </figure>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
