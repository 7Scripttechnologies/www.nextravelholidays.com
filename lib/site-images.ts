import { cache } from "react";
import { connection } from "next/server";
import { defaultSiteImages, type SiteImagesMap } from "@/data/site-images";
import { dbErrorSummary } from "@/lib/json-column";
import { listSiteImagesFromDb } from "@/lib/site-images-db";

let warned = false;

export const getSiteImages = cache(async (): Promise<SiteImagesMap> => {
  await connection();

  try {
    return await listSiteImagesFromDb();
  } catch (error) {
    if (!warned) {
      console.warn("[site-images] MySQL is unavailable, using default image paths:", dbErrorSummary(error));
      warned = true;
    }
    return defaultSiteImages();
  }
});

export async function getSiteImage(key: string) {
  const images = await getSiteImages();
  return images[key] ?? { src: "", caption: "" };
}
