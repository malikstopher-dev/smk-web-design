export interface ClientGeo {
  id: string
  location: [number, number]
}

export const CLIENT_GEO: ClientGeo[] = [
  { id: "south-africa", location: [-26.2041, 28.0473] },
  { id: "dr-congo", location: [-4.4419, 15.2663] },
  { id: "mozambique", location: [-25.9692, 32.5732] },
  { id: "canada", location: [45.5017, -73.5673] },
]
