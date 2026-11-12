import { z } from "zod";
import { guestCountSchema } from "@/lib/schemas/fieldSchemas";

export const guestDetailsSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  guests: guestCountSchema,
  agree: z.boolean().refine((value) => value, { message: "Please confirm you understand this is a demo" }),
});
