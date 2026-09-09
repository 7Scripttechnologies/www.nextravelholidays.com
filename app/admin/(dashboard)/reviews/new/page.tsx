import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ReviewForm from "@/components/admin/ReviewForm";
import { createReviewAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Add review — Admin",
  robots: { index: false, follow: false },
};

export default function NewReviewPage() {
  return (
    <AdminShell
      title="Add review"
      description="This review will appear in the rotating homepage and destinations carousel."
      activeNav="reviews"
    >
      <ReviewForm mode="create" action={createReviewAction} />
    </AdminShell>
  );
}
