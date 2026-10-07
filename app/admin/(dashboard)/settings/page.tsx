import type { Metadata } from "next";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminCredentials } from "@/lib/admin-credentials";

export const metadata: Metadata = {
  title: "Admin login — Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const credentials = await getAdminCredentials();

  return (
    <AdminShell
      title="Admin login"
      description="Change the email and password used to sign in to this admin panel."
      activeNav="settings"
    >
      <AdminSettingsForm email={credentials?.email ?? ""} />
    </AdminShell>
  );
}
