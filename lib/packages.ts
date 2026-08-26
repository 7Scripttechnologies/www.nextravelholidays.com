import { connection } from "next/server";
import { getStaticDestinations, type Destination, type DestinationCategory } from "@/data/destinations";
import { listPackages, getPackageBySlug as getPackageBySlugFromDb, seedIfEmpty } from "@/lib/packages-db";

let warned = false;

async function readFromMysql() {
  await seedIfEmpty();
  return listPackages();
}

export async function getAllDestinations(): Promise<Destination[]> {
  await connection();

  try {
    const packages = await readFromMysql();
    return packages.filter((destination) => destination.active !== false);
  } catch (error) {
    if (!warned) {
      console.error("[packages] MySQL is unavailable, using static destinations.", error);
      warned = true;
    }
    return getStaticDestinations().filter((destination) => destination.active !== false);
  }
}

export async function getDestination(slug: string): Promise<Destination | undefined> {
  await connection();

  try {
    await seedIfEmpty();
    const record = await getPackageBySlugFromDb(slug);
    if (!record || record.active === false) return undefined;
    return record;
  } catch (error) {
    if (!warned) {
      console.error("[packages] MySQL is unavailable, using static destinations.", error);
      warned = true;
    }
    const destination = getStaticDestinations().find((item) => item.slug === slug);
    if (!destination || destination.active === false) return undefined;
    return destination;
  }
}

export async function getFeaturedDestinations(limit = 6): Promise<Destination[]> {
  const destinations = await getAllDestinations();
  const featured = destinations.filter((destination) => destination.featured !== false);
  return (featured.length > 0 ? featured : destinations).slice(0, limit);
}

export async function getDestinationsByCategory(category: DestinationCategory): Promise<Destination[]> {
  const destinations = await getAllDestinations();
  return destinations.filter((destination) => destination.category === category).slice(0, 6);
}
