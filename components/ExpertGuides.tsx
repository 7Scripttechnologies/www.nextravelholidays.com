import Image from "next/image";
import { Heart, MapPin, ThumbsUp, Triangle } from "lucide-react";
import Container from "@/components/Container";
import FadeUp from "@/components/FadeUp";
import SectionLabel from "@/components/SectionLabel";
import { guideFeatures } from "@/data/guides";

const iconMap = {
  expertise: ThumbsUp,
  passion: Heart,
  dedication: Triangle,
};

export default function ExpertGuides() {
  return (
    <section id="guides" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
          <FadeUp>
            <SectionLabel>Our guides</SectionLabel>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-[42px] md:leading-[1.15]">
              Meet Our Expert Tour Guides
            </h2>
          </FadeUp>
          <FadeUp delay={80} className="max-w-[380px] lg:pb-1">
            <p className="text-sm leading-7 text-muted md:text-[15px]">
              Our journeys are enriched by our team of seasoned tour guides. They bring every
              adventure to life with expertise, passion and care.
            </p>
          </FadeUp>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch lg:gap-8">
          <FadeUp className="h-full min-h-[300px] sm:min-h-[400px] lg:min-h-0">
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-[28px] sm:min-h-[400px] lg:min-h-full">
              <Image
                src="/images/expert-guides.webp"
                alt="Tandem paragliding over a hillside town in the Himalayas"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-md sm:bottom-6 sm:left-6">
                <MapPin
                  className="size-4 shrink-0 fill-[#E20E17] text-[#E20E17]"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-white">Manali, India</span>
              </div>
            </div>
          </FadeUp>

          <div className="flex flex-col gap-4">
            {guideFeatures.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              const number = String(index + 1).padStart(2, "0");

              return (
                <FadeUp key={feature.title} delay={index * 80} className="flex-1">
                  <article className="flex h-full flex-col rounded-[22px] border border-white/8 bg-[#111111] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[#E20E17] text-white">
                        <Icon className="size-5 fill-current" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-bold tracking-[0.12em] text-[#E20E17]">
                        {number}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[#EDEDED]">{feature.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{feature.description}</p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
