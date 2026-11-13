import { z } from "zod";
import { amenitySchema } from "@/lib/schemas/fieldSchemas";

export const homeSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(3),
    town: z.string().min(2),
    province: z.string().min(2),
    tagline: z.string().min(3),
    nightlyCents: z.number().int().positive(),
    cleaningCents: z.number().int().nonnegative(),
    maxGuests: z.number().int().min(1).max(20),
    bedrooms: z.number().int().min(0),
    baths: z.number().min(1),
    rating: z.number().min(1).max(5),
    reviews: z.number().int().nonnegative(),
    amenities: z.array(amenitySchema).min(1).readonly(),
    description: z.string().min(20),
    blockedOffsets: z.array(z.tuple([z.number().int(), z.number().int().positive()]).readonly()).readonly(),
  })
  .readonly();
