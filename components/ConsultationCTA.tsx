import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { whatsappConsultantUrl } from "@/lib/whatsapp";

export default function ConsultationCTA() {
  return (
    <section className="py-8 sm:py-10 md:py-16">
      <Container>
        <div className="relative min-w-0 overflow-hidden rounded-[24px] bg-black text-center sm:rounded-[32px] md:rounded-[40px]">
          <Image
            src="/images/newsletter-bg.png"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1600px) 92vw, 1600px"
            className="object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 px-4 py-14 sm:px-10 sm:py-20 md:px-16 md:py-[88px]">
            <h2 className="mx-auto max-w-3xl text-[24px] leading-snug font-extrabold tracking-tight text-white sm:text-[32px] sm:leading-tight md:text-4xl lg:text-[44px]">
              Let&apos;s Plan Your Dream Trip
              <br className="hidden sm:block" /> with NexTravel Holidays
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#EDEDED]/85 sm:mt-5 sm:text-[15px] md:text-base">
              Tell us your travel goals and we&apos;ll create the perfect
              <br className="hidden sm:block" />
              itinerary tailored just for you.
            </p>

            <a
              href={whatsappConsultantUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#E20E17] px-7 py-3.5 text-sm font-semibold whitespace-nowrap text-white shadow-[0_12px_30px_rgba(226,14,23,0.35)] transition hover:brightness-110 sm:mt-9 sm:px-8 sm:text-[15px]"
            >
              Get Free Consultation
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
