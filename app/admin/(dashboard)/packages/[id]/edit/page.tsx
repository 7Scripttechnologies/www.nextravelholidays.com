import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PackageForm from "@/components/admin/PackageForm";
import { updatePackageAction } from "@/app/admin/actions";
import { getPackageById } from "@/lib/packages-db";

export const metadata: Metadata = {
  title: "Edit package — Admin",
  robots: { index: false, follow: false },
};

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const packageId = Number(id);
  if (!Number.isInteger(packageId) || packageId < 1) notFound();

  const record = await getPackageById(packageId);
  if (!record) notFound();

  return (
    <AdminShell
      title={`Edit ${record.name}`}
      description="Changes are saved to MySQL and show up immediately on the website."
    >
      <PackageForm mode="edit" initial={record} action={updatePackageAction.bind(null, record.id)} />
    </AdminShell>
  );
}
