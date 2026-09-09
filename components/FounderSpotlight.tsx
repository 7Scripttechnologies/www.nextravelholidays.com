"use client";

import Image from "next/image";
import Button from "@/components/Button";
import FadeUp from "@/components/FadeUp";
import { whatsappInquiryUrl } from "@/lib/whatsapp";

export default function FounderSpotlight({
  imageSrc = "/images/pulkit-11.jpg",
}: {
  imageSrc?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#141414] sm:rounded-[28px]">
      <div className="grid lg:grid-cols-2">
        <FadeUp className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12">
          <p className="text-[11px] font-bold tracking-[0.22em] text-[#E20E17] uppercase">
            Founder
          </p>
          <h2 className="mt-3 max-w-md text-[28px] leading-[1.15] font-extrabold tracking-tight text-[#EDEDED] sm:text-[34px] lg:text-[36px]">
            Pulkit Karangiya
          </h2>
          <p className="mt-1 text-sm font-semibold tracking-wide text-muted">
            Founder &amp; CEO · NexTravel Holidays
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted md:text-[15px] md:leading-8">
            Building honest holiday plans for travellers from Gujarat — clear itineraries, trusted
            stays, and support from the first WhatsApp chat to a safe return home.
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted md:text-[15px] md:leading-8">
            From Kashmir and Kerala to custom trips abroad, every journey is shaped around your
            dates, budget and the way you like to travel.
          </p>
          <div className="mt-7">
            <Button href={whatsappInquiryUrl} className="rounded-md px-6 tracking-[0.06em] uppercase">
              WhatsApp Inquiry
            </Button>
          </div>
        </FadeUp>

        <FadeUp delay={80} className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-full">
          <Image
            src={imageSrc}
            alt="Pulkit Karangiya, Founder & CEO of NexTravel Holidays"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority
            unoptimized={/^https?:\/\//i.test(imageSrc)}
          />
        </FadeUp>
      </div>
    </div>
  );
}
