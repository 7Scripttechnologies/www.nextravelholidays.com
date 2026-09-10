import AppImage from "@/components/AppImage";
import { MapPin, Users } from "lucide-react";
import Container from "@/components/Container";
import CountUp from "@/components/CountUp";
import FadeUp from "@/components/FadeUp";
import SectionLabel from "@/components/SectionLabel";
import { getSiteImages } from "@/lib/site-images";

const stats = [
  { value: "1,000+", label: "outdoor destinations" },
  { value: "98%", label: "customer satisfaction" },
  { value: "15+", label: "Years Of Experience" },
];

export default async function ExperienceSection() {
  const images = await getSiteImages();
  const src = images.home_experience?.src ?? "/images/experience-visual.jpg";
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <FadeUp className="min-w-0">
          <SectionLabel>Our Experience</SectionLabel>
          <h2 className="mt-3 text-[28px] font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-[42px] md:leading-[1.15]">
            Crafting Unforgettable
            <br className="hidden md:block" /> Adventures
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted md:text-base">
            We are dedicated to offering travel services of the highest quality, combining our
            energy and enthusiasm with years of experience to create journeys you will never forget.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 sm:mt-10 sm:gap-4 sm:pt-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-xl font-extrabold text-[#E20E17] sm:text-2xl md:text-[32px] md:leading-none">
                  <CountUp value={stat.value} delay={index * 120} />
                </p>
                <p className="mt-1 text-[11px] leading-4 font-medium text-[#EDEDED] sm:mt-2 sm:text-sm sm:leading-5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={120} className="relative mx-auto aspect-[1024/894] w-full min-w-0 max-w-[520px] lg:max-w-[560px]">
          <AppImage
            src={src}
            alt="Excited traveler with a yellow suitcase on a world map"
            fill
            sizes="(max-width: 768px) 90vw, 560px"
            className="object-contain"
          />

          <div className="animate-float absolute top-[18%] right-0 z-10 rounded-2xl border border-white bg-black px-3 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            <p className="flex items-center gap-1.5 text-sm font-bold text-[#EDEDED]">
              <Users className="size-4 text-[#E20E17]" aria-hidden="true" />
              5000+ Customers
            </p>
          </div>

          <div className="animate-float absolute bottom-[16%] left-2 z-10 inline-flex items-center gap-1.5 rounded-full border border-white bg-black px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.4)] sm:left-6 sm:px-4 sm:py-2">
            <MapPin
              className="size-3.5 shrink-0 fill-[#E20E17] text-[#E20E17] sm:size-4"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className="text-[12px] font-bold text-white sm:text-[13px]">best fun</span>
          </div>

          <div className="animate-float-delayed absolute right-0 bottom-[14%] z-10 inline-flex items-center gap-1.5 rounded-full border border-white bg-black px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.4)] sm:px-4 sm:py-2">
            <MapPin
              className="size-3.5 shrink-0 fill-[#E20E17] text-[#E20E17] sm:size-4"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className="text-[12px] font-bold text-white sm:text-[13px]">Best Adventures</span>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
