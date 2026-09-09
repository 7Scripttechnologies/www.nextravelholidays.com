import { destinationCategories, type DestinationCategory, type Highlight, type ItineraryDay } from "@/data/destinations";
import { slugify } from "@/lib/utils";
import type { PackageInput } from "@/lib/packages-db";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseList(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJson<T>(value: string, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parsePackageForm(formData: FormData): { ok: true; data: PackageInput } | { ok: false; error: string } {
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);
  const image = text(formData, "image");
  const description = text(formData, "description");
  const overview = text(formData, "overview");
  const location = text(formData, "location");
  const price = text(formData, "price");
  const originalPrice = text(formData, "originalPrice") || undefined;
  const duration = text(formData, "duration");
  const category = text(formData, "category") as DestinationCategory;
  const itineraryIntro = text(formData, "itineraryIntro");
  const rating = Number(text(formData, "rating") || "4.8");
  const sortOrder = Number(text(formData, "sortOrder") || "0");
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true" || formData.get("featured") === "1";
  const active = formData.get("active") === "on" || formData.get("active") === "true" || formData.get("active") === "1";

  if (!name) return { ok: false, error: "Package title is required." };
  if (!slug) return { ok: false, error: "A URL slug is required." };
  if (!image) return { ok: false, error: "Cover image is required." };
  if (!description) return { ok: false, error: "Short description is required." };
  if (!overview) return { ok: false, error: "Overview is required." };
  if (!location) return { ok: false, error: "Location is required." };
  if (!price) return { ok: false, error: "Price is required." };
  if (!duration) return { ok: false, error: "Duration is required." };
  if (!destinationCategories.includes(category)) return { ok: false, error: "Choose a valid category." };
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) return { ok: false, error: "Rating must be between 0 and 5." };

  const gallery = parseJson<string[]>(text(formData, "gallery"), []).filter(Boolean);
  const highlights = parseJson<Highlight[]>(text(formData, "highlights"), []).filter(
    (item) => item.title.trim() && item.image.trim(),
  );
  const itinerary = parseJson<ItineraryDay[]>(text(formData, "itinerary"), [])
    .map((day, index) => ({
      day: Number(day.day) || index + 1,
      title: day.title.trim(),
      summary: day.summary.trim(),
      activities: Array.isArray(day.activities)
        ? day.activities.map((activity) => activity.trim()).filter(Boolean)
        : parseList(String(day.activities ?? "")),
    }))
    .filter((day) => day.title);

  const included = parseList(text(formData, "included"));
  const notIncluded = parseList(text(formData, "notIncluded"));

  return {
    ok: true,
    data: {
      slug,
      name,
      image,
      rating,
      description,
      overview,
      location,
      price,
      originalPrice,
      duration,
      category,
      itineraryIntro:
        itineraryIntro ||
        "Take a look at this example travel flow to understand the pace and experiences included in this trip.",
      gallery: gallery.length > 0 ? gallery : [image],
      highlights,
      itinerary,
      included,
      notIncluded,
      featured,
      active,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  };
}
