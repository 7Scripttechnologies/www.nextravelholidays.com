import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { privacyPage } from "@/data/privacy";
import { termsPage, type LegalPage, type LegalSection } from "@/data/terms";
import { getPool } from "@/lib/db";
import { ensureSchema } from "@/lib/packages-db";

export type LegalSlug = "terms" | "privacy";

interface LegalPageRow extends RowDataPacket {
  slug: string;
  title: string;
  description: string;
  last_updated: string;
  intro: string;
  acknowledgment: string | null;
  contact_note: string;
  sections_json: LegalSection[] | string;
}

const defaults: Record<LegalSlug, LegalPage> = {
  terms: termsPage,
  privacy: privacyPage,
};

function parseSections(raw: LegalSection[] | string): LegalSection[] {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw) as LegalSection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toPage(row: LegalPageRow): LegalPage {
  return {
    title: row.title,
    description: row.description,
    lastUpdated: row.last_updated,
    intro: row.intro,
    sections: parseSections(row.sections_json),
    acknowledgment: row.acknowledgment || undefined,
    contactNote: row.contact_note,
  };
}

export async function getLegalPageBySlug(slug: LegalSlug): Promise<LegalPage | null> {
  await ensureSchema();
  const [rows] = await getPool().query<LegalPageRow[]>(
    "SELECT * FROM legal_pages WHERE slug = ? LIMIT 1",
    [slug],
  );
  const row = rows[0];
  return row ? toPage(row) : null;
}

export async function upsertLegalPage(slug: LegalSlug, page: LegalPage) {
  await ensureSchema();
  await getPool().query<ResultSetHeader>(
    `INSERT INTO legal_pages
      (slug, title, description, last_updated, intro, acknowledgment, contact_note, sections_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      description = VALUES(description),
      last_updated = VALUES(last_updated),
      intro = VALUES(intro),
      acknowledgment = VALUES(acknowledgment),
      contact_note = VALUES(contact_note),
      sections_json = VALUES(sections_json)`,
    [
      slug,
      page.title,
      page.description,
      page.lastUpdated,
      page.intro,
      page.acknowledgment ?? null,
      page.contactNote,
      JSON.stringify(page.sections),
    ],
  );
}

export async function seedLegalPagesIfEmpty() {
  await ensureSchema();
  const pool = getPool();
  let seeded = 0;

  for (const slug of ["terms", "privacy"] as const) {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT slug FROM legal_pages WHERE slug = ? LIMIT 1",
      [slug],
    );
    if (rows.length > 0) continue;
    await upsertLegalPage(slug, defaults[slug]);
    seeded += 1;
  }

  return { seeded };
}

export function defaultLegalPage(slug: LegalSlug): LegalPage {
  return defaults[slug];
}
