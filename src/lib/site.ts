export const SITE = {
  name: "Stopher Malik",
  business: "SMK Web Design",
  role: "Web Designer & Developer",
  tagline: "Website Design. Built to Win Clients.",
  url: "https://www.stopher-malik.co.za",
  location: {
    street: "6 Wroxham Rd, Paulshof",
    city: "Sandton, Johannesburg",
    region: "Gauteng",
    postalCode: "2191",
    country: "ZA",
    lat: -26.05,
    lng: 28.05,
  },
  whatsapp: {
    number: "+27825100050",
    label: "+27 82 510 0050",
    url: "https://wa.me/27825100050",
  },
  phone: "+27825100050",
  email: "info@stopher-malik.co.za",
  hours: "Mon–Fri 08:00–18:00 · Sat 09:00–14:00",
  socials: [
    { name: "Instagram", handle: "@stophermalik", url: "https://www.instagram.com/stophermalik" },
    { name: "X", handle: "@stopher_malik", url: "https://x.com/stopher_malik" },
    { name: "LinkedIn", handle: "/in/stophermalik", url: "https://www.linkedin.com/in/stophermalik/" },
  ],
} as const

export interface ServiceItem {
  slug: string
  title: string
  short: string
  description: string
  points: string[]
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "website-design",
    title: "Website Design",
    short: "Mobile-first, conversion-focused websites built to win clients.",
    description:
      "Professional website design for South African businesses. Mobile-first, conversion-focused websites built to get you more clients: fast to load, easy to update, and designed around your customers.",
    points: ["Custom design, no templates", "Conversion-focused layouts", "Mobile-first responsive build", "Copy structure that sells"],
  },
  {
    slug: "full-stack-development",
    title: "Full-Stack Development",
    short: "React, Next.js and Node.js applications with clean architecture.",
    description:
      "React, Next.js and Node.js web applications built with clean, scalable architecture. From booking systems to e-commerce backends, engineered to grow with your business.",
    points: ["React & Next.js apps", "Node.js APIs & integrations", "PostgreSQL / MongoDB data layers", "TypeScript end-to-end"],
  },
  {
    slug: "seo-performance",
    title: "SEO & Performance",
    short: "Rank on Google and load instantly. Measured, not promised.",
    description:
      "Technical and local SEO baked into every build: semantic markup, structured data, Core Web Vitals tuning, and Google Business Profile setup so nearby customers actually find you.",
    points: ["Local SEO for Gauteng searches", "Structured data / schema", "Core Web Vitals optimisation", "Analytics & Search Console"],
  },
  {
    slug: "cloud-deployment",
    title: "Cloud Deployment",
    short: "Fast, reliable hosting on Cloudflare, Vercel and AWS.",
    description:
      "Deployment and infrastructure that stays fast under real traffic: edge delivery via Cloudflare, CI deploys on Vercel, domains, SSL and monitoring handled end-to-end.",
    points: ["Cloudflare Pages & Workers", "Vercel deployments", "Domains, DNS & SSL", "Uptime monitoring"],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    short: "Interfaces that guide attention and make action obvious.",
    description:
      "Research-driven interface design: clear visual hierarchy, accessible components, and user flows tested against how your customers actually decide.",
    points: ["User flows & wireframes", "Design systems & tokens", "Accessibility (WCAG-minded)", "Prototype validation"],
  },
  {
    slug: "branding-identity",
    title: "Branding & Identity",
    short: "Logos and brand kits that make small business look established.",
    description:
      "Primary logos, variants, colour systems and brand kits: a consistent identity across your website, socials, business cards and Google Business Profile.",
    points: ["Logo + variants", "Colour & type systems", "Business card design", "Social media kit"],
  },
]

export const PRICING_PRICES = ["R1,500–3,000", "R4,000–8,000", "R9,000+"] as const

export interface PricingTier {
  id: string
  eyebrow: string
  price: string
  terms: string
  features: string[]
  bestFor: string
  cta: string
  popular?: boolean
}

export const PRICING: PricingTier[] = [
  {
    id: "starter",
    eyebrow: "Starter Package",
    price: "R1,500–3,000",
    terms: "One-time payment · starts immediately",
    features: [
      "Logo Design (primary + 2 variants)",
      "Business Profile Copywriting",
      "Business Card Design",
      "Google Business Setup",
      "Social Media Guidance",
    ],
    bestFor: "New businesses getting started online",
    cta: "Get Started",
  },
  {
    id: "growth",
    eyebrow: "Business Growth",
    price: "R4,000–8,000",
    terms: "One-time payment · delivery in 7–14 days",
    features: [
      "Professional Logo + Brand Kit",
      "1–3 Page Website",
      "Mobile-Responsive Design",
      "Basic SEO Setup",
      "Contact Form Integration",
      "Google Business Setup",
      "Business Card Design",
    ],
    bestFor: "Businesses ready to grow and attract clients online",
    cta: "Start Growing",
    popular: true,
  },
  {
    id: "premium",
    eyebrow: "Premium Brand",
    price: "R9,000+",
    terms: "Project-based · custom timeline",
    features: [
      "Premium Logo + Full Brand Kit",
      "Full Website (5+ pages)",
      "Advanced SEO Optimisation",
      "Analytics & Tracking Setup",
      "Social Media Branding Kit",
      "Google Business + Local SEO",
      "Ongoing Support (60 days)",
    ],
    bestFor: "Established businesses wanting a dominant digital presence",
    cta: "Go Premium",
  },
]
