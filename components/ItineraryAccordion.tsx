"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ItineraryDay } from "@/data/destinations";
import { cn } from "@/lib/utils";

interface ItineraryAccordionProps {
  days: ItineraryDay[];
}

export default function ItineraryAccordion({ days }: ItineraryAccordionProps) {
  const [openDay, setOpenDay] = useState(days[1]?.day ?? days[0]?.day ?? 1);

  return (
    <div className="divide-y divide-line">
      {days.map((item) => {
        const open = openDay === item.day;

        return (
          <div key={item.day}>
            <button
              type="button"
              onClick={() => setOpenDay(open ? 0 : item.day)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={open}
            >
              <span className="text-base font-semibold text-[#EDEDED] sm:text-lg">
                Day {item.day} — {item.title}
              </span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-muted">
                {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
              </span>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-2 text-sm leading-6 text-muted">{item.summary}</p>
                <ul className="flex flex-col gap-2 pb-5">
                  {item.activities.map((activity) => (
                    <li key={activity} className="flex items-start gap-2 text-sm text-[#EDEDED]">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#E20E17]" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
