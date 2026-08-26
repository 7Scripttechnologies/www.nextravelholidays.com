import Image from "next/image";
import { Star } from "lucide-react";
import Container from "@/components/Container";
import FadeUp from "@/components/FadeUp";
import { reviews } from "@/data/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`size-3.5 ${
            index < rating ? "fill-[#E20E17] text-[#E20E17]" : "fill-transparent text-white/20"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] p-5 sm:rounded-[28px] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          className="text-3xl leading-none font-serif text-[#E20E17]"
          aria-hidden="true"
        >
          “
        </span>
        <Stars rating={review.rating} />
      </div>

      <div className="mt-4 flex-1">
        {review.title ? (
          <p className="text-[15px] font-bold tracking-tight text-[#EDEDED]">{review.title}</p>
        ) : null}
        <p
          className={`text-sm leading-7 text-[#B0B0B0] ${review.title ? "mt-2" : ""}`}
        >
          {review.quote}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-4">
        <Image
          src={review.avatar}
          alt=""
          width={44}
          height={44}
          className="size-11 rounded-full object-cover ring-2 ring-[#E20E17]/40"
        />
        <div>
          <p className="text-sm font-bold text-[#EDEDED]">{review.name}</p>
          <p className="mt-0.5 text-xs text-muted">{review.type}</p>
        </div>
      </div>
    </article>
  );
}

function PhotoCard({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[24px] border border-white/10 sm:rounded-[28px] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
    </div>
  );
}

export default function ReviewsSection() {
  const kelvi = reviews[0];
  const dhruhi = reviews[1];
  const jhanvi = reviews[2];
  const lubna = reviews[3];

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24">
      <Container className="relative">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] leading-[1.15] font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-[42px]">
            Real Experiences, Real Smiles
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted md:text-[15px] md:leading-8">
            Read genuine reviews from our happy travelers who experienced unforgettable journeys
            with NexTravel Holidays.
          </p>
        </FadeUp>

        {/* Mobile / tablet: stacked */}
        <div className="mt-10 flex flex-col gap-4 sm:mt-12 lg:hidden">
          <FadeUp>
            <PhotoCard
              src="/images/expert-guides.webp"
              alt="Paragliding adventure with NexTravel"
              className="aspect-[4/5] h-[280px] w-full sm:h-[300px]"
            />
          </FadeUp>
          <FadeUp delay={40}>
            <ReviewCard review={kelvi} />
          </FadeUp>
          <FadeUp delay={60}>
            <ReviewCard review={dhruhi} />
          </FadeUp>
          <FadeUp delay={80}>
            <ReviewCard review={jhanvi} />
          </FadeUp>
          <FadeUp delay={100}>
            <ReviewCard review={lubna} />
          </FadeUp>
          <FadeUp delay={120}>
            <PhotoCard
              src="/images/manali-kasol-adventure.jpg"
              alt="Happy travelers in the mountains"
              className="aspect-[16/10] h-[240px] w-full sm:h-[260px]"
            />
          </FadeUp>
        </div>

        {/* Desktop: 3-column staggered masonry like reference */}
        <div className="mt-14 hidden grid-cols-3 items-start gap-5 lg:grid xl:gap-6">
          <div className="flex flex-col gap-5 xl:gap-6">
            <FadeUp>
              <PhotoCard
                src="/images/expert-guides.webp"
                alt="Paragliding adventure with NexTravel"
                className="h-[300px] w-full xl:h-[320px]"
              />
            </FadeUp>
            <FadeUp delay={80}>
              <ReviewCard review={kelvi} />
            </FadeUp>
          </div>

          <div className="flex flex-col gap-5 pt-12 xl:gap-6 xl:pt-16">
            <FadeUp delay={40}>
              <ReviewCard review={dhruhi} />
            </FadeUp>
            <FadeUp delay={100}>
              <ReviewCard review={jhanvi} />
            </FadeUp>
          </div>

          <div className="flex flex-col gap-5 xl:gap-6">
            <FadeUp delay={60}>
              <ReviewCard review={lubna} />
            </FadeUp>
            <FadeUp delay={120}>
              <PhotoCard
                src="/images/manali-kasol-adventure.jpg"
                alt="Happy travelers in the mountains"
                className="h-[300px] w-full xl:h-[320px]"
              />
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
}
