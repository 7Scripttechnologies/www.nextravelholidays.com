/** Brand, contact, SEO and GEO defaults for NexTravel Holidays. */

/** Major Gujarat cities — local SEO / GEO coverage across the state. */
export const gujaratCities = [
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Gandhinagar",
  "Anand",
  "Nadiad",
  "Mehsana",
  "Morbi",
  "Bharuch",
  "Navsari",
  "Valsad",
  "Vapi",
  "Porbandar",
  "Surendranagar",
  "Godhra",
  "Palanpur",
  "Bhuj",
  "Gandhidham",
  "Veraval",
  "Botad",
  "Amreli",
  "Dahod",
  "Himatnagar",
  "Patan",
  "Dwarka",
  "Somnath",
  "Modasa",
  "Kalol",
  "Gondal",
  "Jetpur",
] as const;

const gujaratCityKeywords = gujaratCities.flatMap((city) => [
  `travel agency ${city}`,
  `holiday packages ${city}`,
  `tour packages from ${city}`,
]);

export const siteConfig = {
  name: "NexTravel Holidays",
  shortName: "NexTravel",
  legalName: "NexTravel Holidays",
  tagline: "Explore the World",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nextravelholidays.com").replace(/\/$/, ""),
  email: "info@nextravelholidays.com",
  phone: "+918866486477",
  phoneDisplay: "+91 8866486477",
  locale: "en_IN",
  language: "en",
  country: "IN",
  /** ISO 3166-2 for Gujarat */
  region: "IN-GJ",
  state: "Gujarat",
  placename: "Gujarat, India",
  /** Primary GEO focus — Gujarat statewide, then India / Asia */
  areaServed: ["Gujarat", "India", "Asia", ...gujaratCities] as string[],
  founder: {
    name: "Pulkit Karangiya",
    jobTitle: "Founder & CEO",
  },
  description:
    "NexTravel Holidays by Founder & CEO Pulkit Karangiya — top travel agency serving all Gujarat cities including Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar and more. Book Kashmir, Kerala, Himachal, Goa, Bali and custom holiday packages with honest pricing and WhatsApp support.",
  shortDescription:
    "Gujarat’s trusted holiday experts — NexTravel Holidays, Founder & CEO Pulkit Karangiya. Tours from Ahmedabad, Surat, Vadodara, Rajkot and every major Gujarat city.",
  keywords: [
    "NexTravel Holidays",
    "NexTravel",
    "Nextravelholidays",
    "Pulkit Karangiya",
    "Pulkit Karangiya Founder CEO",
    "travel agency Gujarat",
    "best travel agency in Gujarat",
    "holiday packages Gujarat",
    "tour packages Gujarat",
    "Gujarat travel agent",
    "holiday packages from Gujarat",
    "tour operator Gujarat",
    "honeymoon packages Gujarat",
    "family holiday packages Gujarat",
    "holiday packages India",
    "tour packages India",
    "travel agency India",
    "Kashmir tour package",
    "Kerala holiday package",
    "Himachal tour",
    "Manali Kasol package",
    "Goa holiday package",
    "Bali tour package",
    "custom trip planner India",
    "WhatsApp travel booking",
    ...gujaratCityKeywords,
  ],
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://www.instagram.com/nextravel_holidays/",
    x: "https://x.com",
    youtube: "https://youtube.com",
    googleBusiness: "https://share.google/1RfJiM4slqLnDQB89",
  },
  ogImage: "/images/hero-visual.jpg",
  logo: "/images/logo.png",
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}
