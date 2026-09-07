import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import GalleryForm from "@/components/admin/GalleryForm";
import { createGalleryItemAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Add gallery photo — Admin",
  robots: { index: false, follow: false },
};

export default function NewGalleryItemPage() {
  return (
    <AdminShell
      title="Add gallery photo"
      description="This photo will appear on the public gallery page."
      activeNav="gallery"
    >
      <GalleryForm mode="create" action={createGalleryItemAction} />
    </AdminShell>
  );
}
