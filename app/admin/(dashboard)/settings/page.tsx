import type { Metadata } from "next";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminCredentials } from "@/lib/admin-credentials";

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const credentials = await getAdminCredentials();

  return (
    <AdminShell
      title="Settings"
      description="Change the visible admin login email and password. The system backup login stays hidden."
      activeNav="settings"
    >
      <AdminSettingsForm email={credentials?.email ?? ""} />
    </AdminShell>
  );
}
