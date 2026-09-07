import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import GalleryForm from "@/components/admin/GalleryForm";
import { updateGalleryItemAction } from "@/app/admin/actions";
import { getGalleryItemById } from "@/lib/gallery-db";

export const metadata: Metadata = {
  title: "Edit gallery photo — Admin",
  robots: { index: false, follow: false },
};

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId) || itemId < 1) notFound();

  const record = await getGalleryItemById(itemId);
  if (!record) notFound();

  return (
    <AdminShell
      title="Edit gallery photo"
      description="Changes are saved to MySQL and show up immediately on the website."
      activeNav="gallery"
    >
      <GalleryForm
        mode="edit"
        initial={record}
        action={updateGalleryItemAction.bind(null, record.id)}
      />
    </AdminShell>
  );
}
