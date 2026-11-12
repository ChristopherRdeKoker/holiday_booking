import { z } from "zod";
import { isISODate } from "@/lib/dates";

export const isoDateSchema = z.string().refine(isISODate, { message: "Must be a real date (YYYY-MM-DD)" });

export const numberLikeSchema = z.union([z.number(), z.string().trim().regex(/^-?\d+(\.\d+)?$/, "Enter a number")]);

export const guestCountSchema = numberLikeSchema.pipe(z.coerce.number().int().min(1, "At least 1 guest").max(20, "Up to 20 guests"));

export const amenitySchema = z.enum(["wifi", "pool", "braai", "fireplace", "sea-view", "mountain-view", "pet-friendly", "parking", "aircon", "hot-tub", "kitchen", "workspace"]);
