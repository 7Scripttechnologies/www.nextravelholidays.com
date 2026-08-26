"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import DestinationCard from "@/components/DestinationCard";
import FadeUp from "@/components/FadeUp";
import SectionLabel from "@/components/SectionLabel";
import {
  destinationCategories,
  type Destination,
  type DestinationCategory,
} from "@/data/destinations";
import { cn } from "@/lib/utils";

export default function PopularDestinations({ destinations }: { destinations: Destination[] }) {
  const [category, setCategory] = useState<DestinationCategory>("Mountain");
  const filtered = useMemo(
    () => destinations.filter((destination) => destination.category === category).slice(0, 6),
    [destinations, category],
  );

  return (
    <section id="destinations" className="scroll-mt-24 py-8 md:py-16">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <FadeUp>
            <SectionLabel>Top destination</SectionLabel>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-4xl">
              Explore top destination
            </h2>
          </FadeUp>

          <div
            className="flex max-w-full gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Destination categories"
          >
            {destinationCategories.map((item) => {
              const selected = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "shrink-0 border-b-2 px-4 py-2 text-sm font-semibold transition-colors",
                    selected
                      ? "border-brand text-brand"
                      : "border-transparent text-muted hover:text-[#EDEDED]",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((destination, index) => (
            <FadeUp key={`${category}-${destination.slug}`} delay={(index % 3) * 80} className="h-full">
              <DestinationCard destination={destination} />
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
