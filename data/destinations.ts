export type DestinationCategory = "City" | "Mountain" | "Beach" | "Nature" | "Other";

export interface Highlight {
  title: string;
  image: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  summary: string;
  activities: string[];
}

export interface Destination {
  id?: number;
  slug: string;
  name: string;
  image: string;
  gallery: string[];
  rating: number;
  description: string;
  overview: string;
  location: string;
  price: string;
  /** Optional MRP / list price shown with strikethrough when higher than offer price. */
  originalPrice?: string;
  duration: string;
  category: DestinationCategory;
  highlights: Highlight[];
  itineraryIntro: string;
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  featured?: boolean;
  active?: boolean;
  sortOrder?: number;
}

const itineraryIntro =
  "Take a look at this example travel flow to understand the pace and experiences included in this trip.";

const included = [
  "Local guide",
  "Accommodation options",
  "Transportation",
  "Entrance tickets",
];

const notIncluded = [
  "Flights",
  "Personal expenses",
  "Travel insurance",
  "Meals not mentioned in the itinerary",
];

export const featuredDestinations: Destination[] = [
  {
    slug: "udaipur-mount-abu",
    name: "Udaipur – Mount Abu",
    image: "/images/expert-house.jpg",
    gallery: ["/images/expert-house.jpg", "/images/seville.jpg", "/images/misty.jpg"],
    rating: 4.8,
    description:
      "Lake palaces in Udaipur and cool hill air in Mount Abu, packed into a short Rajasthan escape.",
    overview:
      "Discover the romance of Udaipur’s lakes and palaces, then drive up to Mount Abu for temples, viewpoints and a cooler hill-station evening. NexTravel keeps the route simple, the stays comfortable and the sightseeing well paced for families and couples.",
    location: "Rajasthan, India",
    price: "₹7,000",
    originalPrice: "₹10,000",
    duration: "3 Days / 2 Nights",
    category: "City",
    highlights: [
      { title: "Boat ride on Lake Pichola", image: "/images/maldives.jpg" },
      { title: "City Palace & old-town lanes", image: "/images/seville.jpg" },
      { title: "Nakki Lake sunset in Mount Abu", image: "/images/misty.jpg" },
      { title: "Dilwara Jain temples", image: "/images/expert-house.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival & First Impressions",
        summary: "Settle into Udaipur and see the city from the water.",
        activities: [
          "Arrival and hotel check-in",
          "City Palace visit",
          "Evening boat ride on Lake Pichola",
        ],
      },
      {
        day: 2,
        title: "Lakes to Hill Station",
        summary: "A last look at Udaipur before the drive to Mount Abu.",
        activities: [
          "Fateh Sagar Lake / local market walk",
          "Drive to Mount Abu",
          "Nakki Lake and sunset viewpoint",
        ],
      },
      {
        day: 3,
        title: "Temples & Departure",
        summary: "Visit Mount Abu’s highlights before you head home.",
        activities: [
          "Dilwara Temples",
          "Guru Shikhar viewpoint (time permitting)",
          "Checkout and departure",
        ],
      },
    ],
    included,
    notIncluded,
  },
  {
    slug: "bali",
    name: "Bali Tour Package",
    image: "/images/bali.jpg",
    gallery: ["/images/bali.jpg", "/images/tropical.jpg", "/images/forest.jpg"],
    rating: 4.8,
    description:
      "Temples, rice terraces, cliff sunsets and beach days across Ubud and the south coast.",
    overview:
      "This Bali tour balances culture and coastline. Start among Ubud’s temples and rice terraces, then shift to the beach for sunsets, cliff temples and free time. NexTravel plans comfortable stays and private transfers so the island feels easy from the first day.",
    location: "Bali, Indonesia",
    price: "₹19,999",
    originalPrice: "₹24,999",
    duration: "8 Days / 7 Nights",
    category: "Nature",
    highlights: [
      { title: "Tegalalang rice terraces", image: "/images/vietnam.jpg" },
      { title: "Ubud temples & jungle valleys", image: "/images/bali.jpg" },
      { title: "Uluwatu cliff sunset", image: "/images/tropical.jpg" },
      { title: "Beach time in the south", image: "/images/beach.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali",
        summary: "Airport pickup and a slow first evening in Ubud.",
        activities: ["Airport transfer", "Hotel check-in", "Evening at leisure"],
      },
      {
        day: 2,
        title: "Ubud Nature & Temples",
        summary: "Classic Ubud landscapes and sacred sites.",
        activities: [
          "Tegalalang Rice Terraces",
          "Tirta Empul or similar temple visit",
          "Tegenungan Waterfall",
        ],
      },
      {
        day: 3,
        title: "Culture in Ubud",
        summary: "Art villages, crafts and a free afternoon in town.",
        activities: [
          "Art village / batik or silver stop",
          "Ubud Palace & market",
          "Optional spa or café time",
        ],
      },
      {
        day: 4,
        title: "Transfer to the Coast",
        summary: "Move south for beaches and sunset views.",
        activities: [
          "Checkout and transfer to Kuta / Seminyak area",
          "Beach walk",
          "Evening at leisure",
        ],
      },
      {
        day: 5,
        title: "Uluwatu & Kecak",
        summary: "Clifftop temple, ocean views and a cultural show.",
        activities: [
          "Uluwatu Temple",
          "Clifftop viewpoint",
          "Kecak dance at sunset (optional)",
        ],
      },
      {
        day: 6,
        title: "Island Day",
        summary: "A full day on the water or at Tanah Lot.",
        activities: [
          "Nusa Penida day trip or Tanah Lot Temple",
          "Coastal photo stops",
          "Return to hotel",
        ],
      },
      {
        day: 7,
        title: "Free Beach Day",
        summary: "Keep it slow — swim, shop or rest.",
        activities: ["Morning at leisure", "Optional water sports", "Beach clubs / shopping"],
      },
      {
        day: 8,
        title: "Departure",
        summary: "One last breakfast, then the airport transfer.",
        activities: ["Checkout", "Airport transfer", "Departure"],
      },
    ],
    included,
    notIncluded,
  },
  {
    slug: "goa",
    name: "Goa Tour Package",
    image: "/images/beach.jpg",
    gallery: ["/images/beach.jpg", "/images/tropical.jpg", "/images/maldives.jpg"],
    rating: 4.8,
    description:
      "Beaches, shacks, heritage churches and nightlife — an easy Goa trip for friends, couples and families.",
    overview:
      "Explore the vibrant beauty of Goa with our specially curated Goa tour package. From relaxing on pristine beaches to enjoying water sports and nightlife, this package is perfect for couples, friends and families. NexTravel keeps the stay comfortable and the itinerary flexible so the trip feels easy from arrival to departure.",
    location: "Goa, India",
    price: "₹8,500",
    originalPrice: "₹12,000",
    duration: "3–5 Days",
    category: "Beach",
    highlights: [
      { title: "Enjoy Goa nightlife & beach parties", image: "/images/tokyo.jpg" },
      { title: "Taste authentic Goan cuisine", image: "/images/bangkok.jpg" },
      { title: "Visit churches & heritage sites", image: "/images/seville.jpg" },
      { title: "Visit famous beaches like Baga", image: "/images/beach.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival & First Impressions",
        summary: "Ease into Goa with a warm welcome and time to settle in.",
        activities: [
          "Arrival & hotel check-in",
          "Relax at the beach",
          "Evening leisure / beach walk",
        ],
      },
      {
        day: 2,
        title: "Iconic Beaches & Landmarks",
        summary: "See North Goa’s best-known shoreline and viewpoints.",
        activities: [
          "Baga Beach",
          "Calangute Beach",
          "Anjuna Beach",
          "Fort Aguada",
          "Optional water sports",
        ],
      },
      {
        day: 3,
        title: "Heritage, Flavours & Nightlife",
        summary: "Churches, Goan food and an optional night out.",
        activities: [
          "Old Goa churches (Basilica of Bom Jesus / Se Cathedral)",
          "Local market or spice stop",
          "Authentic Goan lunch",
          "Optional beach shack dinner or nightlife",
        ],
      },
      {
        day: 4,
        title: "Free Time & Departure",
        summary: "Take the morning at your own pace before heading home.",
        activities: [
          "Souvenir shopping",
          "Last stroll on the beach",
          "Airport transfer & departure",
        ],
      },
    ],
    included,
    notIncluded,
  },
  {
    slug: "kerala",
    name: "Kerala Tour Package",
    image: "/images/kerala.jpg",
    gallery: ["/images/kerala.jpg", "/images/forest.jpg", "/images/misty.jpg"],
    rating: 4.8,
    description:
      "Tea hills, wildlife, backwaters and a houseboat night — Kerala at an unhurried pace.",
    overview:
      "Travel through Kerala’s most loved landscapes: Cochin’s harbour streets, Munnar’s tea gardens, Thekkady’s spice hills and a slow night on the backwaters. NexTravel handles hotels, transfers and the houseboat so you can focus on the views.",
    location: "Kerala, India",
    price: "₹19,999",
    originalPrice: "₹24,999",
    duration: "8 Days / 7 Nights",
    category: "Nature",
    highlights: [
      { title: "Munnar tea gardens", image: "/images/vietnam.jpg" },
      { title: "Periyar wildlife & spice hills", image: "/images/forest.jpg" },
      { title: "Alleppey backwater cruise", image: "/images/kerala.jpg" },
      { title: "Fort Kochi heritage walk", image: "/images/seville.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Cochin",
        summary: "Harbour air and a first evening in Fort Kochi.",
        activities: ["Airport / station pickup", "Hotel check-in", "Chinese fishing nets at sunset"],
      },
      {
        day: 2,
        title: "Fort Kochi Heritage",
        summary: "Churches, spice streets and colonial lanes.",
        activities: [
          "St. Francis Church & Santa Cruz Basilica",
          "Jew Town / spice market",
          "Optional Kathakali show",
        ],
      },
      {
        day: 3,
        title: "Cochin to Munnar",
        summary: "Climb into tea country with waterfall stops.",
        activities: ["Scenic drive to Munnar", "Cheeyappara / Valara waterfalls", "Hotel check-in"],
      },
      {
        day: 4,
        title: "Munnar Sightseeing",
        summary: "Tea estates, viewpoints and cool hill air.",
        activities: ["Tea Museum / estate walk", "Mattupetty Dam", "Echo Point & Eravikulam (seasonal)"],
      },
      {
        day: 5,
        title: "Munnar to Thekkady",
        summary: "Spice country and an evening by Periyar.",
        activities: ["Drive to Thekkady", "Spice plantation visit", "Optional kathakali / kalaripayattu"],
      },
      {
        day: 6,
        title: "Periyar & Backwaters",
        summary: "A morning in the sanctuary, then the houseboat.",
        activities: [
          "Periyar boat safari (shared)",
          "Transfer to Alleppey",
          "Overnight houseboat check-in",
        ],
      },
      {
        day: 7,
        title: "Backwaters to Coast",
        summary: "Village canals in the morning, beach air by evening.",
        activities: ["Houseboat cruise & village views", "Disembark after lunch", "Transfer to Kochi / coastal hotel"],
      },
      {
        day: 8,
        title: "Departure",
        summary: "Checkout and onward transfer.",
        activities: ["Breakfast and checkout", "Airport / station drop", "Departure"],
      },
    ],
    included: [...included, "Houseboat stay with meals on board"],
    notIncluded,
  },
  {
    slug: "kashmir",
    name: "Kashmir Tour Package",
    image: "/images/kashmir.jpg",
    gallery: ["/images/kashmir.jpg", "/images/alps.jpg", "/images/misty.jpg"],
    rating: 4.8,
    description:
      "Dal Lake, Gulmarg meadows, Pahalgam valleys and Sonamarg — a full Kashmir circuit.",
    overview:
      "See Kashmir in a well-paced loop: a houseboat or lake-facing stay in Srinagar, snow or meadows in Gulmarg, the Lidder valley in Pahalgam and the high road to Sonamarg. NexTravel arranges hotels, a local driver-guide and the classic sightseeing stops.",
    location: "Jammu & Kashmir, India",
    price: "₹22,999",
    originalPrice: "₹28,999",
    duration: "9 Days / 8 Nights",
    category: "Mountain",
    highlights: [
      { title: "Shikara ride on Dal Lake", image: "/images/kashmir.jpg" },
      { title: "Gulmarg gondola meadows", image: "/images/alps.jpg" },
      { title: "Pahalgam valley walks", image: "/images/forest.jpg" },
      { title: "Sonamarg glacier views", image: "/images/iceland.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar",
        summary: "Lake views and a gentle first evening.",
        activities: ["Airport pickup", "Hotel or houseboat check-in", "Shikara ride on Dal Lake"],
      },
      {
        day: 2,
        title: "Srinagar City",
        summary: "Mughal gardens and old-town crafts.",
        activities: ["Nishat & Shalimar gardens", "Shankaracharya Temple (optional)", "Local craft / market stop"],
      },
      {
        day: 3,
        title: "Srinagar to Gulmarg",
        summary: "Drive into meadow country.",
        activities: ["Scenic transfer to Gulmarg", "Hotel check-in", "Evening at leisure"],
      },
      {
        day: 4,
        title: "Gulmarg Gondola",
        summary: "High meadows, snow or alpine views depending on season.",
        activities: ["Gondola ride (phase as available)", "Photo stops", "Optional snow activities"],
      },
      {
        day: 5,
        title: "Gulmarg to Pahalgam",
        summary: "Change valleys and settle by the Lidder.",
        activities: ["Drive to Pahalgam", "Hotel check-in", "River-side walk"],
      },
      {
        day: 6,
        title: "Pahalgam Valleys",
        summary: "Betaab, Aru or Chandanwari as weather allows.",
        activities: ["Betaab Valley", "Aru Valley or Chandanwari", "Optional pony ride"],
      },
      {
        day: 7,
        title: "Pahalgam to Sonamarg",
        summary: "The golden meadow and high-mountain air.",
        activities: ["Drive to Sonamarg", "Thajiwas glacier viewpoint (seasonal)", "Hotel check-in"],
      },
      {
        day: 8,
        title: "Return to Srinagar",
        summary: "A last night by the lake.",
        activities: ["Leisure morning in Sonamarg", "Drive back to Srinagar", "Optional floating market / gardens"],
      },
      {
        day: 9,
        title: "Departure",
        summary: "Checkout and airport transfer.",
        activities: ["Breakfast", "Airport drop", "Departure"],
      },
    ],
    included,
    notIncluded,
  },
  {
    slug: "manali-kasol-adventure",
    name: "Manali – Kasol Adventure Camp",
    image: "/images/manali-kasol-adventure.jpg",
    gallery: ["/images/manali-kasol-adventure.jpg", "/images/alps.jpg", "/images/forest.jpg"],
    rating: 4.8,
    description:
      "Campfire nights, Solang thrills and Parvati valley days between Manali and Kasol.",
    overview:
      "An adventure-leaning Himachal trip: Manali for mountains and Solang, then Kasol for the Parvati valley, riverside cafés and optional treks. NexTravel sets up camp or hotel stays, local transport and a pace that still leaves room to wander.",
    location: "Himachal Pradesh, India",
    price: "₹9,499",
    originalPrice: "₹13,999",
    duration: "8 Days / 7 Nights",
    category: "Mountain",
    highlights: [
      { title: "Solang Valley adventure", image: "/images/alps.jpg" },
      { title: "Camp nights under the stars", image: "/images/manali-kasol-adventure.jpg" },
      { title: "Kasol riverside cafés", image: "/images/forest.jpg" },
      { title: "Manikaran hot springs", image: "/images/iceland.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Manali",
        summary: "Reach camp or hotel and ease into the mountains.",
        activities: ["Pickup from Manali bus stand", "Camp / hotel check-in", "Bonfire (seasonal)"],
      },
      {
        day: 2,
        title: "Manali Local",
        summary: "Temples, mall road and old Manali lanes.",
        activities: ["Hadimba Temple", "Mall Road", "Old Manali cafés"],
      },
      {
        day: 3,
        title: "Solang Valley",
        summary: "A full adventure day above Manali.",
        activities: ["Solang Valley", "Optional paragliding / zorbing", "Photo stops"],
      },
      {
        day: 4,
        title: "Manali to Kasol",
        summary: "Follow the Beas into the Parvati valley.",
        activities: ["Scenic drive to Kasol", "Hotel / camp check-in", "Riverside evening"],
      },
      {
        day: 5,
        title: "Kasol & Manikaran",
        summary: "Hot springs, gurudwara langar and valley views.",
        activities: ["Manikaran Sahib", "Hot springs", "Kasol market & cafés"],
      },
      {
        day: 6,
        title: "Valley Exploration",
        summary: "Tosh, Chalal or a short trek — pick the energy of the group.",
        activities: ["Chalal village walk or Tosh", "Optional Kheerganga day trek", "Campfire night"],
      },
      {
        day: 7,
        title: "Leisure in the Hills",
        summary: "A buffer day for weather, rest or extra adventure.",
        activities: ["Free morning", "Optional waterfall / café hop", "Group dinner"],
      },
      {
        day: 8,
        title: "Departure",
        summary: "Checkout and drop to Bhuntar / Manali.",
        activities: ["Breakfast", "Transfer", "Departure"],
      },
    ],
    included: [...included, "Camp / hotel stay as per plan", "Bonfire (seasonal)"],
    notIncluded,
  },
  {
    slug: "kullu-manali-kasol-honeymoon",
    name: "Kullu Manali Kasol Honeymoon Package",
    image: "/images/kullu-manali-kasol-honeymoon.jpg",
    gallery: ["/images/kullu-manali-kasol-honeymoon.jpg", "/images/forest.jpg", "/images/alps.jpg"],
    rating: 4.8,
    description:
      "A private, slower Himachal honeymoon through Kullu, Manali and Kasol.",
    overview:
      "Built for couples: comfortable rooms, scenic drives and unhurried sightseeing from Kullu to Manali and into Kasol. Expect river views, a candlelight evening, and enough free time to enjoy the trip together. NexTravel handles stays and transfers end to end.",
    location: "Himachal Pradesh, India",
    price: "₹11,500",
    originalPrice: "₹15,999",
    duration: "8 Days / 7 Nights",
    category: "Mountain",
    highlights: [
      { title: "Private couple-friendly stays", image: "/images/kullu-manali-kasol-honeymoon.jpg" },
      { title: "Solang & mountain viewpoints", image: "/images/alps.jpg" },
      { title: "Kasol riverside evenings", image: "/images/forest.jpg" },
      { title: "Candlelight dinner night", image: "/images/tokyo.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Manali",
        summary: "A quiet first evening after the journey.",
        activities: ["Pickup", "Hotel check-in", "Mall Road stroll"],
      },
      {
        day: 2,
        title: "Manali Together",
        summary: "Temples, cafés and old Manali at a couple’s pace.",
        activities: ["Hadimba Temple", "Club House / Vashisht (optional)", "Old Manali"],
      },
      {
        day: 3,
        title: "Solang Valley",
        summary: "Snow or meadows, photos and optional adventure.",
        activities: ["Solang Valley", "Optional cable car", "Evening at leisure"],
      },
      {
        day: 4,
        title: "Kullu Valley",
        summary: "River, shawls and a slower scenic day.",
        activities: ["Kullu sightseeing", "River rafting (seasonal, optional)", "Local market"],
      },
      {
        day: 5,
        title: "Drive to Kasol",
        summary: "Change the view to the Parvati river.",
        activities: ["Transfer to Kasol", "Hotel check-in", "Riverside walk"],
      },
      {
        day: 6,
        title: "Kasol & Manikaran",
        summary: "Hot springs and a private dinner night.",
        activities: ["Manikaran Sahib", "Village café time", "Candlelight dinner"],
      },
      {
        day: 7,
        title: "Free Couple’s Day",
        summary: "Sleep in, walk, or take a short valley outing.",
        activities: ["Leisure morning", "Optional Chalal walk", "Sunset viewpoint"],
      },
      {
        day: 8,
        title: "Departure",
        summary: "Checkout and onward transfer.",
        activities: ["Breakfast", "Drop to Bhuntar / Manali", "Departure"],
      },
    ],
    included: [...included, "Candlelight dinner (once)"],
    notIncluded,
  },
  {
    slug: "shimla-manali-honeymoon",
    name: "Shimla – Manali Honeymoon Package",
    image: "/images/forest.jpg",
    gallery: ["/images/forest.jpg", "/images/misty.jpg", "/images/banff.jpg"],
    rating: 4.8,
    description:
      "Colonial Shimla and snowy Manali — a classic north-India honeymoon circuit.",
    overview:
      "Start on Shimla’s Mall Road, then cross into Kullu-Manali for mountains, Solang and couple-friendly evenings. The route is classic, the stays are chosen for comfort, and the days stay light enough to enjoy together.",
    location: "Himachal Pradesh, India",
    price: "₹16,000",
    originalPrice: "₹19,999",
    duration: "8 Days / 7 Nights",
    category: "Mountain",
    highlights: [
      { title: "Shimla Mall Road & Ridge", image: "/images/seville.jpg" },
      { title: "Kufri hill views", image: "/images/misty.jpg" },
      { title: "Manali & Solang Valley", image: "/images/alps.jpg" },
      { title: "Honeymoon dinner night", image: "/images/tokyo.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Shimla",
        summary: "Check in and walk the Ridge at dusk.",
        activities: ["Pickup from Chandigarh / Shimla", "Hotel check-in", "Mall Road & Ridge"],
      },
      {
        day: 2,
        title: "Shimla & Kufri",
        summary: "Hill viewpoints and a toy-train town atmosphere.",
        activities: ["Kufri sightseeing", "Christ Church / Scandal Point", "Evening on the Mall"],
      },
      {
        day: 3,
        title: "Shimla Leisure",
        summary: "A buffer day for weather or extra rest.",
        activities: ["Jakhu Temple (optional)", "Café time", "Local shopping"],
      },
      {
        day: 4,
        title: "Shimla to Manali",
        summary: "A long, scenic Himalayan drive.",
        activities: ["Checkout", "Drive via Kullu valley", "Manali hotel check-in"],
      },
      {
        day: 5,
        title: "Manali Local",
        summary: "Temples, old town and a private evening.",
        activities: ["Hadimba Temple", "Old Manali", "Honeymoon dinner"],
      },
      {
        day: 6,
        title: "Solang Valley",
        summary: "The classic Manali adventure day.",
        activities: ["Solang Valley", "Optional adventure sports", "Photo stops"],
      },
      {
        day: 7,
        title: "Atal Tunnel / Rohtang (seasonal)",
        summary: "High-road views if the route is open.",
        activities: ["Atal Tunnel / Sissu or Rohtang (permits & weather)", "Free evening in Manali"],
      },
      {
        day: 8,
        title: "Departure",
        summary: "Checkout and drop to Manali / Chandigarh.",
        activities: ["Breakfast", "Transfer", "Departure"],
      },
    ],
    included: [...included, "Honeymoon cake / dinner (once)"],
    notIncluded,
  },
  {
    slug: "himachal-amritsar",
    name: "Himachal with Amritsar Tour Package",
    image: "/images/himachal-amritsar.webp",
    gallery: ["/images/himachal-amritsar.webp", "/images/seville.jpg", "/images/alps.jpg"],
    rating: 4.8,
    description:
      "Golden Temple nights in Amritsar, then a full Himachal run through Shimla and Manali.",
    overview:
      "A longer north-India circuit that starts with Amritsar’s Golden Temple and Wagah Border, then continues into Himachal for Shimla and Manali. It is built for families who want culture, hills and enough days to travel without rushing.",
    location: "Punjab & Himachal Pradesh, India",
    price: "₹25,000",
    originalPrice: "₹32,000",
    duration: "11 Days / 10 Nights",
    category: "Other",
    highlights: [
      { title: "Golden Temple, Amritsar", image: "/images/himachal-amritsar.webp" },
      { title: "Wagah Border ceremony", image: "/images/dubai.jpg" },
      { title: "Shimla Mall Road", image: "/images/expert-house.jpg" },
      { title: "Manali & Solang mountains", image: "/images/alps.jpg" },
    ],
    itineraryIntro,
    itinerary: [
      {
        day: 1,
        title: "Arrival in Amritsar",
        summary: "An evening at the Golden Temple.",
        activities: ["Pickup", "Hotel check-in", "Golden Temple night visit"],
      },
      {
        day: 2,
        title: "Amritsar Sightseeing",
        summary: "Partition history, food streets and the border ceremony.",
        activities: [
          "Jallianwala Bagh",
          "Partition Museum (optional)",
          "Wagah Border ceremony",
        ],
      },
      {
        day: 3,
        title: "Amritsar to Shimla",
        summary: "Leave the plains for the hills.",
        activities: ["Checkout", "Drive / train-assist to Shimla", "Hotel check-in"],
      },
      {
        day: 4,
        title: "Shimla Local",
        summary: "Ridge, Mall and colonial landmarks.",
        activities: ["Mall Road & Ridge", "Christ Church", "Evening at leisure"],
      },
      {
        day: 5,
        title: "Kufri",
        summary: "A hill excursion above Shimla.",
        activities: ["Kufri sightseeing", "Optional activities", "Return to Shimla"],
      },
      {
        day: 6,
        title: "Shimla to Manali",
        summary: "The long valley drive.",
        activities: ["Checkout", "Drive via Kullu", "Manali hotel check-in"],
      },
      {
        day: 7,
        title: "Manali Local",
        summary: "Temples and old-town cafés.",
        activities: ["Hadimba Temple", "Mall Road", "Old Manali"],
      },
      {
        day: 8,
        title: "Solang Valley",
        summary: "Adventure and mountain views.",
        activities: ["Solang Valley", "Optional adventure sports", "Photo stops"],
      },
      {
        day: 9,
        title: "Atal Tunnel / High Road",
        summary: "A day trip if weather and permits allow.",
        activities: ["Atal Tunnel / Sissu (seasonal)", "Return to Manali", "Free evening"],
      },
      {
        day: 10,
        title: "Leisure Day",
        summary: "Shopping, rest or a short local outing.",
        activities: ["Free morning", "Optional Vashisht hot springs", "Group dinner"],
      },
      {
        day: 11,
        title: "Departure",
        summary: "Checkout and onward transfer.",
        activities: ["Breakfast", "Drop to Manali / Chandigarh", "Departure"],
      },
    ],
    included,
    notIncluded,
  },
];

export const popularDestinations: Destination[] = featuredDestinations;

export const destinationCategories: DestinationCategory[] = [
  "City",
  "Mountain",
  "Beach",
  "Nature",
  "Other",
];

export function getStaticDestinations(): Destination[] {
  const bySlug = new Map<string, Destination>();
  [...featuredDestinations, ...popularDestinations].forEach((destination) => {
    bySlug.set(destination.slug, destination);
  });
  return [...bySlug.values()];
}
