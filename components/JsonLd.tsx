import { gujaratCities, siteConfig } from "@/lib/site";

/** Organization + TravelAgency + founder Person JSON-LD for SEO / GEO. */
export default function JsonLd() {
  const { founder, socials } = siteConfig;
  const sameAs = [
    socials.facebook,
    socials.instagram,
    socials.x,
    socials.youtube,
    socials.googleBusiness,
  ];

  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${siteConfig.url}/#website`;
  const founderId = `${siteConfig.url}/#founder`;

  const gujaratCityPlaces = gujaratCities.map((city) => ({
    "@type": "City",
    name: city,
    containedInPlace: {
      "@type": "State",
      name: "Gujarat",
      containedInPlace: {
        "@type": "Country",
        name: "India",
      },
    },
  }));

  const graph = [
    {
      "@type": ["TravelAgency", "LocalBusiness", "Organization"],
      "@id": organizationId,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      alternateName: ["NexTravel", "Nextravelholidays"],
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      description: siteConfig.description,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      areaServed: [
        {
          "@type": "State",
          name: "Gujarat",
          containedInPlace: { "@type": "Country", name: "India" },
        },
        { "@type": "Country", name: "India" },
        ...gujaratCityPlaces,
      ],
      address: {
        "@type": "PostalAddress",
        addressRegion: siteConfig.state,
        addressCountry: siteConfig.country,
        addressLocality: "Gujarat",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: siteConfig.phone,
          contactType: "customer service",
          email: siteConfig.email,
          availableLanguage: ["English", "Hindi", "Gujarati"],
          areaServed: ["Gujarat", "IN"],
        },
      ],
      founder: { "@id": founderId },
      employee: { "@id": founderId },
      sameAs,
      knowsAbout: [
        "Holiday packages from Gujarat",
        "Travel agency Gujarat",
        "Domestic tours India",
        "International holiday packages",
        "Honeymoon packages",
        "Family vacation planning",
        "Kashmir Kerala Himachal Goa Bali tours",
        ...gujaratCities.slice(0, 12).map((city) => `Holiday packages from ${city}`),
      ],
      priceRange: "₹₹",
      slogan: siteConfig.tagline,
    },
    {
      "@type": "Person",
      "@id": founderId,
      name: founder.name,
      jobTitle: founder.jobTitle,
      worksFor: { "@id": organizationId },
      sameAs,
      url: `${siteConfig.url}/about`,
      description: `${founder.jobTitle} of ${siteConfig.name} — trusted travel agency serving travellers across Gujarat and India.`,
      homeLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.shortDescription,
      publisher: { "@id": organizationId },
      inLanguage: siteConfig.locale.replace("_", "-"),
      about: { "@id": organizationId },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Is NexTravel Holidays a travel agency in Gujarat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. NexTravel Holidays, led by Founder & CEO Pulkit Karangiya, serves travellers across all major Gujarat cities including Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Bhavnagar, Jamnagar and more — with domestic and international holiday packages.",
          },
        },
        {
          "@type": "Question",
          name: "Which Gujarat cities does NexTravel Holidays serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `NexTravel Holidays serves travellers from ${gujaratCities.slice(0, 16).join(", ")} and other cities across Gujarat for honeymoon, family and group holiday packages.`,
          },
        },
        {
          "@type": "Question",
          name: "Who is the Founder & CEO of NexTravel Holidays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pulkit Karangiya is the Founder & CEO of NexTravel Holidays.",
          },
        },
        {
          "@type": "Question",
          name: "How can I book a holiday package with NexTravel Holidays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Contact NexTravel Holidays on WhatsApp or call ${siteConfig.phoneDisplay}, email ${siteConfig.email}, or use the contact form on nextravelholidays.com. Browse destinations and package details on the website.`,
          },
        },
      ],
    },
  ];

  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
