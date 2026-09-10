export interface GuideFeature {
  title: string;
  description: string;
  icon: "expertise" | "passion" | "dedication";
}

export const guideFeatures: GuideFeature[] = [
  {
    title: "Expertise",
    description:
      "Our guides are experts in their fields, ensuring in-depth knowledge and insights into every destination.",
    icon: "expertise",
  },
  {
    title: "Passion",
    description:
      "They are passionate about travel, culture, and history, making your journey engaging and captivating.",
    icon: "passion",
  },
  {
    title: "Dedication",
    description:
      "Our guides are dedicated to providing exceptional service and ensuring your travel memories are truly unforgettable.",
    icon: "dedication",
  },
];
