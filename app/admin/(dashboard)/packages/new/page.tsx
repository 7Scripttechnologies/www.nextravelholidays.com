import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import PackageForm from "@/components/admin/PackageForm";
import { createPackageAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "New package — Admin",
  robots: { index: false, follow: false },
};

export default function NewPackagePage() {
  return (
    <AdminShell
      title="New package"
      description="This package will appear as a destination card and as a full tour page on the website."
    >
      <PackageForm mode="create" action={createPackageAction} />
    </AdminShell>
  );
}
