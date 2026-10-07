import { cache } from "react";
import { connection } from "next/server";
import { defaultSiteContact, type SiteContact } from "@/lib/site-contact";
import { getSiteContactFromDb } from "@/lib/site-contact-db";
import { dbErrorSummary } from "@/lib/json-column";

let warned = false;

export const getSiteContact = cache(async (): Promise<SiteContact> => {
  await connection();

  try {
    return await getSiteContactFromDb();
  } catch (error) {
    if (!warned) {
      console.warn("[site-contact] MySQL is unavailable, using default contact details:", dbErrorSummary(error));
      warned = true;
    }
    return defaultSiteContact();
  }
});
