import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import LegalPageForm from "@/components/admin/LegalPageForm";
import { updateLegalPageAction } from "@/app/admin/actions";
import { getLegalPage } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Edit Terms — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminEditTermsPage() {
  const page = await getLegalPage("terms");

  return (
    <AdminShell
      title="Edit Terms & Conditions"
      description="Changes save to MySQL and show on /terms immediately."
      activeNav="legal"
    >
      <LegalPageForm
        slug="terms"
        initial={page}
        action={updateLegalPageAction.bind(null, "terms")}
      />
    </AdminShell>
  );
}
