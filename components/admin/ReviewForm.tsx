"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";
import Button from "@/components/Button";
import type { ReviewRecord } from "@/lib/reviews-db";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

interface ReviewFormProps {
  mode: "create" | "edit";
  initial?: ReviewRecord;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function ReviewForm({ mode, initial, action }: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [avatar, setAvatar] = useState(initial?.avatar ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="avatar" value={avatar} />
      <input type="hidden" name="active" value={active ? "1" : "0"} />

      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#EDEDED]">Traveler review</h2>
        <p className="mt-1 text-sm text-muted">
          Reviews rotate every 5 seconds on the homepage and destinations page.
        </p>

        <div className="mt-5 space-y-4">
          <ImageField label="Avatar" value={avatar} onChange={setAvatar} required />

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-medium text-[#EDEDED]">Name</span>
              <input
                name="name"
                defaultValue={initial?.name ?? ""}
                required
                placeholder="Kelvi"
                className={fieldClass}
              />
            </label>

            <label>
              <span className="text-sm font-medium text-[#EDEDED]">Traveler type</span>
              <input
                name="type"
                defaultValue={initial?.type ?? ""}
                required
                placeholder="Solo Traveler"
                className={fieldClass}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Title (optional)</span>
            <input
              name="title"
              defaultValue={initial?.title ?? ""}
              placeholder="Himachal Trip Done Right"
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Quote</span>
            <textarea
              name="quote"
              defaultValue={initial?.quote ?? ""}
              required
              rows={5}
              placeholder="Amazing experience! Our trip was perfectly organized..."
              className={`${fieldClass} resize-y`}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-medium text-[#EDEDED]">Rating</span>
              <select name="rating" defaultValue={String(initial?.rating ?? 5)} className={fieldClass}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value === 1 ? "" : "s"}
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
        <Button type="submit" disabled={pending || !avatar}>
          {pending ? "Saving..." : mode === "create" ? "Add review" : "Save changes"}
        </Button>
        <Button href="/admin/reviews" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
