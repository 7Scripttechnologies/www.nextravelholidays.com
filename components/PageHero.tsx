import Image from "next/image";
import Button from "@/components/Button";
import Container from "@/components/Container";
import SectionLabel from "@/components/SectionLabel";

interface PageHeroProps {
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
  cta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}

export default function PageHero({
  label,
  title,
  description,
  image,
  imageAlt,
  imageClassName,
  cta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="relative isolate -mt-[84px] min-h-[100svh] overflow-hidden pt-[84px] sm:-mt-[92px] sm:pt-[92px]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover ${imageClassName ?? "object-center"}`}
        unoptimized={/^https?:\/\//i.test(image)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/35" />
      <div className="absolute inset-0 bg-black/25" />

      <Container className="relative z-10 flex min-h-[calc(100svh-84px)] flex-col justify-end pb-12 sm:min-h-[calc(100svh-92px)] sm:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <SectionLabel>{label}</SectionLabel>
          <h1 className="mt-3 text-[32px] leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px]">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#EDEDED]/85 sm:text-base">
            {description}
          </p>
          {cta || secondaryCta ? (
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              {cta ? (
                <Button href={cta.href} className="w-full sm:w-auto">
                  {cta.label}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button href={secondaryCta.href} variant="secondary" className="w-full sm:w-auto">
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
