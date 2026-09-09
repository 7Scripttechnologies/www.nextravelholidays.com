"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import Button from "@/components/Button";
import type { LegalPage, LegalSection } from "@/data/terms";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

type DraftSection = {
  title: string;
  paragraphs: string;
  bullets: string;
};

function toDraft(sections: LegalSection[]): DraftSection[] {
  return sections.map((section) => ({
    title: section.title,
    paragraphs: section.paragraphs.join("\n\n"),
    bullets: (section.bullets ?? []).join("\n"),
  }));
}

function fromDraft(drafts: DraftSection[]): LegalSection[] {
  return drafts
    .map((draft) => {
      const paragraphs = draft.paragraphs
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      const bullets = draft.bullets
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);
      return {
        title: draft.title.trim(),
        paragraphs,
        ...(bullets.length > 0 ? { bullets } : {}),
      };
    })
    .filter((section) => section.title && section.paragraphs.length > 0);
}

interface LegalPageFormProps {
  slug: "terms" | "privacy";
  initial: LegalPage;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function LegalPageForm({ slug, initial, action }: LegalPageFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [sections, setSections] = useState(() => toDraft(initial.sections));

  function updateSection(index: number, patch: Partial<DraftSection>) {
    setSections((current) =>
      current.map((section, i) => (i === index ? { ...section, ...patch } : section)),
    );
  }

  function addSection() {
    setSections((current) => [
      ...current,
      { title: `${current.length + 1}. New section`, paragraphs: "", bullets: "" },
    ]);
  }

  function removeSection(index: number) {
    setSections((current) => current.filter((_, i) => i !== index));
  }

  const sectionsJson = JSON.stringify(fromDraft(sections));

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="sectionsJson" value={sectionsJson} />

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
        <h2 className="text-lg font-extrabold text-[#EDEDED]">Page details</h2>
        <p className="mt-1 text-sm text-muted">Shown on the public legal page and in search results.</p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Title</span>
            <input name="title" defaultValue={initial.title} required className={fieldClass} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">SEO description</span>
            <input
              name="description"
              defaultValue={initial.description}
              required
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Last updated</span>
            <input
              name="lastUpdated"
              defaultValue={initial.lastUpdated}
              required
              placeholder="25 August 2026"
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Intro</span>
            <textarea
              name="intro"
              defaultValue={initial.intro}
              required
              rows={5}
              className={`${fieldClass} resize-y`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Acknowledgment (optional)</span>
            <textarea
              name="acknowledgment"
              defaultValue={initial.acknowledgment ?? ""}
              rows={3}
              className={`${fieldClass} resize-y`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#EDEDED]">Contact note</span>
            <textarea
              name="contactNote"
              defaultValue={initial.contactNote}
              required
              rows={3}
              className={`${fieldClass} resize-y`}
            />
          </label>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#EDEDED]">Sections</h2>
            <p className="mt-1 text-sm text-muted">
              Paragraphs: separate with a blank line. Bullets: one per line.
            </p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-[#EDEDED] transition hover:border-[#E20E17]/50"
          >
            Add section
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.07] bg-black/40 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold tracking-[0.14em] text-[#E20E17] uppercase">
                  Section {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="text-xs font-semibold text-muted transition hover:text-[#E20E17]"
                >
                  Remove
                </button>
              </div>

              <label className="mt-3 block">
                <span className="text-sm font-medium text-[#EDEDED]">Title</span>
                <input
                  value={section.title}
                  onChange={(event) => updateSection(index, { title: event.target.value })}
                  className={fieldClass}
                />
              </label>

              <label className="mt-3 block">
                <span className="text-sm font-medium text-[#EDEDED]">Paragraphs</span>
                <textarea
                  value={section.paragraphs}
                  onChange={(event) => updateSection(index, { paragraphs: event.target.value })}
                  rows={5}
                  className={`${fieldClass} resize-y`}
                />
              </label>

              <label className="mt-3 block">
                <span className="text-sm font-medium text-[#EDEDED]">Bullets (optional)</span>
                <textarea
                  value={section.bullets}
                  onChange={(event) => updateSection(index, { bullets: event.target.value })}
                  rows={4}
                  className={`${fieldClass} resize-y`}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending || sections.length === 0}>
          {pending ? "Saving..." : "Save page"}
        </Button>
        <Button href="/admin/legal" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
