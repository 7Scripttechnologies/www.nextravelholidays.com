import ReviewsCarousel from "@/components/ReviewsCarousel";
import { getReviews } from "@/lib/reviews";
import { getSiteImages } from "@/lib/site-images";

export default async function ReviewsSection() {
  const [reviews, images] = await Promise.all([getReviews(), getSiteImages()]);
  if (reviews.length === 0) return null;

  return (
    <ReviewsCarousel
      reviews={reviews}
      photoOne={images.reviews_photo_1?.src ?? "/images/expert-guides.webp"}
      photoTwo={images.reviews_photo_2?.src ?? "/images/manali-kasol-adventure.jpg"}
    />
  );
}
