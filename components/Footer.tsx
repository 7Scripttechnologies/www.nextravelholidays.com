import Link from "next/link";
import ConsultationCTA from "@/components/ConsultationCTA";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import { siteConfig } from "@/lib/site";

const socials = [
  {
    href: siteConfig.socials.facebook,
    label: "Facebook",
    rel: "noopener noreferrer",
    icon: (
      <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden="true">
        <path d="M14.1 21v-7.3h2.46l.37-2.85h-2.83V9.02c0-.83.23-1.39 1.42-1.39h1.51V5.08A20.2 20.2 0 0 0 14.5 4.9c-2.18 0-3.67 1.33-3.67 3.77v2.18H8.3v2.85h2.53V21h3.27z" />
      </svg>
    ),
  },
  {
    href: siteConfig.socials.instagram,
    label: "Instagram",
    rel: "me noopener noreferrer",
    icon: (
      <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden="true">
        <path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.81 4.81 0 0 0 12 7.2zm0 7.92A3.12 3.12 0 1 1 15.12 12 3.12 3.12 0 0 1 12 15.12zM17.52 6.96a1.12 1.12 0 1 1-1.12-1.12 1.12 1.12 0 0 1 1.12 1.12zM21.6 7.2a5.56 5.56 0 0 0-1.52-3.94A5.56 5.56 0 0 0 16.14 1.74C14.86 1.68 14.46 1.66 12 1.66s-2.86.02-4.14.08a5.56 5.56 0 0 0-3.94 1.52A5.56 5.56 0 0 0 2.4 7.2c-.06 1.28-.08 1.68-.08 4.14s.02 2.86.08 4.14a5.56 5.56 0 0 0 1.52 3.94 5.56 5.56 0 0 0 3.94 1.52c1.28.06 1.68.08 4.14.08s2.86-.02 4.14-.08a5.56 5.56 0 0 0 3.94-1.52 5.56 5.56 0 0 0 1.52-3.94c.06-1.28.08-1.68.08-4.14s-.02-2.86-.08-4.14zm-1.68 8.16a3.72 3.72 0 0 1-.84 2.09 3.72 3.72 0 0 1-2.09.84c-1.26.06-1.64.07-3.99.07s-2.73-.01-3.99-.07a3.72 3.72 0 0 1-2.09-.84 3.72 3.72 0 0 1-.84-2.09c-.06-1.26-.07-1.64-.07-3.99s.01-2.73.07-3.99a3.72 3.72 0 0 1 .84-2.09 3.72 3.72 0 0 1 2.09-.84c1.26-.06 1.64-.07 3.99-.07s2.73.01 3.99.07a3.72 3.72 0 0 1 2.09.84 3.72 3.72 0 0 1 .84 2.09c.06 1.26.07 1.64.07 3.99s-.01 2.73-.07 3.99z" />
      </svg>
    ),
  },
  {
    href: siteConfig.socials.x,
    label: "X",
    rel: "noopener noreferrer",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M18.9 2.25h3.24L14.1 10.4l9.15 11.35h-7.16L10.5 14.8 4.4 21.75H1.14L9.4 13l-8.9-10.75h7.34l5.1 6.72 6.96-6.72zm-1.14 17.4h1.8L6.42 4.08H4.5l13.26 15.57z" />
      </svg>
    ),
  },
  {
    href: siteConfig.socials.youtube,
    label: "YouTube",
    rel: "noopener noreferrer",
    icon: (
      <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden="true">
        <path d="M23.5 6.19a2.97 2.97 0 0 0-2.09-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.41.49a2.97 2.97 0 0 0-2.09 2.1A29.5 29.5 0 0 0 0 12a29.5 29.5 0 0 0 .5 5.81 2.97 2.97 0 0 0 2.09 2.1c1.91.49 9.41.49 9.41.49s7.5 0 9.41-.49a2.97 2.97 0 0 0 2.09-2.1A29.5 29.5 0 0 0 24 12a29.5 29.5 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
      </svg>
    ),
  },
  {
    href: siteConfig.socials.googleBusiness,
    label: "Google Business Profile",
    rel: "me noopener noreferrer",
    icon: (
      <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden="true">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.98 3.36-2.1 4.36-1.36 1.24-3.4 2.04-5.74 2.04-4.56 0-8.24-3.72-8.24-8.28S7.92 4.04 12.48 4.04c2.48 0 4.3.98 5.62 2.24l2.4-2.4C18.54 1.84 15.78.5 12.48.5 6.72.5 2 5.16 2 11.32S6.72 22.14 12.48 22.14c3.52 0 6.16-1.16 8.2-3.32 2.12-2.16 2.78-5.2 2.78-7.64 0-.76-.08-1.48-.2-2.08h-10.78z" />
      </svg>
    ),
  },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <>
      <ConsultationCTA />
      <footer className="border-t border-white/8 bg-black pt-12 pb-8 md:pt-14">
        <Container>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-10 lg:gap-x-12">
            <div className="col-span-2 md:col-span-1">
              <Logo imageClassName="h-10 sm:h-11" />
              <p className="mt-4 max-w-[280px] text-sm leading-6 text-muted">
                Gujarat’s holiday experts — NexTravel Holidays, {siteConfig.founder.jobTitle}{" "}
                {siteConfig.founder.name}. Serving Ahmedabad, Surat, Vadodara, Rajkot and cities
                across Gujarat.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel={social.rel}
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full bg-[#2A1516] text-brand transition hover:bg-brand hover:text-[#EDEDED]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#EDEDED]">Company</h2>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#EDEDED]">Legal</h2>
              <ul className="mt-4 space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#EDEDED]">Contact us</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="break-words transition hover:text-brand"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="transition hover:text-brand">
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
                <li className="leading-6">
                  Service area: Gujarat — Ahmedabad, Surat, Vadodara, Rajkot &amp; more
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-line pt-6 text-sm leading-6 text-muted">
            <p>
              Copyright © NexTravel Holidays 2026. All Rights Reserved. Design By{" "}
              <a
                href="https://www.7scripttechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#EDEDED] transition hover:text-brand"
              >
                7Script ❤️
              </a>
            </p>
          </div>
        </Container>
      </footer>
    </>
  );
}
