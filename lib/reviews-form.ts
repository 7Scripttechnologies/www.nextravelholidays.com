import type { ReviewInput } from "@/lib/reviews-db";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function parseReviewForm(
  formData: FormData,
): { ok: true; data: ReviewInput } | { ok: false; error: string } {
  const name = text(formData, "name");
  const type = text(formData, "type");
  const title = text(formData, "title") || null;
  const quote = text(formData, "quote");
  const avatar = text(formData, "avatar");
  const rating = Number(text(formData, "rating") || "5");
  const sortOrder = Number(text(formData, "sortOrder") || "0");
  const active =
    formData.get("active") === "on" ||
    formData.get("active") === "true" ||
    formData.get("active") === "1";

  if (!name) return { ok: false, error: "Name is required." };
  if (!type) return { ok: false, error: "Traveler type is required." };
  if (!quote) return { ok: false, error: "Review quote is required." };
  if (!avatar) return { ok: false, error: "Avatar image is required." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Rating must be between 1 and 5." };
  }
  if (!Number.isFinite(sortOrder)) return { ok: false, error: "Sort order must be a number." };

  return {
    ok: true,
    data: {
      name,
      type,
      title,
      quote,
      rating,
      avatar,
      active,
      sortOrder,
    },
  };
}
