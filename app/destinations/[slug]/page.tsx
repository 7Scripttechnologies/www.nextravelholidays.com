import type { Metadata } from "next";
import AppImage from "@/components/AppImage";
import { notFound } from "next/navigation";
import { Check, Minus } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import Container from "@/components/Container";
import DestinationCard from "@/components/DestinationCard";
import DestinationGallery from "@/components/DestinationGallery";
import DestinationHero from "@/components/DestinationHero";
import Footer from "@/components/Footer";
import ItineraryAccordion from "@/components/ItineraryAccordion";
import Navbar from "@/components/Navbar";
import { getAllDestinations, getDestination } from "@/lib/packages";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    return { title: "Package not found" };
  }

  const title = destination.name;
  const description =
    destination.overview?.slice(0, 160) ||
    `${destination.name} holiday package with NexTravel Holidays — ${destination.location}, ${destination.duration}.`;

  return {
    title,
    description,
    keywords: [
      destination.name,
      destination.location,
      `${destination.name} package`,
      "NexTravel Holidays",
      "holiday package India",
      "tour package",
    ],
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: `${destination.name} | NexTravel Holidays`,
      description,
      url: `/destinations/${destination.slug}`,
      type: "website",
      images: [{ url: destination.image, alt: destination.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${destination.name} | NexTravel Holidays`,
      description,
      images: [destination.image],
    },
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    notFound();
  }

  const related = (await getAllDestinations())
    .filter((item) => item.slug !== destination.slug)
    .slice(0, 3);
  const gallery = destination.gallery.length > 0 ? destination.gallery : [destination.image];

  return (
    <>
      <Navbar />
      <main className="pb-16">
        <DestinationHero destination={destination} />

        <Container className="py-10 md:py-14">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
            <div id="overview" className="scroll-mt-28">
              <DestinationGallery name={destination.name} images={gallery} />

              <section className="mt-12 border-b border-line pb-10">
                <h2 className="text-2xl font-extrabold text-[#EDEDED]">Overview</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted md:text-base">
                  {destination.overview}
                </p>
              </section>

              {destination.highlights.length > 0 ? (
                <section className="mt-10 border-b border-line pb-10">
                  <h2 className="text-2xl font-extrabold text-[#EDEDED]">Experience Highlights</h2>
                  <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                    {destination.highlights.map((highlight) => (
                      <li key={highlight.title} className="flex items-center gap-4">
                        <AppImage
                          src={highlight.image}
                          alt=""
                          width={72}
                          height={72}
                          className="size-[72px] shrink-0 rounded-2xl object-cover"
                        />
                        <p className="text-sm font-medium leading-6 text-[#EDEDED] sm:text-base">
                          {highlight.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {destination.itinerary.length > 0 ? (
                <section className="mt-10 border-b border-line pb-10">
                  <h2 className="text-2xl font-extrabold text-[#EDEDED]">At a Glance</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                    {destination.itineraryIntro}
                  </p>
                  <div className="mt-4">
                    <ItineraryAccordion days={destination.itinerary} />
                  </div>
                  <p className="mt-4 text-sm italic text-muted">
                    *All itineraries are fully customizable. We will send you a personalized variation
                    that reflects your interests and travel dates.
                  </p>
                </section>
              ) : null}

              {destination.included.length > 0 || destination.notIncluded.length > 0 ? (
                <section className="mt-10">
                  <h2 className="text-2xl font-extrabold text-[#EDEDED]">
                    What’s Included / Not Included
                  </h2>
                  <div className="mt-6 grid gap-8 sm:grid-cols-2">
                    <ul className="space-y-3">
                      {destination.included.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-[#EDEDED]">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E20E17] text-white">
                            <Check className="size-3.5" strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-3">
                      {destination.notIncluded.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-muted">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-[#EDEDED]">
                            <Minus className="size-3.5" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ) : null}
            </div>

            <div id="booking" className="scroll-mt-28">
              <BookingForm packageName={destination.name} />
            </div>
          </div>

          {related.length > 0 ? (
            <>
              <h2 className="mt-16 text-2xl font-extrabold text-[#EDEDED]">You might also like</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <DestinationCard key={item.slug} destination={item} />
                ))}
              </div>
            </>
          ) : null}
        </Container>
      </main>
      <Footer />
    </>
  );
}
