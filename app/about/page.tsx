import type { Metadata } from "next";
import Image from "next/image";
import { Globe, Heart, ShieldCheck } from "lucide-react";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import FounderSpotlight from "@/components/FounderSpotlight";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { getSiteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Pulkit Karangiya, Founder & CEO of NexTravel Holidays — Gujarat’s trusted travel partner serving Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar and all major cities with curated holiday packages across India and beyond.",
  keywords: [
    "Pulkit Karangiya",
    "NexTravel Holidays Founder CEO",
    "travel agency Gujarat",
    "best travel agency Ahmedabad",
    "tour packages Surat",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About NexTravel Holidays | Founder & CEO Pulkit Karangiya",
    description:
      "NexTravel Holidays serves travellers across Gujarat — Ahmedabad, Surat, Vadodara, Rajkot and more — led by Founder & CEO Pulkit Karangiya.",
    url: "/about",
  },
};

function StatValue({ value }: { value: string }) {
  const match = value.match(/^(\d+[A-Za-z]*)([+%]?)$/);
  if (!match) {
    return <span className="text-[#EDEDED]">{value}</span>;
  }

  return (
    <>
      <span className="text-[#EDEDED]">{match[1]}</span>
      {match[2] ? <span className="text-[#E20E17]">{match[2]}</span> : null}
    </>
  );
}

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4K+", label: "Happy Travelers" },
  { value: "1000+", label: "Travel Destinations" },
];

const values = [
  {
    title: "Meaningful Experiences",
    description:
      "We design travel journeys that help you explore culture, nature and unique destinations in the most authentic way.",
    icon: Globe,
  },
  {
    title: "Trust & Transparency",
    description:
      "We believe in honest pricing, clear communication and reliable services so you always know what to expect.",
    icon: ShieldCheck,
  },
  {
    title: "Customer First Approach",
    description:
      "Your comfort and satisfaction are our top priorities — from trip planning to your safe return home.",
    icon: Heart,
  },
];

export default async function AboutPage() {
  const images = await getSiteImages();
  const collage = [
    {
      src: images.about_collage_1?.src ?? "/images/tropical.jpg",
      alt: "Wildlife and nature experience",
      className:
        "relative col-span-1 aspect-[3/4] overflow-hidden rounded-[18px] sm:rounded-[22px] md:row-span-2 md:aspect-auto",
      sizes: "(max-width: 768px) 50vw, 18vw",
    },
    {
      src: images.about_collage_2?.src ?? "/images/maldives.jpg",
      alt: "Luxury coastal escape",
      className:
        "relative col-span-1 aspect-[16/11] overflow-hidden rounded-[18px] sm:rounded-[22px] md:col-span-2 md:aspect-auto",
      sizes: "(max-width: 768px) 50vw, 36vw",
      priority: true,
    },
    {
      src: images.about_collage_3?.src ?? "/images/expert-guides.webp",
      alt: "Paragliding adventure over hillside town",
      className:
        "relative col-span-1 aspect-[3/4] overflow-hidden rounded-[18px] sm:rounded-[22px] md:row-span-2 md:aspect-auto",
      sizes: "(max-width: 768px) 50vw, 20vw",
    },
    {
      src: images.about_collage_4?.src ?? "/images/manali-kasol-adventure.jpg",
      alt: "Mountain adventure",
      className:
        "relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto",
      sizes: "(max-width: 768px) 50vw, 18vw",
    },
    {
      src: images.about_collage_5?.src ?? "/images/beach.jpg",
      alt: "Fun beach holiday",
      className:
        "relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto",
      sizes: "(max-width: 768px) 50vw, 18vw",
    },
    {
      src: images.about_collage_6?.src ?? "/images/kashmir.jpg",
      alt: "Kashmir lake journey",
      className:
        "relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto",
      sizes: "(max-width: 768px) 50vw, 18vw",
    },
    {
      src: images.about_collage_7?.src ?? "/images/forest.jpg",
      alt: "Scenic hillside view",
      className:
        "relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto",
      sizes: "(max-width: 768px) 50vw, 18vw",
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="About NexTravel"
          title="Your Trusted Travel Partner"
          description="Real travelers, real memories — NexTravel Holidays plans trips for families and groups across Gujarat and beyond, built on passion, trust and shared experiences."
          image={images.about_hero?.src ?? "/images/about-hero.png"}
          imageAlt="NexTravel travelers together at a temple during a holiday trip"
          imageClassName="object-[center_62%]"
          cta={{ href: "/destinations", label: "Explore Destinations" }}
          secondaryCta={{ href: "/contact", label: "Contact Us" }}
        />

        {/* Title + mosaic + intro/stats — reference structure */}
        <section className="py-14 md:py-20">
          <Container>
            <h2 className="max-w-3xl text-[30px] leading-[1.15] font-extrabold tracking-tight text-[#EDEDED] sm:text-4xl lg:text-[46px]">
              A Journey Built on Passion,
              <br />
              Travel & Trust
            </h2>

            {/* Collage: tall | yacht+smalls | tall | stack */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-5 md:grid-rows-[minmax(160px,22vw)_minmax(160px,22vw)] lg:gap-5">
              {collage.map((item) => (
                <div key={item.alt} className={item.className}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={item.priority}
                    sizes={item.sizes}
                    className="object-cover"
                    unoptimized={/^https?:\/\//i.test(item.src)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-2 lg:gap-16 xl:gap-24">
              <div className="space-y-5 text-sm leading-7 text-muted md:text-[15px] md:leading-8">
                <p>
                  At{" "}
                  <span className="font-semibold text-[#EDEDED]">NexTravel Holidays</span>, led by
                  Founder &amp; CEO{" "}
                  <span className="font-semibold text-[#EDEDED]">Pulkit Karangiya</span>, we believe
                  that every journey should be as unique as the traveler. Based in Gujarat, we serve
                  travellers from Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Bhavnagar,
                  Jamnagar, Junagadh and every major city across the state — creating personalized
                  holiday experiences with clear planning from start to finish.
                </p>
                <p>
                  With a commitment to exceptional service and customer satisfaction, NexTravel
                  Holidays is your trusted travel partner across Gujarat, India and beyond —
                  turning every journey into a seamless and memorable experience.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:gap-x-14 sm:gap-y-10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[40px] leading-none font-extrabold tracking-tight sm:text-5xl">
                      <StatValue value={stat.value} />
                    </p>
                    <p className="mt-2.5 text-sm text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Core values */}
        <section className="bg-[#141414] py-16 md:py-24">
          <Container>
            <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-24">
              <h2 className="max-w-xl text-[28px] leading-[1.2] font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-[40px] md:leading-[1.15]">
                Our Core Values – What Drives
                <br className="hidden sm:block" /> NexTravel Holidays
              </h2>
              <p className="max-w-md text-sm leading-7 text-muted lg:pt-2 md:text-[15px] md:leading-8">
                At NexTravel Holidays, our values define how we plan, execute and deliver every
                travel experience.
              </p>
            </div>

            <div className="mt-12 grid gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-8 lg:mt-16 lg:gap-12">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article key={value.title} className="min-w-0">
                    <span className="flex size-12 items-center justify-center rounded-full bg-[#E20E17] text-white sm:size-[52px]">
                      <Icon className="size-5 sm:size-6" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-[#EDEDED] sm:mt-6 sm:text-xl">
                      {value.title}
                    </h3>
                    <p className="mt-2.5 max-w-sm text-sm leading-7 text-muted">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="py-14 pb-16 md:py-20 md:pb-24">
          <Container>
            <FounderSpotlight imageSrc={images.about_founder?.src ?? "/images/pulkit-11.jpg"} />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
