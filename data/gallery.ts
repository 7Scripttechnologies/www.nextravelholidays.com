export type GalleryAspect = "portrait" | "landscape" | "square" | "wide";

export const galleryAspects: GalleryAspect[] = ["portrait", "landscape", "square", "wide"];

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  aspect: GalleryAspect;
}

export const galleryItems: GalleryItem[] = [
  { id: "1", src: "/images/expert-guides.webp", alt: "Paragliding over Himalayan hills", aspect: "portrait" },
  { id: "2", src: "/images/beach.jpg", alt: "Tropical beach shoreline", aspect: "landscape" },
  { id: "3", src: "/images/maldives.jpg", alt: "Maldives turquoise water", aspect: "wide" },
  { id: "4", src: "/images/kashmir.jpg", alt: "Kashmir valley landscape", aspect: "portrait" },
  { id: "5", src: "/images/santorini.jpg", alt: "Santorini coastline", aspect: "landscape" },
  { id: "6", src: "/images/bali.jpg", alt: "Bali tropical scenery", aspect: "square" },
  { id: "7", src: "/images/manali-kasol-adventure.jpg", alt: "Mountain adventure in Manali", aspect: "portrait" },
  { id: "8", src: "/images/paris.jpg", alt: "Paris cityscape", aspect: "landscape" },
  { id: "9", src: "/images/dubai.jpg", alt: "Dubai skyline", aspect: "wide" },
  { id: "10", src: "/images/kullu-manali-kasol-honeymoon.jpg", alt: "Honeymoon in Kullu Manali", aspect: "portrait" },
  { id: "11", src: "/images/kerala.jpg", alt: "Kerala backwaters", aspect: "landscape" },
  { id: "12", src: "/images/tokyo.jpg", alt: "Tokyo city streets", aspect: "square" },
  { id: "13", src: "/images/alps.jpg", alt: "Alpine mountain peaks", aspect: "portrait" },
  { id: "14", src: "/images/himachal-amritsar.webp", alt: "Himachal and Amritsar journey", aspect: "landscape" },
  { id: "15", src: "/images/rome.jpg", alt: "Rome historic streets", aspect: "square" },
  { id: "16", src: "/images/forest.jpg", alt: "Misty forest path", aspect: "portrait" },
  { id: "17", src: "/images/iceland.jpg", alt: "Iceland landscape", aspect: "wide" },
  { id: "18", src: "/images/barcelona.jpg", alt: "Barcelona city view", aspect: "landscape" },
  { id: "19", src: "/images/tropical.jpg", alt: "Tropical paradise", aspect: "portrait" },
  { id: "20", src: "/images/sydney.jpg", alt: "Sydney harbour", aspect: "landscape" },
  { id: "21", src: "/images/banff.jpg", alt: "Banff mountains", aspect: "portrait" },
  { id: "22", src: "/images/misty.jpg", alt: "Misty mountain morning", aspect: "wide" },
  { id: "23", src: "/images/nice-cannes.jpg", alt: "Nice and Cannes coast", aspect: "landscape" },
  { id: "24", src: "/images/vietnam.jpg", alt: "Vietnam scenery", aspect: "square" },
  { id: "25", src: "/images/experience-traveler.jpg", alt: "Traveler experience", aspect: "portrait" },
  { id: "26", src: "/images/dream-traveler.jpg", alt: "Dream destination traveler", aspect: "landscape" },
  { id: "27", src: "/images/bangkok.jpg", alt: "Bangkok city lights", aspect: "square" },
  { id: "28", src: "/images/seville.jpg", alt: "Seville architecture", aspect: "portrait" },
  { id: "29", src: "/images/toronto.jpg", alt: "Toronto skyline", aspect: "landscape" },
  { id: "30", src: "/images/campocodia.jpg", alt: "Campo Codina landscape", aspect: "wide" },
];

export function getGalleryItems() {
  return galleryItems;
}
