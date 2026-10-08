"use client";

import { Plus, Trash2 } from "lucide-react";
import type { StayStop } from "@/lib/invoice";
import { cn } from "@/lib/utils";

export const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

export const compactFieldClass =
  "w-full rounded-xl border border-line bg-black px-3 py-2.5 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

const NIGHT_OPTIONS = Array.from({ length: 15 }, (_, index) => index + 1);

export const SUGGESTED_INCLUDES = [
  "One way 3rd AC train",
  "One way Non AC train",
  "Two way Non AC train",
  "Two way 3rd AC train",
  "One way flight",
  "Two way flight",
  "Pickup and Drop",
  "Breakfast and Dinner",
  "All sightseeing",
  "3 Star hotel stay",
  "Private vehicle",
];

// The random prefix keeps keys unique when hot reload resets `keySeed` but existing rows keep their keys.
const keyPrefix = Math.random().toString(36).slice(2, 8);
let keySeed = 0;
export function newRowKey() {
  keySeed += 1;
  return `row-${keyPrefix}-${keySeed}`;
}

export type StayDraft = { key: string; place: string; nights: number };
export type IncludeDraft = { key: string; label: string };

export function toStayDrafts(stayPlan: StayStop[]): StayDraft[] {
  if (stayPlan.length === 0) return [{ key: newRowKey(), place: "", nights: 1 }];
  return stayPlan.map((stop) => ({ key: newRowKey(), place: stop.place, nights: stop.nights }));
}

export function fromStayDrafts(rows: StayDraft[]): StayStop[] {
  return rows
    .map((row) => ({ place: row.place.trim(), nights: row.nights }))
    .filter((stop) => stop.place && stop.nights > 0);
}

export function toIncludeDrafts(includes: string[]): IncludeDraft[] {
  if (includes.length === 0) return [{ key: newRowKey(), label: "" }];
  return includes.map((label) => ({ key: newRowKey(), label }));
}

export function fromIncludeDrafts(rows: IncludeDraft[]): string[] {
  return rows.map((row) => row.label.trim()).filter(Boolean);
}

export function FormSection({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#EDEDED]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SmallButton({
  children,
  onClick,
  tone = "default",
  ariaLabel,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "default" | "danger";
  ariaLabel?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:pointer-events-none disabled:opacity-40",
        tone === "danger"
          ? "border-white/10 text-muted hover:border-[#E20E17]/50 hover:text-[#E20E17]"
          : "border-white/15 text-[#EDEDED] hover:border-[#E20E17]/50",
      )}
    >
      {children}
    </button>
  );
}

export function StayPlanEditor({
  rows,
  onChange,
}: {
  rows: StayDraft[];
  onChange: (rows: StayDraft[]) => void;
}) {
  const update = (key: string, patch: Partial<StayDraft>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  return (
    <div className="space-y-2.5">
      <div className="hidden grid-cols-[minmax(0,1fr)_120px_40px] gap-2.5 px-1 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase sm:grid">
        <span>Place / city</span>
        <span>Nights</span>
        <span />
      </div>
      {rows.map((row, index) => (
        <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_96px_40px] gap-2.5 sm:grid-cols-[minmax(0,1fr)_120px_40px]">
          <input
            value={row.place}
            onChange={(event) => update(row.key, { place: event.target.value })}
            placeholder={["Shimla", "Manali", "Dalhousie", "Amritsar"][index % 4]}
            aria-label={`Stay ${index + 1} place`}
            className={compactFieldClass}
          />
          <select
            value={row.nights}
            onChange={(event) => update(row.key, { nights: Number(event.target.value) })}
            aria-label={`Stay ${index + 1} nights`}
            className={compactFieldClass}
          >
            {NIGHT_OPTIONS.map((nights) => (
              <option key={nights} value={nights}>
                {nights}N
              </option>
            ))}
          </select>
          <SmallButton
            tone="danger"
            ariaLabel={`Remove stay ${index + 1}`}
            disabled={rows.length === 1}
            onClick={() => onChange(rows.filter((item) => item.key !== row.key))}
          >
            <Trash2 className="size-3.5" />
          </SmallButton>
        </div>
      ))}
      <SmallButton onClick={() => onChange([...rows, { key: newRowKey(), place: "", nights: 1 }])}>
        <Plus className="size-3.5" />
        Add stay
      </SmallButton>
    </div>
  );
}

export function IncludesEditor({
  rows,
  onChange,
}: {
  rows: IncludeDraft[];
  onChange: (rows: IncludeDraft[]) => void;
}) {
  const existing = new Set(rows.map((row) => row.label.trim().toLowerCase()));
  const suggestions = SUGGESTED_INCLUDES.filter((item) => !existing.has(item.toLowerCase()));

  const addLabel = (label: string) => {
    const blank = rows.find((row) => !row.label.trim());
    if (blank) {
      onChange(rows.map((row) => (row.key === blank.key ? { ...row, label } : row)));
    } else {
      onChange([...rows, { key: newRowKey(), label }]);
    }
  };

  return (
    <div className="space-y-2.5">
      {rows.map((row, index) => (
        <div key={row.key} className="grid grid-cols-[minmax(0,1fr)_40px] gap-2.5">
          <input
            value={row.label}
            onChange={(event) =>
              onChange(rows.map((item) => (item.key === row.key ? { ...item, label: event.target.value } : item)))
            }
            placeholder="e.g. Breakfast and Dinner"
            aria-label={`Included item ${index + 1}`}
            className={compactFieldClass}
          />
          <SmallButton
            tone="danger"
            ariaLabel={`Remove included item ${index + 1}`}
            disabled={rows.length === 1}
            onClick={() => onChange(rows.filter((item) => item.key !== row.key))}
          >
            <Trash2 className="size-3.5" />
          </SmallButton>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <SmallButton onClick={() => onChange([...rows, { key: newRowKey(), label: "" }])}>
          <Plus className="size-3.5" />
          Add item
        </SmallButton>
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => addLabel(item)}
            className="rounded-full border border-dashed border-white/15 px-3 py-1.5 text-xs text-muted transition hover:border-[#E20E17]/50 hover:text-[#EDEDED]"
          >
            + {item}
          </button>
        ))}
      </div>
    </div>
  );
}
