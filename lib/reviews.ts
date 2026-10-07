import { connection } from "next/server";
import { reviews as staticReviews, type Review } from "@/data/reviews";
import { dbErrorSummary } from "@/lib/json-column";
import { listReviews, seedReviewsIfEmpty, toPublicReview } from "@/lib/reviews-db";

let warned = false;

export async function getReviews(): Promise<Review[]> {
  await connection();

  try {
    await seedReviewsIfEmpty();
    const items = await listReviews();
    return items.map(toPublicReview);
  } catch (error) {
    if (!warned) {
      console.warn("[reviews] MySQL is unavailable, using static reviews:", dbErrorSummary(error));
      warned = true;
    }
    return staticReviews;
  }
}
