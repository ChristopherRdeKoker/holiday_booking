import { z } from "zod";
import { isoDateSchema } from "@/lib/schemas/fieldSchemas";

export const PHOTO_WIDTHS = [600, 1200] as const;

export const openLicenceSchema = z.enum(["CC0 1.0", "Public Domain Mark 1.0"]);

const commonsUrlSchema = z.string().url().startsWith("https://commons.wikimedia.org/wiki/File:");

export const photoCreditSchema = z
  .object({
    homeId: z.string().regex(/^[a-z0-9-]+$/),
    alt: z.string().min(20),
    subject: z.string().min(10),
    author: z.string().min(2),
    licence: openLicenceSchema,
    licenceUrl: z.string().url().startsWith("https://creativecommons.org/"),
    sourcePageUrl: commonsUrlSchema,
    originalFileUrl: z.string().url().startsWith("https://upload.wikimedia.org/wikipedia/commons/"),
    fetchedOn: isoDateSchema,
    transformation: z.string().min(40),
  })
  .readonly();
