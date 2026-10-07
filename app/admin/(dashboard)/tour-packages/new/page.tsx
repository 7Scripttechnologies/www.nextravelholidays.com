import type { Metadata } from "next";
import { createTourPackageAction } from "@/app/admin/billing-actions";
import AdminShell from "@/components/admin/AdminShell";
import TourPackageForm from "@/components/admin/TourPackageForm";

export const metadata: Metadata = {
  title: "Build package — Admin",
  robots: { index: false, follow: false },
};

export default function NewTourPackagePage() {
  return (
    <AdminShell
      title="Build package"
      description="Set the stay plan and inclusions once, then reuse this package on every invoice."
      activeNav="tour-packages"
    >
      <TourPackageForm mode="create" action={createTourPackageAction} />
    </AdminShell>
  );
}
