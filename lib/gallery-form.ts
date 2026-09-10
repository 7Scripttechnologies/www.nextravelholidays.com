import { galleryAspects, type GalleryAspect } from "@/data/gallery";
import type { GalleryInput } from "@/lib/gallery-db";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function parseGalleryForm(
  formData: FormData,
): { ok: true; data: GalleryInput } | { ok: false; error: string } {
  const src = text(formData, "src");
  const alt = text(formData, "alt");
  const aspect = text(formData, "aspect") as GalleryAspect;
  const sortOrder = Number(text(formData, "sortOrder") || "0");
  const active =
    formData.get("active") === "on" ||
    formData.get("active") === "true" ||
    formData.get("active") === "1";

  if (!src) return { ok: false, error: "Image is required." };
  if (!alt) return { ok: false, error: "Alt text is required." };
  if (!galleryAspects.includes(aspect)) return { ok: false, error: "Choose a valid aspect ratio." };
  if (!Number.isFinite(sortOrder)) return { ok: false, error: "Sort order must be a number." };

  return {
    ok: true,
    data: {
      src,
      alt,
      aspect,
      active,
      sortOrder,
    },
  };
}
