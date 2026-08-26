"use client";

import { FormEvent } from "react";
import Button from "@/components/Button";
import { buildBookingWhatsAppUrl } from "@/lib/whatsapp";

interface BookingFormProps {
  packageName: string;
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

export default function BookingForm({ packageName }: BookingFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const travelers = String(formData.get("travelers") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!name || !whatsapp || !date || !travelers) return;

    const url = buildBookingWhatsAppUrl({
      packageName,
      name,
      whatsapp,
      date,
      travelers,
      notes,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <aside className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6 lg:sticky lg:top-28">
      <h2 className="text-xl font-extrabold text-[#EDEDED] sm:text-2xl">Book Your Trip Now</h2>
      <p className="mt-1 text-sm text-muted">Let us know what kind of trip you want</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate={false}>
        <input type="hidden" name="package" value={packageName} />

        <div>
          <label htmlFor="booking-name" className="text-sm font-medium text-[#EDEDED]">
            Name
          </label>
          <input
            id="booking-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your Full Name"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="booking-whatsapp" className="text-sm font-medium text-[#EDEDED]">
            Whatsapp Number
          </label>
          <input
            id="booking-whatsapp"
            name="whatsapp"
            type="tel"
            required
            inputMode="tel"
            placeholder="760093****"
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="booking-date" className="text-sm font-medium text-[#EDEDED]">
              Travel Date
            </label>
            <input id="booking-date" name="date" type="date" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="booking-travelers" className="text-sm font-medium text-[#EDEDED]">
              Travelers
            </label>
            <input
              id="booking-travelers"
              name="travelers"
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              required
              placeholder="ex: 2"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="booking-notes" className="text-sm font-medium text-[#EDEDED]">
            Special requests
          </label>
          <textarea
            id="booking-notes"
            name="notes"
            rows={4}
            placeholder="Tell us what you want on this trip"
            className={`${fieldClass} resize-none`}
          />
        </div>

        <Button type="submit" className="w-full rounded-[12px] py-3.5">
          Book Now
        </Button>
      </form>
    </aside>
  );
}
