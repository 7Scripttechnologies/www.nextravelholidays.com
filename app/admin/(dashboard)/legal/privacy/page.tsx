import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import LegalPageForm from "@/components/admin/LegalPageForm";
import { updateLegalPageAction } from "@/app/admin/actions";
import { getLegalPage } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Edit Privacy — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminEditPrivacyPage() {
  const page = await getLegalPage("privacy");

  return (
    <AdminShell
      title="Edit Privacy Policy"
      description="Changes save to MySQL and show on /privacy immediately."
      activeNav="legal"
    >
      <LegalPageForm
        slug="privacy"
        initial={page}
        action={updateLegalPageAction.bind(null, "privacy")}
      />
    </AdminShell>
  );
}
