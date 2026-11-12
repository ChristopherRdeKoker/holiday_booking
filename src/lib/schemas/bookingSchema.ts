import { z } from "zod";
import { isoDateSchema } from "@/lib/schemas/fieldSchemas";
import { REFERENCE_PATTERN } from "@/lib/reference";

export const bookingStatusSchema = z.enum(["confirmed", "cancelled"]);

export const bookingSchema = z
  .object({
    ref: z.string().regex(REFERENCE_PATTERN),
    homeId: z.string().min(1),
    checkIn: isoDateSchema,
    checkOut: isoDateSchema,
    guests: z.number().int().min(1).max(20),
    name: z.string().min(1).max(200),
    email: z.string().email().max(200),
    totalCents: z.number().int().nonnegative(),
    createdAt: z.string().datetime(),
    status: bookingStatusSchema,
  })
  .strict()
  .refine((booking) => booking.checkOut > booking.checkIn, { message: "Check-out must be after check-in", path: ["checkOut"] });

export const bookingListSchema = z.array(bookingSchema);

export const favouriteIdSchema = z.string().min(1);
