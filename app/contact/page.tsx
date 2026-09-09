import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "@/components/Button";
import ContactForm from "@/components/ContactForm";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/lib/site";
import { getSiteImages } from "@/lib/site-images";
import { whatsappInquiryUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact NexTravel Holidays in Gujarat (Founder & CEO Pulkit Karangiya) — WhatsApp, phone or email for holiday packages from Ahmedabad, Surat, Vadodara, Rajkot and all Gujarat cities.",
  keywords: [
    "contact NexTravel Holidays",
    "travel agency Gujarat contact",
    "holiday packages Ahmedabad WhatsApp",
    "tour packages Surat",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact NexTravel Holidays | Gujarat Travel Agency",
    description:
      "Book with Founder & CEO Pulkit Karangiya’s team — serving travellers across Gujarat.",
    url: "/contact",
  },
};

const contactCards = [
  {
    label: "WhatsApp / Phone",
    value: siteConfig.phoneDisplay,
    href: `tel:${siteConfig.phone}`,
    icon: Phone,
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
  },
  {
    label: "Inquiry",
    value: "Chat with us on WhatsApp",
    href: whatsappInquiryUrl,
    icon: MapPin,
  },
];

export default async function ContactPage() {
  const images = await getSiteImages();

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Contact Us"
          title="Let’s plan your next holiday"
          description="Serving travellers from Ahmedabad, Surat, Vadodara, Rajkot and every major Gujarat city. Share your destination, dates and group size — we reply on WhatsApp."
          image={images.contact_hero?.src ?? "/images/newsletter-bg.png"}
          imageAlt="Contact NexTravel Holidays Gujarat travel agency"
          cta={{ href: whatsappInquiryUrl, label: "WhatsApp Inquiry" }}
          secondaryCta={{ href: "/destinations", label: "See Destinations" }}
        />

        <section className="py-14 md:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#EDEDED]">
                  Get in touch
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted md:text-base">
                  Prefer a quick chat? Call or WhatsApp us. Prefer details first? Fill the form and
                  we will continue the conversation on WhatsApp.
                </p>

                <div className="mt-8 space-y-4">
                  {contactCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <a
                        key={card.label}
                        href={card.href}
                        target={card.href.startsWith("http") ? "_blank" : undefined}
                        rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-4 rounded-2xl border border-white/8 bg-[#111111] p-5 transition hover:border-brand/30"
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2A1516] text-[#E20E17]">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                            {card.label}
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-[#EDEDED] sm:text-base">
                            {card.value}
                          </span>
                        </span>
                      </a>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <a
                    href={siteConfig.socials.instagram}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="font-semibold text-brand transition hover:text-[#EDEDED]"
                  >
                    Instagram
                  </a>
                  <span className="text-muted" aria-hidden="true">
                    ·
                  </span>
                  <a
                    href={siteConfig.socials.googleBusiness}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="font-semibold text-brand transition hover:text-[#EDEDED]"
                  >
                    Google Business Profile
                  </a>
                </div>

                <div className="mt-8">
                  <Button href="/about" variant="secondary">
                    Learn About Us
                  </Button>
                </div>
              </div>

              <ContactForm />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
