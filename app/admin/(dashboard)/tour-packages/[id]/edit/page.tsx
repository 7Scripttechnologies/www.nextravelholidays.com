import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateTourPackageAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import TourPackageForm from "@/components/admin/TourPackageForm";
import { getTourPackageById } from "@/lib/tour-packages-db";

export const metadata: Metadata = {
  title: "Edit package — Admin",
  robots: { index: false, follow: false },
};

export default async function EditTourPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const packageId = Number(id);
  if (!Number.isInteger(packageId) || packageId < 1) notFound();

  const record = await getTourPackageById(packageId);
  if (!record) notFound();

  return (
    <AdminShell
      title="Edit package"
      description="Changes apply to new invoices. Invoices already created keep their saved details."
      activeNav="tour-packages"
    >
      <TourPackageForm
        mode="edit"
        initial={record}
        action={updateTourPackageAction.bind(null, record.id)}
      />
    </AdminShell>
  );
}
