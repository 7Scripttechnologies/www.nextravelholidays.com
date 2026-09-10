import { siteConfig } from "@/lib/site";

export type SiteContact = {
  phoneDisplay: string;
  phoneTel: string;
  whatsappDigits: string;
  serviceArea: string;
  facebook: string;
  instagram: string;
  x: string;
  youtube: string;
  googleBusiness: string;
};

export const DEFAULT_SERVICE_AREA =
  "Gujarat — Ahmedabad, Surat, Vadodara, Rajkot & more";

export const socialLinkFields = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/yourprofile/" },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/yourhandle" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { key: "googleBusiness", label: "Google Business", placeholder: "https://share.google/..." },
] as const;

export type SocialLinkKey = (typeof socialLinkFields)[number]["key"];

export function defaultSiteContact(): SiteContact {
  return {
    phoneDisplay: siteConfig.phoneDisplay,
    phoneTel: siteConfig.phone,
    whatsappDigits: siteConfig.phone.replace(/\D/g, "") || "918866486477",
    serviceArea: DEFAULT_SERVICE_AREA,
    facebook: siteConfig.socials.facebook,
    instagram: siteConfig.socials.instagram,
    x: siteConfig.socials.x,
    youtube: siteConfig.socials.youtube,
    googleBusiness: siteConfig.socials.googleBusiness,
  };
}

export function normalizeWhatsappDigits(input: string, fallback = "918866486477") {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  if (digits.length >= 12 && digits.startsWith("91")) return digits.slice(0, 12);
  if (digits.length >= 12) return digits;
  return fallback;
}

export function normalizePhone(input: string) {
  const phoneDisplay = input.trim() || defaultSiteContact().phoneDisplay;
  const whatsappDigits = normalizeWhatsappDigits(phoneDisplay);
  return {
    phoneDisplay,
    phoneTel: `+${whatsappDigits}`,
    whatsappDigits,
  };
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
