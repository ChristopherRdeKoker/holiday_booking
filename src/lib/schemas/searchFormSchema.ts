import { z } from "zod";
import { MAX_NIGHTS } from "@/lib/availability";
import { isISODate, nightsBetween, type ISODateType } from "@/lib/dates";
import { amenitySchema, guestCountSchema, isoDateSchema, numberLikeSchema } from "@/lib/schemas/fieldSchemas";

export const sortSchema = z.enum(["recommended", "price-asc", "price-desc", "rating"]);

const optionalDateSchema = z.union([z.literal(""), isoDateSchema]);

const optionalWholeRandSchema = z.union([
  z.literal(""),
  numberLikeSchema.pipe(z.coerce.number().int("Whole rand only").min(0, "Can't be negative").max(1_000_000, "That's a bit much")),
]);

const searchFieldsSchema = z.object({
  q: z.string().max(60),
  town: z.string().max(60),
  checkIn: optionalDateSchema,
  checkOut: optionalDateSchema,
  guests: guestCountSchema,
  minPrice: optionalWholeRandSchema,
  maxPrice: optionalWholeRandSchema,
  amenities: z.array(amenitySchema),
  sort: sortSchema,
});

export function createSearchFormSchema(today: ISODateType) {
  const result = searchFieldsSchema.superRefine((search, ctx) => {
    const hasCheckIn = search.checkIn !== "";
    const hasCheckOut = search.checkOut !== "";
    if (hasCheckIn !== hasCheckOut) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [hasCheckIn ? "checkOut" : "checkIn"], message: "Choose both dates, or neither" });
    }

    if (isISODate(search.checkIn) && search.checkIn < today) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkIn"], message: "Check-in can't be in the past" });
    }

    const hasValidDates = isISODate(search.checkIn) && isISODate(search.checkOut);
    if (hasValidDates && search.checkOut <= search.checkIn) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkOut"], message: "Check-out must be after check-in" });
    }
    if (hasValidDates && search.checkOut > search.checkIn && nightsBetween(search.checkIn, search.checkOut) > MAX_NIGHTS) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checkOut"], message: `Up to ${MAX_NIGHTS} nights` });
    }

    const hasBothPrices = typeof search.minPrice === "number" && typeof search.maxPrice === "number";
    if (hasBothPrices && search.minPrice > search.maxPrice) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["maxPrice"], message: "Max must be at least the min" });
    }
  });
  return result;
}

export type SearchFormSchemaType = ReturnType<typeof createSearchFormSchema>;
