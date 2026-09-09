import Image from "next/image";
import Container from "@/components/Container";
import FadeUp from "@/components/FadeUp";
import SectionLabel from "@/components/SectionLabel";
import { getSiteImages } from "@/lib/site-images";

const stats = [
  { value: "4k+", label: "Satisfied Customers" },
  { value: "1000+", label: "Global Destinations" },
  { value: "24/7", label: "Customer Support" },
  { value: "100%", label: "Dedication" },
];

export default async function DreamDestination() {
  const images = await getSiteImages();
  const src = images.home_dream?.src ?? "/images/dream-visual.jpg";

  return (
    <section className="py-16 md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <FadeUp className="relative mx-auto aspect-[1024/831] w-full min-w-0 max-w-[480px] lg:max-w-[540px]">
          <Image
            src={src}
            alt="Traveler with a suitcase and passport ready for a dream destination"
            fill
            sizes="(max-width: 768px) 90vw, 540px"
            className="object-contain"
            unoptimized={/^https?:\/\//i.test(src)}
          />
        </FadeUp>

        <FadeUp delay={120} className="min-w-0">
          <SectionLabel>We are the best for you</SectionLabel>
          <h2 className="mt-3 text-[28px] font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-[42px] md:leading-[1.15]">
            Unlock Your Dream Destination
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted md:text-base">
            We are dedicated to making your journey of discovery truly unforgettable. Our team of
            passionate travel experts is here to assist you in finding the destination of your
            dreams.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-5 sm:px-5 sm:py-6"
              >
                <p className="text-2xl font-extrabold text-[#E20E17] md:text-[32px] md:leading-none">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-[#EDEDED]">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
