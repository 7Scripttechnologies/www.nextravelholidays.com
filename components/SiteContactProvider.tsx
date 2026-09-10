"use client";

import { createContext, useContext } from "react";
import { defaultSiteContact, type SiteContact } from "@/lib/site-contact";

const SiteContactContext = createContext<SiteContact>(defaultSiteContact());

export function SiteContactProvider({
  value,
  children,
}: {
  value: SiteContact;
  children: React.ReactNode;
}) {
  return <SiteContactContext.Provider value={value}>{children}</SiteContactContext.Provider>;
}

export function useSiteContact() {
  return useContext(SiteContactContext);
}
