import { connection } from "next/server";
import { getGalleryItems as getStaticGalleryItems, type GalleryItem } from "@/data/gallery";
import { listGalleryItems, seedGalleryIfEmpty, toPublicItem } from "@/lib/gallery-db";

let warned = false;

export async function getGalleryItems(): Promise<GalleryItem[]> {
  await connection();

  try {
    await seedGalleryIfEmpty();
    const items = await listGalleryItems();
    return items.map(toPublicItem);
  } catch (error) {
    if (!warned) {
      console.error("[gallery] MySQL is unavailable, using static gallery.", error);
      warned = true;
    }
    return getStaticGalleryItems();
  }
}
