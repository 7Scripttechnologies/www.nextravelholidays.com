import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { getPrivacyPage } from "@/data/privacy";

const page = getPrivacyPage();

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LegalDocument page={page} />;
}
