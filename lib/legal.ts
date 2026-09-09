import { cache } from "react";
import { connection } from "next/server";
import { privacyPage } from "@/data/privacy";
import { termsPage, type LegalPage } from "@/data/terms";
import {
  defaultLegalPage,
  getLegalPageBySlug,
  seedLegalPagesIfEmpty,
  type LegalSlug,
} from "@/lib/legal-db";

let warned = false;

async function loadLegalPage(slug: LegalSlug, fallback: LegalPage): Promise<LegalPage> {
  await connection();
  try {
    await seedLegalPagesIfEmpty();
    return (await getLegalPageBySlug(slug)) ?? fallback;
  } catch (error) {
    if (!warned) {
      console.error("[legal] MySQL is unavailable, using static legal pages.", error);
      warned = true;
    }
    return fallback;
  }
}

export const getTermsPage = cache(async () => loadLegalPage("terms", termsPage));
export const getPrivacyPage = cache(async () => loadLegalPage("privacy", privacyPage));

export async function getLegalPage(slug: LegalSlug) {
  return loadLegalPage(slug, defaultLegalPage(slug));
}
