"use client";

import { useState } from "react";
import Image from "next/image";
import AppImage from "@/components/AppImage";
import { MapPin, Plane, Play, Users, X } from "lucide-react";
import Button from "@/components/Button";
import Container from "@/components/Container";
import SectionLabel from "@/components/SectionLabel";
import { useSiteContact } from "@/components/SiteContactProvider";
import { whatsappPackageUrlFor } from "@/lib/whatsapp";

export default function Hero({ imageSrc = "/images/hero-visual.jpg" }: { imageSrc?: string }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const contact = useSiteContact();
  const packageUrl = whatsappPackageUrlFor(contact.whatsappDigits);

  return (
    <section className="relative overflow-x-hidden pt-6 pb-10 md:pt-10 md:pb-16">
      <Container className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_1fr] lg:gap-8 xl:gap-10">
        <div className="min-w-0">
          <SectionLabel className="flex items-center gap-2">
            <Plane className="size-3.5" aria-hidden="true" />
            Explore the world
          </SectionLabel>
          <h1 className="mt-4 text-[30px] leading-[1.12] font-extrabold tracking-tight text-[#EDEDED] sm:text-5xl lg:text-[52px] xl:text-[64px]">
            Travel{" "}
            <span className="text-gradient">
              top
              <br className="hidden sm:block" /> destinations
            </span>{" "}
            of the world
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted sm:text-base">
            We help you find the most unforgettable destinations, curated stays and guided
            experiences so every trip feels effortless and extraordinary.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button
              href={packageUrl}
              className="w-full sm:w-auto"
              ariaLabel="Get package on WhatsApp"
            >
              Get Package
            </Button>
            {/* <Button
              variant="secondary"
              onClick={() => setDemoOpen(true)}
              className="w-full pr-6 pl-3 sm:w-auto"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-soft text-brand">
                <Play className="size-4 fill-brand" aria-hidden="true" />
              </span>
              Watch Demo
            </Button> */}
          </div>
        </div>

        <div className="relative mx-auto aspect-[1024/919] w-full min-w-0 max-w-[420px] sm:max-w-[520px] lg:max-w-[620px] xl:max-w-[680px]">
          <AppImage
            src={imageSrc}
            alt="Excited traveler holding boarding passes and a suitcase"
            fill
            priority
            sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 560px"
            className="object-contain"
          />

          <div className="animate-float-delayed absolute top-[6%] left-0 z-10 scale-90 rounded-2xl border border-white bg-black px-2.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:top-[8%] sm:scale-100 sm:px-3 sm:py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["avatar-1", "avatar-2", "avatar-3"].map((avatar) => (
                  <Image
                    key={avatar}
                    src={`/images/${avatar}.jpg`}
                    alt=""
                    width={28}
                    height={28}
                    className="size-6 rounded-full border-2 border-black object-cover sm:size-7"
                  />
                ))}
              </div>
              <div>
                <p className="flex items-center gap-1 text-sm font-bold leading-none text-[#EDEDED]">
                  <Users className="size-3.5 text-brand" aria-hidden="true" />
                  5000+
                </p>
                <p className="mt-1 text-[11px] text-muted">Travelers</p>
              </div>
            </div>
          </div>

          <div className="animate-float absolute bottom-[12%] left-2 z-10 inline-flex scale-90 items-center gap-1.5 rounded-full border border-white bg-black px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.4)] sm:bottom-[16%] sm:left-8 sm:scale-100 sm:gap-2 sm:px-4 sm:py-2 lg:left-12">
            <MapPin
              className="size-3.5 shrink-0 fill-[#E20E17] text-[#E20E17] sm:size-4"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className="text-[12px] font-bold tracking-[0.14em] text-white sm:text-[13px]">GOA</span>
          </div>

          <div className="animate-float absolute top-[18%] right-0 z-10 inline-flex scale-90 items-center gap-1.5 rounded-full border border-white bg-black px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.4)] sm:top-[22%] sm:scale-100 sm:gap-2 sm:px-4 sm:py-2">
            <MapPin
              className="size-3.5 shrink-0 fill-[#E20E17] text-[#E20E17] sm:size-4"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className="text-[12px] font-bold tracking-[0.14em] text-white sm:text-[13px]">MANALI</span>
          </div>

          <div className="animate-float-delayed absolute right-0 bottom-[12%] z-10 inline-flex scale-90 items-center gap-1.5 rounded-full border border-white bg-black px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.4)] sm:bottom-[16%] sm:scale-100 sm:gap-2 sm:px-4 sm:py-2">
            <MapPin
              className="size-3.5 shrink-0 fill-[#E20E17] text-[#E20E17] sm:size-4"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className="text-[12px] font-bold tracking-[0.14em] text-white sm:text-[13px]">BALI</span>
          </div>
        </div>
      </Container>

      {demoOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-title"
        >
          <div className="w-full max-w-lg rounded-3xl border border-line bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p id="demo-title" className="text-lg font-bold text-[#EDEDED]">
                  Watch a Travelog demo
                </p>
                <p className="mt-1 text-sm text-muted">
                  See how travelers discover destinations, compare packages and book in minutes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDemoOpen(false)}
                className="rounded-full p-2 hover:bg-soft"
                aria-label="Close demo"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl bg-black">
              <div className="flex aspect-video items-center justify-center text-[#EDEDED]">
                <Play className="size-12 opacity-80" />
              </div>
            </div>
            <Button href="/destinations" className="mt-5 w-full">
              Browse destinations
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
