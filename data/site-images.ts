export type SiteImageGroup =
  | "Home"
  | "Reviews"
  | "About"
  | "Destinations"
  | "Gallery"
  | "Contact";

export type SiteImageSlot = {
  key: string;
  group: SiteImageGroup;
  label: string;
  description?: string;
  defaultSrc: string;
  /** Optional caption / location text shown with the image */
  hasCaption?: boolean;
  defaultCaption?: string;
};

/** All marketing images editable from Admin → 7script (/admin/7script). */
export const siteImageSlots: SiteImageSlot[] = [
  {
    key: "home_hero",
    group: "Home",
    label: "Hero visual",
    description: "Main image on the homepage hero.",
    defaultSrc: "/images/hero-visual.jpg",
  },
  {
    key: "home_dream",
    group: "Home",
    label: "Dream destination visual",
    defaultSrc: "/images/dream-visual.jpg",
  },
  {
    key: "home_experience",
    group: "Home",
    label: "Experience section visual",
    defaultSrc: "/images/experience-visual.jpg",
  },
  {
    key: "home_guides",
    group: "Home",
    label: "Expert guides photo",
    description: "Large photo in Meet Our Expert Tour Guides.",
    defaultSrc: "/images/expert-guides.webp",
    hasCaption: true,
    defaultCaption: "Manali, India",
  },
  {
    key: "home_consultation",
    group: "Home",
    label: "Consultation / newsletter background",
    defaultSrc: "/images/newsletter-bg.png",
  },
  {
    key: "home_value_1",
    group: "Home",
    label: "Value card 1 image",
    defaultSrc: "/images/value-choices.png",
  },
  {
    key: "home_value_2",
    group: "Home",
    label: "Value card 2 image",
    defaultSrc: "/images/value-guide.png",
  },
  {
    key: "home_value_3",
    group: "Home",
    label: "Value card 3 image",
    defaultSrc: "/images/value-booking.png",
  },
  {
    key: "reviews_photo_1",
    group: "Reviews",
    label: "Reviews grid photo (top-left)",
    defaultSrc: "/images/expert-guides.webp",
  },
  {
    key: "reviews_photo_2",
    group: "Reviews",
    label: "Reviews grid photo (bottom-right)",
    defaultSrc: "/images/manali-kasol-adventure.jpg",
  },
  {
    key: "about_hero",
    group: "About",
    label: "About page hero",
    defaultSrc: "/images/about-hero.png",
  },
  {
    key: "about_collage_1",
    group: "About",
    label: "About collage 1 (tall left)",
    defaultSrc: "/images/tropical.jpg",
  },
  {
    key: "about_collage_2",
    group: "About",
    label: "About collage 2 (wide top)",
    defaultSrc: "/images/maldives.jpg",
  },
  {
    key: "about_collage_3",
    group: "About",
    label: "About collage 3 (tall mid)",
    defaultSrc: "/images/expert-guides.webp",
  },
  {
    key: "about_collage_4",
    group: "About",
    label: "About collage 4",
    defaultSrc: "/images/manali-kasol-adventure.jpg",
  },
  {
    key: "about_collage_5",
    group: "About",
    label: "About collage 5",
    defaultSrc: "/images/beach.jpg",
  },
  {
    key: "about_collage_6",
    group: "About",
    label: "About collage 6",
    defaultSrc: "/images/kashmir.jpg",
  },
  {
    key: "about_collage_7",
    group: "About",
    label: "About collage 7",
    defaultSrc: "/images/forest.jpg",
  },
  {
    key: "about_founder",
    group: "About",
    label: "Founder photo",
    defaultSrc: "/images/pulkit-11.jpg",
  },
  {
    key: "destinations_hero",
    group: "Destinations",
    label: "Destinations page hero",
    defaultSrc: "/images/maldives.jpg",
  },
  {
    key: "gallery_hero",
    group: "Gallery",
    label: "Gallery page hero",
    defaultSrc: "/images/alps.jpg",
  },
  {
    key: "contact_hero",
    group: "Contact",
    label: "Contact page hero",
    defaultSrc: "/images/newsletter-bg.png",
  },
];

export const siteImageKeys = siteImageSlots.map((slot) => slot.key);

export type SiteImageKey = (typeof siteImageSlots)[number]["key"];

export type SiteImageValue = {
  src: string;
  caption: string;
};

export type SiteImagesMap = Record<string, SiteImageValue>;

export function defaultSiteImages(): SiteImagesMap {
  const map: SiteImagesMap = {};
  for (const slot of siteImageSlots) {
    map[slot.key] = {
      src: slot.defaultSrc,
      caption: slot.defaultCaption ?? "",
    };
  }
  return map;
}

export function siteImageGroups(): SiteImageGroup[] {
  return ["Home", "Reviews", "About", "Destinations", "Gallery", "Contact"];
}
