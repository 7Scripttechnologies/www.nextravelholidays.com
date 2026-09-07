import type { Metadata } from "next";
import Image from "next/image";
import { Globe, Heart, ShieldCheck } from "lucide-react";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";

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

const team = [
  {
    name: "Pulkit Karangiya",
    role: "Founder & CEO",
    image: "/images/hero-traveler.jpg",
    offset: "lg:translate-y-2",
  },
  {
    name: "Operations",
    role: "Managing Director",
    image: "/images/experience-traveler.jpg",
    offset: "lg:translate-y-10",
  },
  {
    name: "Holiday Desk",
    role: "Travel Consultant",
    image: "/images/dream-traveler.jpg",
    offset: "lg:-translate-y-4",
  },
  {
    name: "Guest Care",
    role: "Travel Consultant",
    image: "/images/avatar-1.jpg",
    offset: "lg:translate-y-6",
  },
  {
    name: "Tour Desk",
    role: "Tour Manager",
    image: "/images/avatar-2.jpg",
    offset: "lg:translate-y-12",
  },
  {
    name: "Field Support",
    role: "Tour Manager",
    image: "/images/avatar-3.jpg",
    offset: "lg:translate-y-1",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="About NexTravel"
          title="Your Trusted Travel Partner"
          description="Real travelers, real memories — NexTravel Holidays plans trips for families and groups across Gujarat and beyond, built on passion, trust and shared experiences."
          image="/images/about-hero.png"
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
              <div className="relative col-span-1 aspect-[3/4] overflow-hidden rounded-[18px] sm:rounded-[22px] md:row-span-2 md:aspect-auto">
                <Image
                  src="/images/tropical.jpg"
                  alt="Wildlife and nature experience"
                  fill
                  sizes="(max-width: 768px) 50vw, 18vw"
                  className="object-cover"
                />
              </div>

              <div className="relative col-span-1 aspect-[16/11] overflow-hidden rounded-[18px] sm:rounded-[22px] md:col-span-2 md:aspect-auto">
                <Image
                  src="/images/maldives.jpg"
                  alt="Luxury coastal escape"
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, 36vw"
                  className="object-cover"
                />
              </div>

              <div className="relative col-span-1 aspect-[3/4] overflow-hidden rounded-[18px] sm:rounded-[22px] md:row-span-2 md:aspect-auto">
                <Image
                  src="/images/expert-guides.webp"
                  alt="Paragliding adventure over hillside town"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>

              <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto">
                <Image
                  src="/images/manali-kasol-adventure.jpg"
                  alt="Mountain adventure"
                  fill
                  sizes="(max-width: 768px) 50vw, 18vw"
                  className="object-cover"
                />
              </div>

              <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto">
                <Image
                  src="/images/beach.jpg"
                  alt="Fun beach holiday"
                  fill
                  sizes="(max-width: 768px) 50vw, 18vw"
                  className="object-cover"
                />
              </div>

              <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto">
                <Image
                  src="/images/kashmir.jpg"
                  alt="Kashmir lake journey"
                  fill
                  sizes="(max-width: 768px) 50vw, 18vw"
                  className="object-cover"
                />
              </div>

              <div className="relative col-span-1 aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[22px] md:aspect-auto">
                <Image
                  src="/images/forest.jpg"
                  alt="Scenic hillside view"
                  fill
                  sizes="(max-width: 768px) 50vw, 18vw"
                  className="object-cover"
                />
              </div>
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

        {/* Team */}
        <section className="py-16 pb-20 md:py-24 md:pb-28">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-[28px] leading-[1.2] font-extrabold tracking-tight text-[#EDEDED] sm:text-3xl md:text-[40px]">
                Meet the Experts Behind NexTravel Holidays
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted md:text-[15px] md:leading-8">
                Our passionate team of travel experts is dedicated to crafting unforgettable
                journeys. With deep destination knowledge and a commitment to excellence, we take
                care of every detail so you can travel with confidence.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 md:grid-cols-3 lg:mt-16 lg:grid-cols-6 lg:gap-5 lg:pb-10">
              {team.map((member) => (
                <article
                  key={member.name + member.role}
                  className={`group relative aspect-[3/4] overflow-hidden rounded-[22px] bg-[#111111] transition-transform duration-500 sm:rounded-[26px] lg:aspect-[2/3] ${member.offset}`}
                >
                  <Image
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    fill
                    sizes="(max-width: 768px) 45vw, 16vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="text-sm font-bold text-white sm:text-base">{member.name}</p>
                    <p className="mt-0.5 text-xs text-white/80 sm:text-sm">{member.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
