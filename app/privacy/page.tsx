import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { getPrivacyPage } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPrivacyPage();
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/privacy" },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const page = await getPrivacyPage();
  return <LegalDocument page={page} />;
}
