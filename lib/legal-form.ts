import type { LegalPage, LegalSection } from "@/data/terms";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseSectionsJson(raw: string): { ok: true; sections: LegalSection[] } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Sections must be a JSON array." };
    }

    const sections: LegalSection[] = [];
    for (const [index, item] of parsed.entries()) {
      if (!item || typeof item !== "object") {
        return { ok: false, error: `Section ${index + 1} is invalid.` };
      }
      const section = item as Partial<LegalSection>;
      const title = String(section.title ?? "").trim();
      const paragraphs = Array.isArray(section.paragraphs)
        ? section.paragraphs.map((p) => String(p).trim()).filter(Boolean)
        : [];
      const bullets = Array.isArray(section.bullets)
        ? section.bullets.map((b) => String(b).trim()).filter(Boolean)
        : undefined;

      if (!title) return { ok: false, error: `Section ${index + 1} needs a title.` };
      if (paragraphs.length === 0) {
        return { ok: false, error: `Section ${index + 1} needs at least one paragraph.` };
      }

      sections.push({
        title,
        paragraphs,
        ...(bullets && bullets.length > 0 ? { bullets } : {}),
      });
    }

    if (sections.length === 0) {
      return { ok: false, error: "Add at least one section." };
    }

    return { ok: true, sections };
  } catch {
    return { ok: false, error: "Sections JSON is invalid. Check the format and try again." };
  }
}

export function parseLegalForm(
  formData: FormData,
): { ok: true; data: LegalPage } | { ok: false; error: string } {
  const title = text(formData, "title");
  const description = text(formData, "description");
  const lastUpdated = text(formData, "lastUpdated");
  const intro = text(formData, "intro");
  const acknowledgment = text(formData, "acknowledgment") || undefined;
  const contactNote = text(formData, "contactNote");
  const sectionsRaw = String(formData.get("sectionsJson") ?? "");

  if (!title) return { ok: false, error: "Title is required." };
  if (!description) return { ok: false, error: "Description is required." };
  if (!lastUpdated) return { ok: false, error: "Last updated date is required." };
  if (!intro) return { ok: false, error: "Intro is required." };
  if (!contactNote) return { ok: false, error: "Contact note is required." };

  const parsedSections = parseSectionsJson(sectionsRaw);
  if (!parsedSections.ok) return parsedSections;

  return {
    ok: true,
    data: {
      title,
      description,
      lastUpdated,
      intro,
      sections: parsedSections.sections,
      acknowledgment,
      contactNote,
    },
  };
}
