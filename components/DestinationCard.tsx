import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

export default function DestinationCard({ destination, className }: DestinationCardProps) {
  const href = `/destinations/${destination.slug}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <Link href={href} className="flex h-full flex-col">
        <span className="relative block overflow-hidden">
          <Image
            src={destination.image}
            alt={`${destination.name} travel destination`}
            width={640}
            height={480}
            className="aspect-[16/11] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent opacity-80" />
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Star className="size-3.5 fill-[#E20E17] text-[#E20E17]" aria-hidden="true" />
            {destination.rating.toFixed(1)}
          </span>
        </span>

        <span className="flex flex-1 flex-col px-5 pt-5 pb-5">
          <h3 className="text-lg font-bold tracking-tight text-[#EDEDED] transition-colors group-hover:text-white">
            {destination.name}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted">
            {destination.description}
          </p>

          <span className="mt-5 flex items-end justify-between gap-3 border-t border-white/8 pt-4">
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-muted">
                <MapPin className="size-3.5 shrink-0 text-[#E20E17]" aria-hidden="true" />
                <span className="truncate">{destination.location}</span>
              </span>
              {destination.duration ? (
                <span className="pl-5 text-[12px] text-muted/80">{destination.duration}</span>
              ) : null}
            </span>
            <span className="shrink-0 text-xl font-extrabold tracking-tight text-[#E20E17]">
              {destination.price}
            </span>
          </span>

          <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E20E17]/45 bg-[#E20E17]/10 px-5 py-3 text-sm font-semibold text-[#EDEDED] transition-all duration-300 group-hover:border-[#E20E17] group-hover:bg-[#E20E17] group-hover:text-white group-hover:shadow-[0_10px_24px_rgba(226,14,23,0.28)]">
            View Tour
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </span>
      </Link>
    </article>
  );
}
