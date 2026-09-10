import { cache } from "react";
import { connection } from "next/server";
import { defaultSiteImages, type SiteImagesMap } from "@/data/site-images";
import { listSiteImagesFromDb } from "@/lib/site-images-db";

let warned = false;

export const getSiteImages = cache(async (): Promise<SiteImagesMap> => {
  await connection();

  try {
    return await listSiteImagesFromDb();
  } catch (error) {
    if (!warned) {
      console.error("[site-images] MySQL is unavailable, using default image paths.", error);
      warned = true;
    }
    return defaultSiteImages();
  }
});

export async function getSiteImage(key: string) {
  const images = await getSiteImages();
  return images[key] ?? { src: "", caption: "" };
}
