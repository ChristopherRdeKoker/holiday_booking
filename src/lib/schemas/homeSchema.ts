import { z } from "zod";
import { amenitySchema } from "@/lib/schemas/fieldSchemas";

const hexColourSchema = z.string().regex(/^#[0-9a-f]{6}$/i);

export const sceneSchema = z.enum(["coast", "mountain", "karoo", "forest", "vineyard", "lagoon", "bushveld"]);

export const houseStyleSchema = z.enum(["cottage", "modern", "farmhouse", "cabin", "beach-shack", "rondavel"]);

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
    art: z.object({
      scene: sceneSchema,
      house: houseStyleSchema,
      wall: hexColourSchema,
      roof: hexColourSchema,
      accent: hexColourSchema,
      seed: z.number().int().nonnegative(),
    }),
    blockedOffsets: z.array(z.tuple([z.number().int(), z.number().int().positive()]).readonly()).readonly(),
  })
  .readonly();
