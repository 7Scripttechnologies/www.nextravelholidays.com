"use client";

import { FormEvent } from "react";
import Button from "@/components/Button";
import { useSiteContact } from "@/components/SiteContactProvider";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

export default function ContactForm() {
  const contact = useSiteContact();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !whatsapp || !subject || !message) return;

    const url = buildContactWhatsAppUrl(
      { name, whatsapp, email, subject, message },
      contact.whatsappDigits,
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6"
    >
      <h2 className="text-xl font-extrabold text-[#EDEDED] sm:text-2xl">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">Fill the form and continue on WhatsApp.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-[#EDEDED]">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your Full Name"
            className={fieldClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-whatsapp" className="text-sm font-medium text-[#EDEDED]">
              WhatsApp Number
            </label>
            <input
              id="contact-whatsapp"
              name="whatsapp"
              type="tel"
              required
              inputMode="tel"
              placeholder="760093****"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="text-sm font-medium text-[#EDEDED]">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="text-sm font-medium text-[#EDEDED]">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="Package inquiry / Custom trip / Support"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm font-medium text-[#EDEDED]">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            placeholder="Tell us where you want to go and when"
            className={`${fieldClass} resize-none`}
          />
        </div>

        <Button type="submit" className="w-full rounded-[12px] py-3.5">
          Send on WhatsApp
        </Button>
      </div>
    </form>
  );
}
