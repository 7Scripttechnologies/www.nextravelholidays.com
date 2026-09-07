import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { closePool, ensureDatabase } from "../lib/db";
import { seedGalleryIfEmpty } from "../lib/gallery-db";
import { ensureSchema, seedIfEmpty } from "../lib/packages-db";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");

  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch {
    console.warn("No .env.local found. Using default MySQL settings.");
  }
}

async function main() {
  loadEnvLocal();
  try {
    await ensureDatabase();
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code !== "ER_ACCESS_DENIED_ERROR") throw error;
    // App users cannot always create databases. Continue if the configured DB is already there.
  }
  await ensureSchema();
  const result = await seedIfEmpty();
  if (result.seeded) {
    console.log(`Seeded ${result.count} packages into MySQL.`);
  } else {
    console.log(`MySQL is ready. Packages in database: ${result.count}.`);
  }

  const gallery = await seedGalleryIfEmpty();
  if (gallery.seeded) {
    console.log(`Seeded ${gallery.count} gallery photos into MySQL.`);
  } else {
    console.log(`Gallery photos in database: ${gallery.count}.`);
  }
  await closePool();
}

main().catch((error) => {
  console.error("Failed to set up MySQL:", error);
  process.exit(1);
});
