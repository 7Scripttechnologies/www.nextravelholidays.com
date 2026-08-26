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
];
