import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "@/components/Button";
import ContactForm from "@/components/ContactForm";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { whatsappInquiryUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us — NexTravel Holidays",
  description:
    "Contact NexTravel Holidays for package inquiries, custom trips and travel support on WhatsApp, phone or email.",
};

const contactCards = [
  {
    label: "WhatsApp / Phone",
    value: "+91 8866486477",
    href: "tel:+918866486477",
    icon: Phone,
  },
  {
    label: "Email",
    value: "info@nextravelholidays.com",
    href: "mailto:info@nextravelholidays.com",
    icon: Mail,
  },
  {
    label: "Inquiry",
    value: "Chat with us on WhatsApp",
    href: whatsappInquiryUrl,
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          label="Contact Us"
          title="Let’s plan your next holiday"
          description="Share your destination, travel dates and group size. Our team will reply with package options and a clear next step."
          image="/images/newsletter-bg.png"
          imageAlt="Contact NexTravel Holidays"
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
