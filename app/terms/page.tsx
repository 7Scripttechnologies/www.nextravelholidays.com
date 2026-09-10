import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { getTermsPage } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getTermsPage();
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/terms" },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage() {
  const page = await getTermsPage();
  return <LegalDocument page={page} />;
}
