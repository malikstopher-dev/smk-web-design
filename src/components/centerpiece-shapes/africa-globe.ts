/* ABOUT — globe foregrounding Africa / South Africa.
   Dense dot coverage over the continent, sparser elsewhere,
   plus a latitude ring so it reads as a planet. */

import { spherePoints, sphereRegion } from "./_shared"
import type { Vec3 } from "@/components/centerpiece"

const africa = sphereRegion(1500, [-38, 38], [-20, 52])
const world = spherePoints(2200, 1.7)

export const POINTS: Vec3[] = [...africa, ...world]
