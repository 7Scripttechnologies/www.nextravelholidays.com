import AdminSessionGuard from "@/components/admin/AdminSessionGuard";
import { adminSessionTiming, getAdminSessionExpiresAt, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const expiresAt = await getAdminSessionExpiresAt();
  const { sessionMs, graceMs } = adminSessionTiming();

  return (
    <>
      {expiresAt ? (
        <AdminSessionGuard expiresAt={expiresAt} sessionMs={sessionMs} graceMs={graceMs} />
      ) : null}
      {children}
    </>
  );
}
