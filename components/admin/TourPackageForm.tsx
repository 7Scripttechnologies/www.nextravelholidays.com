"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import {
  FormSection,
  IncludesEditor,
  StayPlanEditor,
  fieldClass,
  fromIncludeDrafts,
  fromStayDrafts,
  toIncludeDrafts,
  toStayDrafts,
} from "@/components/admin/billing-fields";
import Button from "@/components/Button";
import { durationFromStayPlan, totalNights } from "@/lib/invoice";
import type { TourPackageRecord } from "@/lib/tour-packages-db";

interface TourPackageFormProps {
  mode: "create" | "edit";
  initial?: TourPackageRecord;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function TourPackageForm({ mode, initial, action }: TourPackageFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [name, setName] = useState(initial?.name ?? "");
  const [stayRows, setStayRows] = useState(() => toStayDrafts(initial?.stayPlan ?? []));
  const [includeRows, setIncludeRows] = useState(() => toIncludeDrafts(initial?.includes ?? []));
  const [durationOverride, setDurationOverride] = useState<string | null>(() =>
    initial && initial.duration !== durationFromStayPlan(initial.stayPlan) ? initial.duration : null,
  );

  const stayPlan = fromStayDrafts(stayRows);
  const includes = fromIncludeDrafts(includeRows);
  const autoDuration = durationFromStayPlan(stayPlan);
  const duration = durationOverride ?? autoDuration;

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <input type="hidden" name="stayPlan" value={JSON.stringify(stayPlan)} />
      <input type="hidden" name="includes" value={JSON.stringify(includes)} />

      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}

      <FormSection title="Package details" description="Reusable trip template. Pick it while creating an invoice to fill everything in automatically.">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Package name</span>
            <input
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={255}
              placeholder="Himachal & Amritsar"
              className={fieldClass}
            />
          </label>

          <label>
            <span className="flex items-center justify-between gap-2 text-sm font-medium text-[#EDEDED]">
              Duration
              {durationOverride != null && autoDuration ? (
                <button
                  type="button"
                  onClick={() => setDurationOverride(null)}
                  className="text-xs font-semibold text-[#E20E17] hover:underline"
                >
                  Auto
                </button>
              ) : null}
            </span>
            <input
              name="duration"
              value={duration}
              onChange={(event) => setDurationOverride(event.target.value)}
              maxLength={128}
              placeholder="8 Nights"
              className={fieldClass}
            />
          </label>
        </div>
      </FormSection>

      <FormSection
        title="Stay plan"
        description="Where the travellers stay and for how many nights. Duration updates automatically."
        aside={
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-[#EDEDED]">
            Total {totalNights(stayPlan)}N
          </span>
        }
      >
        <StayPlanEditor rows={stayRows} onChange={setStayRows} />
      </FormSection>

      <FormSection title="Package includes" description="Shown as a bullet list on the invoice.">
        <IncludesEditor rows={includeRows} onChange={setIncludeRows} />
      </FormSection>

      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : mode === "create" ? "Save package" : "Save changes"}
        </Button>
        <Button href="/admin/tour-packages" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
