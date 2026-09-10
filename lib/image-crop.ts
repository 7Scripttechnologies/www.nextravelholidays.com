import type { GalleryAspect } from "@/data/gallery";

export type ImageCropSpec = {
  /** Width ÷ height of the frame on the public site. */
  aspect: number;
  /** Short label shown in the crop modal. */
  label: string;
  shape?: "rect" | "round";
};

export const imageCrops = {
  heroVisual: { aspect: 1024 / 919, label: "Home hero visual · 1024×919" },
  dreamVisual: { aspect: 1024 / 831, label: "Dream destination · 1024×831" },
  experienceVisual: { aspect: 1024 / 894, label: "Experience visual · 1024×894" },
  pageHero: { aspect: 16 / 9, label: "Full-page hero · 16:9" },
  guidesPhoto: { aspect: 16 / 11, label: "Expert guides photo · 16:11" },
  banner: { aspect: 16 / 9, label: "Wide banner · 16:9" },
  value1: { aspect: 407 / 305, label: "Value card 1 · 407×305" },
  value2: { aspect: 336 / 314, label: "Value card 2 · 336×314" },
  value3: { aspect: 446 / 344, label: "Value card 3 · 446×344" },
  reviewsPortrait: { aspect: 4 / 5, label: "Reviews photo · 4:5" },
  reviewsWide: { aspect: 16 / 10, label: "Reviews photo · 16:10" },
  collageTall: { aspect: 3 / 4, label: "About collage (tall) · 3:4" },
  collageWide: { aspect: 16 / 11, label: "About collage (wide) · 16:11" },
  collageCard: { aspect: 4 / 3, label: "About collage · 4:3" },
  founder: { aspect: 4 / 5, label: "Founder photo · 4:5" },
  packageCover: { aspect: 16 / 9, label: "Package cover · 16:9" },
  packageGallery: { aspect: 16 / 10, label: "Package gallery · 16:10" },
  packageHighlight: { aspect: 1, label: "Highlight thumbnail · 1:1" },
  reviewAvatar: { aspect: 1, label: "Review avatar · circle", shape: "round" },
  galleryPortrait: { aspect: 3 / 4, label: "Gallery portrait · 3:4" },
  galleryLandscape: { aspect: 16 / 10, label: "Gallery landscape · 16:10" },
  gallerySquare: { aspect: 1, label: "Gallery square · 1:1" },
  galleryWide: { aspect: 21 / 9, label: "Gallery wide · 21:9" },
} satisfies Record<string, ImageCropSpec>;

export function galleryCropSpec(aspect: GalleryAspect): ImageCropSpec {
  if (aspect === "portrait") return imageCrops.galleryPortrait;
  if (aspect === "square") return imageCrops.gallerySquare;
  if (aspect === "wide") return imageCrops.galleryWide;
  return imageCrops.galleryLandscape;
}

const MAX_EDGE = 1600;

type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that image. Try another file."));
    image.src = src;
  });
}

export async function cropImageToFile(
  imageSrc: string,
  pixelCrop: PixelCrop,
  fileName: string,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const sx = Math.max(0, Math.round(pixelCrop.x));
  const sy = Math.max(0, Math.round(pixelCrop.y));
  const sw = Math.min(image.naturalWidth - sx, Math.round(pixelCrop.width));
  const sh = Math.min(image.naturalHeight - sy, Math.round(pixelCrop.height));
  if (sw < 8 || sh < 8) {
    throw new Error("Crop area is too small. Zoom out a little and try again.");
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(sw, sh));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sw * scale));
  canvas.height = Math.max(1, Math.round(sh * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop this image in this browser.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Could not save the cropped image."))),
      "image/jpeg",
      0.9,
    );
  });

  const base = fileName.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-") || "image";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}
