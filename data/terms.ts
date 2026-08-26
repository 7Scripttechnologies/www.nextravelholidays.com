export interface LegalSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LegalPage {
  title: string;
  description: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  contactNote: string;
}

export const termsPage: LegalPage = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using NexTravel Holidays services and booking packages.",
  lastUpdated: "25 August 2026",
  intro:
    "Welcome to NexTravel Holidays. These Terms & Conditions (“Terms”) apply to your use of our website, WhatsApp enquiries, and all holiday packages, tours, and travel services arranged by NexTravel Holidays. By browsing our website, submitting an enquiry, making a payment, or confirming a booking, you agree to these Terms.",
  sections: [
    {
      title: "1. About NexTravel Holidays",
      paragraphs: [
        "NexTravel Holidays is a travel planning and holiday package provider. We design and coordinate domestic and international trips, including hotels, transfers, sightseeing, and related arrangements, through our partners and suppliers.",
        "Our contact details: Email — info@nextravelholidays.com | Phone / WhatsApp — +91 8866486477.",
      ],
    },
    {
      title: "2. Website Use",
      paragraphs: [
        "Content on this website (package names, prices, itineraries, photos, and descriptions) is for general information and may change without notice. Images are illustrative and may not always represent the exact hotel room, vehicle, or view assigned on your trip.",
        "You agree not to misuse the website, attempt unauthorized access, or use our content for commercial purposes without written permission.",
      ],
    },
    {
      title: "3. Enquiries & Bookings",
      paragraphs: [
        "Submitting an enquiry (website form, WhatsApp, phone, or email) does not confirm a booking. A booking is confirmed only when:",
      ],
      bullets: [
        "We share a written package confirmation (email or WhatsApp), and",
        "You pay the required advance / booking amount as stated in that confirmation.",
      ],
    },
    {
      title: "4. Prices & Inclusions",
      paragraphs: [
        "Package prices shown online are indicative and may vary based on travel dates, group size, room category, season, festivals, and supplier availability.",
        "Final price, inclusions, exclusions, and payment schedule will be clearly mentioned in your quotation / confirmation. Anything not listed as included is considered excluded (for example: personal expenses, tips, entry fees not mentioned, meals not listed, travel insurance, visa fees).",
      ],
    },
    {
      title: "5. Payments",
      paragraphs: [
        "Payments may be collected via UPI, bank transfer, or other methods shared by our team. Please pay only to official NexTravel Holidays account details provided in writing.",
        "Failure to pay the balance by the due date may lead to cancellation of hotels or services. In such cases, cancellation charges may apply as per supplier rules, and any advance already paid may be adjusted against those charges.",
      ],
    },
    {
      title: "6. Documents & Traveler Details",
      paragraphs: [
        "You must provide accurate names, ages, contact numbers, and ID details matching your travel documents. Any mismatch may cause issues with hotel check-in, transport, or tickets, and NexTravel Holidays will not be responsible for resulting costs.",
        "For destinations requiring passport, visa, permits, or health documents, it is your responsibility to arrange valid documents on time, unless we have expressly included that service in writing.",
      ],
    },
    {
      title: "7. Cancellations by the Traveler",
      paragraphs: [
        "If you cancel a confirmed booking, cancellation charges depend on how close the travel date is and on hotel / transport / activity supplier policies. Typical industry practice (subject to your package confirmation) may include:",
      ],
      bullets: [
        "Cancellation well in advance: partial refund after deducting admin / supplier fees",
        "Cancellation closer to travel date: higher deduction or limited refund",
        "No-show or same-day cancellation: often non-refundable",
      ],
    },
    {
      title: "8. Changes & Cancellations by NexTravel / Suppliers",
      paragraphs: [
        "We may change hotels, transport, timing, or sightseeing due to weather, road blocks, strikes, political issues, natural events, overbooking, or supplier constraints. We will try to offer a similar alternative of comparable standard.",
        "If a major part of the trip cannot be delivered for reasons beyond our control (force majeure), we will work on the best possible alternative or credit / refund as per recoverable supplier amounts. We are not liable for incidental expenses such as extra hotel nights booked by you independently, meal costs, or missed personal plans.",
      ],
    },
    {
      title: "9. Travel Insurance",
      paragraphs: [
        "We strongly recommend purchasing travel insurance covering medical emergencies, trip cancellation, baggage loss, and delays. Unless clearly included in your package, insurance is not part of our standard offering.",
      ],
    },
    {
      title: "10. Conduct & Safety",
      paragraphs: [
        "Travelers must follow local laws, hotel rules, and guide / driver instructions. NexTravel Holidays may refuse service or remove a traveler from an activity if behavior endangers others or violates rules, without refund for unused services.",
        "Adventure activities (trekking, paragliding, water sports, etc.) carry inherent risk. Participation is at your own risk and subject to operator terms and fitness requirements.",
      ],
    },
    {
      title: "11. Liability",
      paragraphs: [
        "NexTravel Holidays acts as a planner and coordinator. Hotels, airlines, cab operators, and activity providers are independent parties. We are not liable for loss, injury, illness, delay, or damage caused by those third parties, except where required by applicable law or where the issue is directly due to our proven negligence in coordination.",
        "Our maximum liability for any claim related to a booking shall not exceed the total amount paid to NexTravel Holidays for that booking’s affected services.",
      ],
    },
    {
      title: "12. Intellectual Property",
      paragraphs: [
        "All logos, text, graphics, and package content on this website belong to NexTravel Holidays or its licensors. You may not copy or reuse them without prior written consent.",
      ],
    },
    {
      title: "13. Governing Law",
      paragraphs: [
        "These Terms are governed by the laws of India. Any dispute shall first be attempted to be resolved amicably. Subject to that, courts having jurisdiction at our place of business in India shall have exclusive jurisdiction.",
      ],
    },
    {
      title: "14. Updates to These Terms",
      paragraphs: [
        "We may update these Terms from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of our website or services after updates means you accept the revised Terms.",
      ],
    },
  ],
  contactNote:
    "For questions about these Terms & Conditions, email info@nextravelholidays.com or call / WhatsApp +91 8866486477.",
};

export function getTermsPage() {
  return termsPage;
}
