export interface Review {
  id: string;
  name: string;
  type: string;
  title?: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const reviews: Review[] = [
  {
    id: "kelvi",
    name: "Kelvi",
    type: "Adventure Seeker",
    quote:
      "Amazing experience! Our Shimla Kullu Manali trip was perfectly organized. Comfortable hotels, scenic routes and great support from the NexTravel team.",
    rating: 5,
    avatar: "/images/avatar-2.jpg",
  },
  {
    id: "dhruhi",
    name: "Dhruhi Patwa",
    type: "Solo Traveler",
    quote:
      "The team at NexTravel Holidays is very helpful and responsive. My trip felt personal, well planned and completely stress-free. Highly recommended!",
    rating: 5,
    avatar: "/images/avatar-1.jpg",
  },
  {
    id: "jhanvi",
    name: "Jhanvi Vegda",
    type: "Group Traveler",
    title: "An Unforgettable Trip With Friends",
    quote:
      "Best travel partners for our group holiday! The itinerary was balanced with sightseeing and free time. Stays were comfortable, transfers were smooth and everyone in the group had a wonderful experience. Thank you NexTravel Holidays for the beautiful memories.",
    rating: 5,
    avatar: "/images/avatar-3.jpg",
  },
  {
    id: "lubna",
    name: "Lubna Musani",
    type: "Family Traveler",
    title: "Himachal Trip Done Right",
    quote:
      "We booked a Himachal package with NexTravel and everything from hotels to sightseeing was arranged with care. Clear communication, honest pricing and thoughtful planning made this a truly memorable family trip. Will definitely book again.",
    rating: 5,
    avatar: "/images/dream-traveler.jpg",
  },
  {
    id: "aarav",
    name: "Aarav Mehta",
    type: "Honeymoon Traveler",
    title: "Kashmir Felt Magical",
    quote:
      "Our Kashmir honeymoon was planned down to the last detail. Houseboats, shikara rides and snow views — NexTravel made every day feel special without any stress.",
    rating: 5,
    avatar: "/images/hero-traveler.jpg",
  },
  {
    id: "neha",
    name: "Neha Shah",
    type: "Family Traveler",
    quote:
      "We travelled with kids and elderly parents. The pace was comfortable, hotels were clean and the local support was excellent. Truly a worry-free Gujarat family holiday.",
    rating: 5,
    avatar: "/images/experience-traveler.jpg",
  },
  {
    id: "rahul",
    name: "Rahul Joshi",
    type: "Couple Traveler",
    title: "Goa Done Effortlessly",
    quote:
      "From airport pickup to beach stays, everything was smooth. Honest pricing and quick WhatsApp replies made booking with NexTravel Holidays so easy.",
    rating: 5,
    avatar: "/images/avatar-1.jpg",
  },
  {
    id: "priya",
    name: "Priya Desai",
    type: "Solo Traveler",
    quote:
      "As a first-time solo traveler I felt completely safe. The Kerala itinerary was beautiful, guides were friendly and NexTravel checked in throughout the trip.",
    rating: 5,
    avatar: "/images/avatar-3.jpg",
  },
  {
    id: "harsh",
    name: "Harsh Patel",
    type: "Group Traveler",
    title: "Bali With Friends",
    quote:
      "Our Bali group trip was packed with temples, beaches and nightlife — still perfectly balanced. Transfers were on time and the stays looked exactly like the photos.",
    rating: 5,
    avatar: "/images/avatar-2.jpg",
  },
  {
    id: "sanya",
    name: "Sanya Kapoor",
    type: "Adventure Seeker",
    quote:
      "Manali adventure package exceeded expectations. Paragliding, camping vibes and mountain stays — NexTravel Holidays handled every booking flawlessly.",
    rating: 5,
    avatar: "/images/dream-traveler.jpg",
  },
  {
    id: "vivek",
    name: "Vivek Trivedi",
    type: "Business Traveler",
    title: "Dubai In Style",
    quote:
      "Short Dubai getaway planned around my meetings. Seamless hotel upgrades, desert safari and city tour — professional service from start to finish.",
    rating: 5,
    avatar: "/images/hero-traveler.jpg",
  },
  {
    id: "isha",
    name: "Isha Rana",
    type: "Family Traveler",
    quote:
      "Udaipur felt royal! Boats, palaces and a lovely hotel overlooking the lake. NexTravel’s team customized everything around our family’s pace.",
    rating: 5,
    avatar: "/images/experience-traveler.jpg",
  },
];

/** How many review cards are visible at once in the section grid. */
export const REVIEW_SLOT_COUNT = 4;
