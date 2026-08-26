export interface ClientGeo {
  id: string
  country: string
  city: string
  location: [number, number]
  work: string
}

export const CLIENT_GEO: ClientGeo[] = [
  {
    id: "south-africa",
    country: "South Africa",
    city: "Johannesburg",
    location: [-26.2041, 28.0473],
    work: "Home base: Sandton studio. Design, build & SEO for local businesses.",
  },
  {
    id: "dr-congo",
    country: "DR Congo",
    city: "Kinshasa",
    location: [-4.4419, 15.2663],
    work: "Restaurant & hospitality sites: Le Centre, Levante, Marché LT.",
  },
  {
    id: "mozambique",
    country: "Mozambique",
    city: "Maputo",
    location: [-25.9692, 32.5732],
    work: "Hospitality & tourism websites for cross-border clients.",
  },
  {
    id: "canada",
    country: "Canada",
    city: "Montreal",
    location: [45.5017, -73.5673],
    work: "E-commerce for the African diaspora.",
  },
]
