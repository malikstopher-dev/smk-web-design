export const SITE_URL = "https://www.stopher-malik.co.za"

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function websiteSchema(inLanguage = "en-ZA") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SMK Web Design",
    alternateName: "Stopher Malik Web Design",
    url: SITE_URL,
    description:
      "Web designer in Johannesburg helping businesses in South Africa and beyond get more clients with high-converting websites.",
    inLanguage,
    publisher: { "@type": "Person", name: "Stopher Malik" },
  }
}

export function personSchema(description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Stopher Malik",
    url: SITE_URL,
    image: `${SITE_URL}/stopher-portrait.png`,
    jobTitle: "Web Designer & Full-Stack Developer",
    description:
      description ??
      "Stopher Malik is a professional web designer and developer based in Johannesburg, South Africa. Founder of SMK Web Design, he builds high-converting websites for businesses in South Africa and internationally.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sandton",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    telephone: "+27825100050",
    email: "info@stopher-malik.co.za",
    worksFor: {
      "@type": "Organization",
      name: "SMK Web Design",
      url: SITE_URL,
    },
    knowsAbout: [
      "Web Design",
      "Website Development",
      "SEO",
      "UI/UX Design",
      "React",
      "Next.js",
      "Johannesburg Business Websites",
      "South Africa Digital Marketing",
      "Conversion Optimisation",
      "Local SEO",
    ],
    sameAs: [
      "https://www.instagram.com/stophermalik",
      "https://x.com/stopher_malik",
      "https://www.linkedin.com/in/stophermalik/",
    ],
  }
}

export function localBusinessSchema(description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "SMK Web Design",
    alternateName: "Stopher Malik Web Design",
    url: SITE_URL,
    image: `${SITE_URL}/stopher-portrait.png`,
    telephone: "+27825100050",
    email: "info@stopher-malik.co.za",
    description:
      description ??
      "SMK Web Design is a professional web design studio in Johannesburg, South Africa. We build high-converting, performance-optimised websites that help businesses attract more clients and grow online.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "6 Wroxham Rd, Paulshof",
      addressLocality: "Sandton",
      addressRegion: "Gauteng",
      postalCode: "2191",
      addressCountry: "ZA",
    },
    geo: { "@type": "GeoCoordinates", latitude: -26.05, longitude: 28.05 },
    areaServed: [
      { "@type": "City", name: "Johannesburg" },
      { "@type": "City", name: "Sandton" },
      { "@type": "City", name: "Pretoria" },
      { "@type": "Country", name: "South Africa" },
      { "@type": "Country", name: "Democratic Republic of the Congo" },
      { "@type": "Country", name: "Mozambique" },
      { "@type": "Country", name: "Canada" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    priceRange: "R1500–R9000+",
    currenciesAccepted: "ZAR",
    paymentAccepted: "EFT, SnapScan, Card",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+27825100050",
      contactType: "WhatsApp",
      url: "https://wa.me/27825100050",
    },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
