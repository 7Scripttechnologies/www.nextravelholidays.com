"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { LegalSection } from "@/data/terms";
import { cn } from "@/lib/utils";

interface LegalAccordionProps {
  sections: LegalSection[];
  defaultOpenIndex?: number;
}

export default function LegalAccordion({ sections, defaultOpenIndex = 0 }: LegalAccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {sections.map((section, index) => {
        const open = openIndex === index;

        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
              aria-expanded={open}
            >
              <span className="text-[15px] font-bold tracking-tight text-[#EDEDED] sm:text-lg">
                {section.title}
              </span>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center transition",
                  open ? "text-[#E20E17]" : "text-[#7A7A7A]",
                )}
                aria-hidden="true"
              >
                {open ? <Minus className="size-5 stroke-[1.5]" /> : <Plus className="size-5 stroke-[1.5]" />}
              </span>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-6 sm:pb-7">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 56)}
                      className="mt-0 mb-3 text-sm leading-7 text-[#9A9A9A] last:mb-0 md:text-[15px] md:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets?.length ? (
                    <ul className={cn("space-y-2.5", section.paragraphs.length > 0 && "mt-4")}>
                      {section.bullets.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-7 text-[#B0B0B0] md:text-[15px] md:leading-8"
                        >
                          <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[#E20E17]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
