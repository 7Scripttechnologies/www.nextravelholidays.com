"use client";

import AppImage from "@/components/AppImage";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Container from "@/components/Container";
import FadeUp from "@/components/FadeUp";
import { REVIEW_SLOT_COUNT, type Review } from "@/data/reviews";

const FLIP_INTERVAL_MS = 5000;
const FLIP_DURATION_MS = 700;

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

function ReviewCardFace({ review }: { review: Review }) {
  return (
    <article className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] p-5 sm:min-h-[300px] sm:rounded-[28px] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl leading-none font-serif text-[#E20E17]" aria-hidden="true">
          “
        </span>
        <Stars rating={review.rating} />
      </div>

      <div className="mt-4 flex-1">
        {review.title ? (
          <p className="text-[15px] font-bold tracking-tight text-[#EDEDED]">{review.title}</p>
        ) : null}
        <p className={`text-sm leading-7 text-[#B0B0B0] ${review.title ? "mt-2" : ""}`}>
          {review.quote}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-4">
        <AppImage
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

function FlipReviewCard({
  review,
  reduceMotion,
  staggerMs = 0,
}: {
  review: Review;
  reduceMotion: boolean;
  staggerMs?: number;
}) {
  const [front, setFront] = useState(review);
  const [back, setBack] = useState(review);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (review.id === front.id) return;

    if (reduceMotion) {
      setFront(review);
      setBack(review);
      setFlipped(false);
      setAnimating(false);
      return;
    }

    let frame = 0;
    const start = window.setTimeout(() => {
      setBack(review);
      setAnimating(true);
      frame = requestAnimationFrame(() => setFlipped(true));
    }, staggerMs);

    const done = window.setTimeout(() => {
      setFront(review);
      setFlipped(false);
      setAnimating(false);
    }, staggerMs + FLIP_DURATION_MS);

    return () => {
      window.clearTimeout(start);
      cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [review, front.id, reduceMotion, staggerMs]);

  return (
    <div className="h-full [perspective:1200px]">
      <div
        className="relative h-full transition-transform ease-in-out [transform-style:preserve-3d]"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transitionDuration: animating ? `${FLIP_DURATION_MS}ms` : "0ms",
        }}
      >
        <div className="h-full [backface-visibility:hidden]">
          <ReviewCardFace review={front} />
        </div>
        <div className="absolute inset-0 h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <ReviewCardFace review={back} />
        </div>
      </div>
    </div>
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
      <AppImage
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

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduceMotion;
}

function useVisibleReviews(reviews: Review[]) {
  const pageCount = Math.max(1, Math.ceil(reviews.length / REVIEW_SLOT_COUNT));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [reviews]);

  useEffect(() => {
    if (pageCount <= 1 || reviews.length === 0) return;

    const id = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, FLIP_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [pageCount, reviews.length]);

  if (reviews.length === 0) return [];

  return Array.from({ length: Math.min(REVIEW_SLOT_COUNT, reviews.length) }, (_, slot) => {
    const index = (page * REVIEW_SLOT_COUNT + slot) % reviews.length;
    return reviews[index];
  });
}

export default function ReviewsCarousel({
  reviews,
  photoOne = "/images/expert-guides.webp",
  photoTwo = "/images/manali-kasol-adventure.jpg",
}: {
  reviews: Review[];
  photoOne?: string;
  photoTwo?: string;
}) {
  const visible = useVisibleReviews(reviews);
  const reduceMotion = usePrefersReducedMotion();

  if (visible.length === 0) return null;

  const [a, b, c, d] = [
    visible[0],
    visible[1] ?? visible[0],
    visible[2] ?? visible[0],
    visible[3] ?? visible[0],
  ];

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

        <div className="mt-10 flex flex-col gap-4 sm:mt-12 lg:hidden">
          <FadeUp>
            <PhotoCard
              src={photoOne}
              alt="Paragliding adventure with NexTravel"
              className="aspect-[4/5] h-[280px] w-full sm:h-[300px]"
            />
          </FadeUp>
          <FadeUp delay={40}>
            <FlipReviewCard review={a} reduceMotion={reduceMotion} staggerMs={0} />
          </FadeUp>
          <FadeUp delay={60}>
            <FlipReviewCard review={b} reduceMotion={reduceMotion} staggerMs={90} />
          </FadeUp>
          <FadeUp delay={80}>
            <FlipReviewCard review={c} reduceMotion={reduceMotion} staggerMs={180} />
          </FadeUp>
          <FadeUp delay={100}>
            <FlipReviewCard review={d} reduceMotion={reduceMotion} staggerMs={270} />
          </FadeUp>
          <FadeUp delay={120}>
            <PhotoCard
              src={photoTwo}
              alt="Happy travelers in the mountains"
              className="aspect-[16/10] h-[240px] w-full sm:h-[260px]"
            />
          </FadeUp>
        </div>

        <div className="mt-14 hidden grid-cols-3 items-start gap-5 lg:grid xl:gap-6">
          <div className="flex flex-col gap-5 xl:gap-6">
            <FadeUp>
              <PhotoCard
                src={photoOne}
                alt="Paragliding adventure with NexTravel"
                className="h-[300px] w-full xl:h-[320px]"
              />
            </FadeUp>
            <FadeUp delay={80}>
              <FlipReviewCard review={a} reduceMotion={reduceMotion} staggerMs={0} />
            </FadeUp>
          </div>

          <div className="flex flex-col gap-5 pt-12 xl:gap-6 xl:pt-16">
            <FadeUp delay={40}>
              <FlipReviewCard review={b} reduceMotion={reduceMotion} staggerMs={90} />
            </FadeUp>
            <FadeUp delay={100}>
              <FlipReviewCard review={c} reduceMotion={reduceMotion} staggerMs={180} />
            </FadeUp>
          </div>

          <div className="flex flex-col gap-5 xl:gap-6">
            <FadeUp delay={60}>
              <FlipReviewCard review={d} reduceMotion={reduceMotion} staggerMs={270} />
            </FadeUp>
            <FadeUp delay={120}>
              <PhotoCard
                src={photoTwo}
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
