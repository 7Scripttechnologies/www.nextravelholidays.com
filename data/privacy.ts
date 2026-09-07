import type { LegalPage } from "@/data/terms";

export const privacyPage: LegalPage = {
  title: "Privacy Policy",
  description: "How NexTravel Holidays collects, uses, stores and protects your personal information.",
  lastUpdated: "25 August 2026",
  intro:
    "NexTravel Holidays (“we”, “us”, “our”) respects your privacy. This Privacy Policy explains what personal information we collect when you visit our website, enquire about packages, chat with us on WhatsApp, or book a trip — and how we use, share, and protect that information.",
  sections: [
    {
      title: "1. Who We Are",
      paragraphs: [
        "NexTravel Holidays provides holiday packages and travel planning services. For privacy-related requests, contact us at info@nextravelholidays.com or +91 8866486477.",
      ],
    },
    {
      title: "2. Information We Collect",
      paragraphs: [
        "Depending on how you interact with us, we may collect:",
      ],
      bullets: [
        "Identity & contact details: name, phone number, email address, city",
        "Travel details: destination interest, preferred dates, number of travelers, budget range, special requests",
        "Booking details: traveler names, ages, ID information needed for hotels / tickets, payment references",
        "Communication records: WhatsApp / email / call notes related to your enquiry or trip",
        "Technical data: IP address, browser type, device type, pages visited (for site performance and security)",
      ],
    },
    {
      title: "3. How We Collect Information",
      paragraphs: [
        "We collect information when you fill enquiry or booking forms on our website, message us on WhatsApp, call or email us, or share details during trip planning. Some technical data may be collected automatically through cookies or similar technologies when you browse the site.",
      ],
    },
    {
      title: "4. How We Use Your Information",
      paragraphs: [
        "We use your information to:",
      ],
      bullets: [
        "Respond to enquiries and share package options",
        "Prepare quotations, itineraries, and confirmations",
        "Book hotels, transport, activities, and related services",
        "Send trip updates, vouchers, and support messages",
        "Improve our website, offers, and customer experience",
        "Comply with legal, accounting, and dispute-resolution needs",
      ],
    },
    {
      title: "5. WhatsApp & Marketing Communication",
      paragraphs: [
        "If you contact us on WhatsApp or share your number, we may use that channel to reply about your enquiry and booking. We may also share relevant holiday offers from NexTravel Holidays.",
        "You can ask us anytime to stop promotional messages. Operational messages about an active booking may still be necessary to deliver your trip.",
      ],
    },
    {
      title: "6. Sharing Your Information",
      paragraphs: [
        "We do not sell your personal data. We may share only what is needed with:",
      ],
      bullets: [
        "Hotels, resorts, transport operators, and activity partners to fulfill your booking",
        "Payment banks / UPI providers to process transactions",
        "IT / hosting providers who help us run the website securely",
        "Authorities if required by law or to protect rights, safety, or fraud prevention",
      ],
    },
    {
      title: "7. Data Retention",
      paragraphs: [
        "We keep enquiry and booking records for as long as needed to complete your trip, handle follow-ups, meet legal / tax requirements, and resolve disputes. When data is no longer required, we delete or anonymize it where reasonably possible.",
      ],
    },
    {
      title: "8. Data Security",
      paragraphs: [
        "We take reasonable technical and organizational steps to protect personal information against unauthorized access, loss, or misuse. However, no internet transmission or storage system is 100% secure. Please avoid sharing unnecessary sensitive data over public channels.",
      ],
    },
    {
      title: "9. Cookies & Analytics",
      paragraphs: [
        "Our website may use cookies or similar tools to remember preferences and understand how visitors use pages (for example, which destinations are popular). You can block or delete cookies in your browser settings. Some site features may not work fully if cookies are disabled.",
      ],
    },
    {
      title: "10. Your Rights",
      paragraphs: [
        "Subject to applicable law, you may request to:",
      ],
      bullets: [
        "Access the personal data we hold about you",
        "Correct inaccurate details",
        "Ask us to delete data that is no longer needed",
        "Withdraw consent for promotional communication",
      ],
    },
    {
      title: "11. Children’s Privacy",
      paragraphs: [
        "Our services are intended for adults making travel arrangements. If a booking includes children, we collect only details needed for the trip (such as name and age) from the parent or guardian who books with us.",
      ],
    },
    {
      title: "12. Third-Party Links",
      paragraphs: [
        "Our website may link to third-party sites (for example, maps or partner pages). Their privacy practices are their own. Please read their policies before sharing information on those sites.",
      ],
    },
    {
      title: "13. Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy periodically. The “Last updated” date on this page will be revised when changes are published. Continued use of our website or services after an update means you acknowledge the revised policy.",
      ],
    },
  ],
  acknowledgment:
    "By using our website or booking with NexTravel Holidays, you acknowledge that you have read and understood this Privacy Policy.",
  contactNote:
    "For privacy requests or questions, email info@nextravelholidays.com or call / WhatsApp +91 8866486477.",
};

export function getPrivacyPage() {
  return privacyPage;
}
