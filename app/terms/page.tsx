import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { getTermsPage } from "@/data/terms";

const page = getTermsPage();

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <LegalDocument page={page} />;
}
