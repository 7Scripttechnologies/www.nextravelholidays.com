export const comingSoonPages = [
  { slug: "product", title: "Product" },
] as const;

export type ComingSoonSlug = (typeof comingSoonPages)[number]["slug"];

export function getComingSoonPage(slug: string) {
  return comingSoonPages.find((page) => page.slug === slug);
}
