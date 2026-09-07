"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";
import Button from "@/components/Button";
import { galleryAspects } from "@/data/gallery";
import type { GalleryRecord } from "@/lib/gallery-db";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

interface GalleryFormProps {
  mode: "create" | "edit";
  initial?: GalleryRecord;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function GalleryForm({ mode, initial, action }: GalleryFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [src, setSrc] = useState(initial?.src ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="src" value={src} />
      <input type="hidden" name="active" value={active ? "1" : "0"} />

      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#EDEDED]">Gallery photo</h2>
        <p className="mt-1 text-sm text-muted">
          Photos appear on the public /gallery page in masonry layout.
        </p>

        <div className="mt-5 space-y-4">
          <ImageField label="Image" value={src} onChange={setSrc} required />

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Alt text</span>
            <input
              name="alt"
              defaultValue={initial?.alt ?? ""}
              required
              placeholder="Paragliding over Himalayan hills"
              className={fieldClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-medium text-[#EDEDED]">Aspect ratio</span>
              <select name="aspect" defaultValue={initial?.aspect ?? "landscape"} className={fieldClass}>
                {galleryAspects.map((aspect) => (
                  <option key={aspect} value={aspect}>
                    {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium text-[#EDEDED]">Sort order</span>
              <input
                name="sortOrder"
                type="number"
                defaultValue={initial?.sortOrder ?? 0}
                className={fieldClass}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              className="size-4 rounded border-line accent-[#E20E17]"
            />
            <span className="text-sm font-medium text-[#EDEDED]">Active on website</span>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending || !src}>
          {pending ? "Saving..." : mode === "create" ? "Add photo" : "Save changes"}
        </Button>
        <Button href="/admin/gallery" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
