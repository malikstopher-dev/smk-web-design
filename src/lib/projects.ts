export type ProjectCategory =
  | "restaurant"
  | "business"
  | "construction"
  | "ecommerce"
  | "travel"
  | "webapp"

export interface Project {
  slug: string
  name: string
  category: ProjectCategory
  tags: string[]
  description: string
  image: string
  url?: string
}

export const PROJECT_CATEGORIES: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "restaurant", label: "Restaurants" },
  { id: "business", label: "Home Services" },
  { id: "construction", label: "Construction" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "travel", label: "Travel" },
  { id: "webapp", label: "Web Apps" },
]

export const PROJECTS: Project[] = [
  {
    name: "Salem Home Innovation",
    slug: "salem",
    category: "business",
    tags: ["Home Services", "SEO"],
    description:
      "A complete brand identity and lead-generation website for a growing home services company in Johannesburg, resulting in 40% more phone inquiries within 2 months.",
    image: "/work/salem.jpg",
    url: "https://salemhi.co.za",
  },
  {
    name: "The Boma Cafe",
    slug: "boma",
    category: "restaurant",
    tags: ["Restaurant", "Next.js"],
    description:
      "A visually rich Next.js site capturing the atmosphere of this intimate restaurant; online bookings increased 60% after launch.",
    image: "/work/the-boma-cafe.png",
    url: "https://the-boma-cafe.vercel.app/",
  },
  {
    name: "Selrahc Architects",
    slug: "selrahc",
    category: "construction",
    tags: ["Architecture", "Bilingual"],
    description:
      "A bilingual portfolio site showcasing architectural vision through immersive imagery and clean editorial layouts for an international audience.",
    image: "/work/selrahc.jpg",
    url: "https://www.selrahcarchitects.com/",
  },
  {
    name: "JMOTO Electrical",
    slug: "jmoto",
    category: "business",
    tags: ["Electrical", "SEO"],
    description:
      "A conversion-optimised site with local SEO targeting electrical service searches across Gauteng, driving qualified leads weekly.",
    image: "/work/jmoto.png",
    url: "https://jmoto-website.vercel.app/",
  },
  {
    name: "JKJ SolarTech",
    slug: "jkj",
    category: "business",
    tags: ["Solar / CCTV", "Security"],
    description:
      "Professional site for solar and security solutions, designed to build trust and generate service inquiries from homeowners.",
    image: "/work/jk.jpg",
    url: "https://jkjsolatech.co.za/",
  },
  {
    name: "Cleanisa Solutions",
    slug: "cleanisa",
    category: "business",
    tags: ["Cleaning", "Lead Gen"],
    description:
      "A clean, trust-building lead gen site for cleaning services that converts visitors into booked consultations.",
    image: "/work/cleaningsa.png",
    url: "https://cleanisa-solutions.pages.dev/",
  },
  {
    name: "B.E. Mhlanga Services",
    slug: "bemhlanga",
    category: "business",
    tags: ["Maintenance", "Lead Gen"],
    description:
      "Built for maximum clarity and quick contact, this maintenance-services site turns browsers into booked jobs.",
    image: "/work/bemhlanga.png",
    url: "https://bemhlanga.co.za/",
  },
  {
    name: "Tomy Global Services",
    slug: "tomy-global",
    category: "business",
    tags: ["Business", "Cloudflare"],
    description:
      "A professional business services site deployed on Cloudflare, optimised for speed and global accessibility.",
    image: "/work/tomy-global.png",
    url: "https://tomy-global-services.pages.dev/",
  },
  {
    name: "Chicken Fiestas",
    slug: "fiestas",
    category: "restaurant",
    tags: ["Fast Food", "Hospitality"],
    description:
      "Fast, mobile-first site for a quick-service restaurant, designed to make hunger irresistible and ordering effortless.",
    image: "/work/fiestas-chicken.png",
    url: "https://chicken-fiestas2.malikstopher.workers.dev/",
  },
  {
    name: "Electrolight",
    slug: "electrolight",
    category: "business",
    tags: ["Electrical", "Lead Gen"],
    description:
      "Dependable lead gen site for an electrical services company, built to rank locally and convert on desktop and mobile.",
    image: "/work/electrolight.png",
  },
  {
    name: "UZAPA Construction",
    slug: "uzapa",
    category: "construction",
    tags: ["Construction", "React"],
    description:
      "A React-powered construction portfolio showcasing major projects, built to win contracts through credibility.",
    image: "/work/uzapa.jpg",
    url: "https://uzapardc.pages.dev/",
  },
  {
    name: "Le Centre",
    slug: "le-centre",
    category: "restaurant",
    tags: ["Lounge / Restaurant"],
    description:
      "Sophisticated lounge and restaurant site that captures the venue's premium atmosphere and drives reservations.",
    image: "/work/lecentre.jpg",
    url: "https://lecentre-kin.pages.dev/",
  },
  {
    name: "Chez Gaby",
    slug: "chez-gaby",
    category: "restaurant",
    tags: ["Fine Dining", "FR"],
    description:
      "Luxury French restaurant site in the heart of Kinshasa: reservations, menu and online ordering wrapped in an elegant gold-on-dark experience.",
    image: "/work/chez-gaby.jpg",
    url: "https://chez-gaby.vercel.app/",
  },
  {
    name: "101 On Fraser",
    slug: "fraser",
    category: "restaurant",
    tags: ["Restaurant", "Bookings"],
    description:
      "Restaurant site with integrated booking system, helping this venue fill tables without friction.",
    image: "/work/fraser.jpg",
    url: "https://101onfraser.pages.dev/",
  },
  {
    name: "Cook's Bistro",
    slug: "cooks",
    category: "restaurant",
    tags: ["Fine Dining", "SEO"],
    description:
      "Fine dining website that translates culinary excellence into an elegant digital experience with local SEO.",
    image: "/work/cooks.jpg",
    url: "https://cooks-bistro.pages.dev/",
  },
  {
    name: "Limoncello",
    slug: "limoncello",
    category: "restaurant",
    tags: ["Italian", "Node.js"],
    description:
      "Italian restaurant site with a custom Node.js backend, designed to evoke the warmth of authentic Italian dining.",
    image: "/work/limoncello.jpg",
    url: "https://limoncello.pages.dev/",
  },
  {
    name: "Levante",
    slug: "levante",
    category: "restaurant",
    tags: ["Lebanese", "Branding"],
    description:
      "Lebanese restaurant site with strong branding, bringing the rich flavours and atmosphere of Levantine cuisine online.",
    image: "/work/levante.jpg",
    url: "https://levante-kin.pages.dev/",
  },
  {
    name: "La Dolce Vita",
    slug: "dolcevita",
    category: "restaurant",
    tags: ["Italian", "Pizza"],
    description:
      "Pizzeria site that captures the joy of authentic Italian pizza, built to drive takeaway and delivery orders.",
    image: "/work/dolcevita.jpg",
    url: "https://ladolcevita-kin.pages.dev/",
  },
  {
    name: "Penzura",
    slug: "penzura",
    category: "webapp",
    tags: ["Web App", "React"],
    description:
      "A full-featured web application with React, designed for productivity and clean user interactions.",
    image: "/work/penzura.jpg",
    url: "https://penzura.pages.dev/",
  },
  {
    name: "Babooshka Catering",
    slug: "babooshka",
    category: "restaurant",
    tags: ["Catering", "Branding"],
    description:
      "A brand-rich catering site with mouth-watering food presentation, driving event booking inquiries.",
    image: "/work/chefsbuxaba.png",
    url: "https://babooshka-catering.pages.dev/",
  },
  {
    name: "Chefs Buxaba",
    slug: "buxaba",
    category: "restaurant",
    tags: ["Chef / Catering", "Branding"],
    description:
      "Chef portfolio site blending culinary artistry with premium design to attract high-end catering clients.",
    image: "/work/chefsbuxaba.png",
  },
  {
    name: "Marché LT Eben-Ezer",
    slug: "marche",
    category: "ecommerce",
    tags: ["E-Commerce", "Bilingual"],
    description:
      "Bilingual e-commerce site connecting customers with products across DRC, built for speed and mobile shopping.",
    image: "/work/marche.jpg",
    url: "https://marchelteben-ezer.com",
  },
]

export const FEATURED_PROJECTS = [
  "The Boma Cafe",
  "Salem Home Innovation",
  "Tomy Global Services",
  "Le Centre",
]
  .map((n) => PROJECTS.find((p) => p.name === n))
  .filter((p): p is Project => Boolean(p))
