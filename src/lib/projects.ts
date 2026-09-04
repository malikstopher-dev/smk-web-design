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
      "A full business website that started generating enquiries from day one. Built for local SEO and client conversion in the Johannesburg home services market.",
    image: "/work/salem.jpg",
    url: "https://salemhi.co.za",
  },
  {
    name: "The Boma Cafe",
    slug: "boma",
    category: "restaurant",
    tags: ["Restaurant", "Next.js"],
    description:
      "Premium restaurant and events website for The Boma Café, showcasing food, venue, gallery, events, and contact/booking flow.",
    image: "/work/the-boma-cafe.png",
    url: "https://the-boma-cafe.vercel.app/",
  },
  {
    name: "Selrahc Architects",
    slug: "selrahc",
    category: "construction",
    tags: ["Architecture", "Bilingual"],
    description:
      "Award-winning architecture studio in Johannesburg specializing in residential design, renovations, and technical documentation.",
    image: "/work/selrahc.jpg",
    url: "https://www.selrahcarchitects.com/",
  },
  {
    name: "JMOTO Electrical",
    slug: "jmoto",
    category: "business",
    tags: ["Electrical", "SEO"],
    description:
      "Professional electrical services website with service presentation, business credibility, and contact flow.",
    image: "/work/jmoto.png",
    url: "https://jmoto-website.vercel.app/",
  },
  {
    name: "JKJ SolarTech",
    slug: "jkj",
    category: "business",
    tags: ["Solar / CCTV", "Security"],
    description:
      "Solar, electrical, CCTV and security services website for clients across South Africa.",
    image: "/work/jk.jpg",
    url: "https://jkjsolatech.co.za/",
  },
  {
    name: "Cleanisa Solutions",
    slug: "cleanisa",
    category: "business",
    tags: ["Cleaning", "Lead Gen"],
    description:
      "Cleaning services website with service cards, trust-building layout, and contact conversion flow.",
    image: "/work/cleaningsa.png",
    url: "https://cleanisa-solutions.pages.dev/",
  },
  {
    name: "B.E. Mhlanga Services",
    slug: "bemhlanga",
    category: "business",
    tags: ["Maintenance", "Lead Gen"],
    description:
      "Business website for maintenance, cleaning, plumbing, electrical, and general service enquiries.",
    image: "/work/bemhlanga.png",
    url: "https://bemhlanga.co.za/",
  },
  {
    name: "Tomy Global Services",
    slug: "tomy-global",
    category: "business",
    tags: ["Business", "Cloudflare"],
    description:
      "Professional business services website with clear service presentation and streamlined contact flow.",
    image: "/work/tomy-global.png",
    url: "https://tomy-global-services.pages.dev/",
  },
  {
    name: "Chicken Fiestas",
    slug: "fiestas",
    category: "restaurant",
    tags: ["Fast Food", "Hospitality"],
    description:
      "A vibrant fast food restaurant website with online ordering, menu showcase, and location finder for customers.",
    image: "/work/fiestas-chicken.png",
    url: "https://chicken-fiestas2.malikstopher.workers.dev/",
  },
  {
    name: "Electrolight",
    slug: "electrolight",
    category: "business",
    tags: ["Electrical", "Lead Gen"],
    description:
      "Electrical services website designed for clear service communication and lead generation.",
    image: "/work/electrolight.png",
  },
  {
    name: "UZAPA Construction",
    slug: "uzapa",
    category: "construction",
    tags: ["Construction", "React"],
    description:
      "A credibility-building website for a DRC-based construction firm. Showcases completed projects and services in French, establishing trust with enterprise clients.",
    image: "/work/uzapa.jpg",
    url: "https://uzapardc.pages.dev/",
  },
  {
    name: "Le Centre",
    slug: "le-centre",
    category: "restaurant",
    tags: ["Lounge / Restaurant"],
    description:
      "Premium restaurant and lounge in Kinshasa. International cuisine, panoramic terrace, and late-night ambiance until 4am.",
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
      "A booking-first restaurant website that made table reservations easier. Elegant design that reflects the dining experience and supports direct bookings.",
    image: "/work/fraser.jpg",
    url: "https://101onfraser.pages.dev/",
  },
  {
    name: "Cook's Bistro",
    slug: "cooks",
    category: "restaurant",
    tags: ["Fine Dining", "SEO"],
    description:
      "Premium Mediterranean restaurant in Kinshasa Mall, Gombe. Elegant design with online reservations and menu showcase.",
    image: "/work/cooks.jpg",
    url: "https://cooks-bistro.pages.dev/",
  },
  {
    name: "Limoncello",
    slug: "limoncello",
    category: "restaurant",
    tags: ["Italian", "Node.js"],
    description:
      "Authentic Italian restaurant in Kinshasa. TripAdvisor #4 in Kinshasa with online ordering and reservation system.",
    image: "/work/limoncello.jpg",
    url: "https://limoncello.pages.dev/",
  },
  {
    name: "Levante",
    slug: "levante",
    category: "restaurant",
    tags: ["Lebanese", "Branding"],
    description:
      "Authentic Lebanese cuisine coming soon to Kinshasa with a new branch opening.",
    image: "/work/levante.jpg",
    url: "https://levante-kin.pages.dev/",
  },
  {
    name: "La Dolce Vita",
    slug: "dolcevita",
    category: "restaurant",
    tags: ["Italian", "Pizza"],
    description:
      "Authentic Italian dining experience in Kinshasa. Wood-fired pizza, fresh pasta, and reservation system.",
    image: "/work/dolcevita.jpg",
    url: "https://ladolcevita-kin.pages.dev/",
  },
  {
    name: "Penzura",
    slug: "penzura",
    category: "webapp",
    tags: ["Web App", "React"],
    description:
      "Premium web application for South Africa's cleaning and hygiene supply sector.",
    image: "/work/penzura.jpg",
    url: "https://penzura.pages.dev/",
  },
  {
    name: "Babooshka Catering",
    slug: "babooshka",
    category: "restaurant",
    tags: ["Catering", "Branding"],
    description:
      "Catering and food-service website with a professional visual presentation and enquiry flow.",
    image: "/work/chefsbuxaba.png",
    url: "https://babooshka-catering.pages.dev/",
  },
  {
    name: "Chefs Buxaba",
    slug: "buxaba",
    category: "restaurant",
    tags: ["Chef / Catering", "Branding"],
    description:
      "Chef and catering website using premium food-service branding and simple enquiry flow.",
    image: "/work/chefsbuxaba.png",
  },
  {
    name: "Marché LT Eben-Ezer",
    slug: "marche",
    category: "ecommerce",
    tags: ["E-Commerce", "Bilingual"],
    description:
      "E-commerce website for an Afro-Caribbean grocery store in Montréal. Bilingual (FR/EN) product catalogue connecting the African diaspora community with familiar foods.",
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
