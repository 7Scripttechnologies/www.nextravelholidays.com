"use client";

import { useActionState, useMemo, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";
import Button from "@/components/Button";
import {
  siteImageGroups,
  siteImageSlots,
  type SiteImagesMap,
  type SiteImageValue,
} from "@/data/site-images";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

interface SiteImagesFormProps {
  initial: SiteImagesMap;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function SiteImagesForm({ initial, action }: SiteImagesFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [values, setValues] = useState<SiteImagesMap>(initial);

  const grouped = useMemo(
    () =>
      siteImageGroups().map((group) => ({
        group,
        slots: siteImageSlots.filter((slot) => slot.group === group),
      })),
    [],
  );

  function updateSlot(key: string, patch: Partial<SiteImageValue>) {
    setValues((current) => ({
      ...current,
      [key]: {
        src: patch.src ?? current[key]?.src ?? "",
        caption: patch.caption ?? current[key]?.caption ?? "",
      },
    }));
  }

  return (
    <form action={formAction} className="space-y-8">
      {siteImageSlots.map((slot) => (
        <div key={`hidden-${slot.key}`}>
          <input type="hidden" name={`src__${slot.key}`} value={values[slot.key]?.src ?? ""} />
          <input
            type="hidden"
            name={`caption__${slot.key}`}
            value={values[slot.key]?.caption ?? ""}
          />
        </div>
      ))}

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

      {grouped.map(({ group, slots }) => (
        <section
          key={group}
          className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6"
        >
          <h2 className="text-lg font-extrabold text-[#EDEDED]">{group}</h2>
          <p className="mt-1 text-sm text-muted">
            Upload or paste a path for each image used on the {group.toLowerCase()} pages.
          </p>

          <div className="mt-5 space-y-6">
            {slots.map((slot) => (
              <div key={slot.key} className="border-t border-white/[0.06] pt-5 first:border-0 first:pt-0">
                <ImageField
                  label={slot.label}
                  value={values[slot.key]?.src ?? ""}
                  onChange={(src) => updateSlot(slot.key, { src })}
                  required
                />
                {slot.description ? (
                  <p className="mt-2 text-xs text-[#7A7A7A]">{slot.description}</p>
                ) : null}
                {slot.hasCaption ? (
                  <label className="mt-3 block">
                    <span className="text-sm font-medium text-[#EDEDED]">Caption / location</span>
                    <input
                      type="text"
                      value={values[slot.key]?.caption ?? ""}
                      onChange={(event) => updateSlot(slot.key, { caption: event.target.value })}
                      placeholder={slot.defaultCaption ?? "Manali, India"}
                      className={fieldClass}
                    />
                  </label>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save 7script"}
        </Button>
      </div>
    </form>
  );
}
