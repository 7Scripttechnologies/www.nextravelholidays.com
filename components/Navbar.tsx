"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useSiteContact } from "@/components/SiteContactProvider";
import { whatsappInquiryUrlFor } from "@/lib/whatsapp";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const contact = useSiteContact();
  const inquiryUrl = whatsappInquiryUrlFor(contact.whatsappDigits);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 rounded-full border-2 border-white/30 bg-white/12 px-3 py-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:gap-5 sm:px-5 sm:py-3">
          <Logo
            imageClassName="h-9 sm:h-10"
            onClick={() => setOpen(false)}
            className="pl-1 sm:pl-1.5"
          />

          <nav className="hidden items-center gap-1 md:flex lg:gap-2" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-[13px] font-semibold tracking-[0.01em] transition-colors duration-300 lg:px-4 lg:text-[14px]",
                  "after:absolute after:right-3 after:bottom-1 after:left-3 after:h-[2px] after:origin-left after:rounded-full after:bg-[#E20E17] after:transition-transform after:duration-300 after:ease-out lg:after:right-4 lg:after:left-4",
                  isActive(link.href)
                    ? "text-[#E20E17] after:scale-x-100"
                    : "text-[#EDEDED] after:scale-x-0 hover:text-[#E20E17] hover:after:scale-x-100",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={inquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Inquire on WhatsApp"
              className="hidden rounded-full bg-[#E20E17] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_22px_rgba(226,14,23,0.35)] transition hover:brightness-110 sm:inline-flex lg:px-6 lg:text-sm"
            >
              Get Inquiry
            </a>

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-[#EDEDED] transition hover:border-[#E20E17]/50 hover:text-[#E20E17] md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="mx-auto mt-2 max-w-[1100px] overflow-hidden rounded-[28px] border-2 border-white/30 bg-white/12 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                    isActive(link.href)
                      ? "bg-[#E20E17] text-white"
                      : "text-[#EDEDED] hover:bg-white/5",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href={inquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center rounded-full bg-[#E20E17] px-5 py-3 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Get Inquiry
            </a>
          </div>
        ) : null}
      </header>

      <div className="h-[84px] sm:h-[92px]" aria-hidden="true" />
    </>
  );
}
