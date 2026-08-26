import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import Button from "@/components/Button";
import Container from "@/components/Container";
import SectionLabel from "@/components/SectionLabel";
import type { Destination } from "@/data/destinations";
import { isRemoteSrc } from "@/lib/utils";

interface DestinationHeroProps {
  destination: Destination;
}

export default function DestinationHero({ destination }: DestinationHeroProps) {
  return (
    <section className="relative isolate -mt-[84px] min-h-[100svh] overflow-hidden pt-[84px] sm:-mt-[92px] sm:pt-[92px]">
      <Image
        src={destination.image}
        alt={`${destination.name} travel package`}
        fill
        priority
        sizes="100vw"
        unoptimized={isRemoteSrc(destination.image)}
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/35" />
      <div className="absolute inset-0 bg-black/25" />

      <Container className="relative z-10 flex min-h-[calc(100svh-84px)] flex-col justify-end pb-12 sm:min-h-[calc(100svh-92px)] sm:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <SectionLabel>{destination.category} package</SectionLabel>
          <h1 className="mt-3 text-[32px] leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px]">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#EDEDED]/85 sm:text-base">
            {destination.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#EDEDED]/90">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Star className="size-4 fill-[#E20E17] text-[#E20E17]" aria-hidden="true" />
              {destination.rating.toFixed(1)}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-[#E20E17]" aria-hidden="true" />
              <span className="truncate">{destination.location}</span>
            </span>
            <span>{destination.duration}</span>
            <span>
              From <span className="font-bold text-white">{destination.price}</span>
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button href="#booking" className="w-full sm:w-auto">
              Book Now
            </Button>
            <Link
              href="#overview"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/60 hover:bg-white/5 sm:w-auto"
            >
              View Details
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
