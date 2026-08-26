"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DestinationGalleryProps {
  name: string;
  images: string[];
}

export default function DestinationGallery({ name, images }: DestinationGalleryProps) {
  const [active, setActive] = useState(0);
  const count = images.length;

  const slide = (offset: number) => (active + offset + count) % count;

  return (
    <div>
      <div className="grid grid-cols-3 items-center gap-2 sm:gap-3">
        {[-1, 0, 1].map((offset) => {
          const index = slide(offset);
          const isCenter = offset === 0;

          return (
            <button
              key={`${images[index]}-${offset}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "overflow-hidden rounded-2xl border border-white/8 transition",
                isCenter
                  ? "shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                  : "opacity-55 hover:opacity-80",
              )}
              aria-label={`Show ${name} photo ${index + 1}`}
            >
              <Image
                src={images[index]}
                alt={`${name} gallery photo ${index + 1}`}
                width={720}
                height={480}
                className={cn(
                  "w-full object-cover",
                  isCenter ? "aspect-[16/10]" : "aspect-[16/11]",
                )}
                priority={isCenter}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === active ? "w-6 bg-[#E20E17]" : "w-2 bg-white/25 hover:bg-white/40",
            )}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
