import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ReviewForm from "@/components/admin/ReviewForm";
import { updateReviewAction } from "@/app/admin/actions";
import { getReviewById } from "@/lib/reviews-db";

export const metadata: Metadata = {
  title: "Edit review — Admin",
  robots: { index: false, follow: false },
};

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId < 1) notFound();

  const record = await getReviewById(reviewId);
  if (!record) notFound();

  return (
    <AdminShell
      title="Edit review"
      description="Changes are saved to MySQL and show up immediately on the website."
      activeNav="reviews"
    >
      <ReviewForm
        mode="edit"
        initial={record}
        action={updateReviewAction.bind(null, record.id)}
      />
    </AdminShell>
  );
}
