"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import Button from "@/components/Button";
import { socialLinkFields, type SiteContact } from "@/lib/site-contact";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

interface SiteLinksFormProps {
  initial: SiteContact;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function SiteLinksForm({ initial, action }: SiteLinksFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-8">
      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#EDEDED]">
          {state.success}
        </p>
      ) : null}

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#EDEDED]">Social media</h2>
        <p className="mt-1 text-sm text-muted">
          These links appear as the round icons in the footer. Leave a field empty to hide that
          icon.
        </p>

        <div className="mt-5 space-y-4">
          {socialLinkFields.map((field) => (
            <label key={field.key} className="block">
              <span className="text-sm font-medium text-[#EDEDED]">{field.label}</span>
              <input
                name={field.key}
                type="text"
                defaultValue={initial[field.key]}
                placeholder={field.placeholder}
                className={fieldClass}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#EDEDED]">Contact us</h2>
        <p className="mt-1 text-sm text-muted">
          Phone is used in the footer, contact page, and all WhatsApp buttons.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Phone / WhatsApp number</span>
            <input
              name="phone"
              type="text"
              required
              defaultValue={initial.phoneDisplay}
              placeholder="+91 8866486477"
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Service area</span>
            <textarea
              name="serviceArea"
              required
              rows={3}
              defaultValue={initial.serviceArea}
              placeholder="Gujarat — Ahmedabad, Surat, Vadodara, Rajkot & more"
              className={`${fieldClass} resize-y`}
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save links"}
        </Button>
      </div>
    </form>
  );
}
