import type { z } from "zod";
import { isRangeAvailable } from "@/lib/availability";
import { blockedRangesFor } from "@/lib/blocks";
import type { ISODateType } from "@/lib/dates";
import type { bookingSchema } from "@/lib/schemas/bookingSchema";
import type { homeSchema } from "@/lib/schemas/homeSchema";
import type { SearchFormSchemaType, sortSchema } from "@/lib/schemas/searchFormSchema";

type HomeType = z.infer<typeof homeSchema>;

function _matchesText(home: HomeType, query: string): boolean {
  const needle = query.trim().toLowerCase();
  const isMatch = !needle.length || [home.title, home.town, home.province, home.tagline].some((field) => field.toLowerCase().includes(needle));
  return isMatch;
}

function _isInPriceRange(home: HomeType, minRand: number | "", maxRand: number | ""): boolean {
  const nightlyRand = home.nightlyCents / 100;
  const isAboveMin = minRand === "" || nightlyRand >= minRand;
  const isBelowMax = maxRand === "" || nightlyRand <= maxRand;
  const isInRange = isAboveMin && isBelowMax;
  return isInRange;
}

const homeSorters: Record<z.infer<typeof sortSchema>, (first: HomeType, second: HomeType) => number> = {
  recommended: (first, second) => second.rating * Math.log10(second.reviews + 10) - first.rating * Math.log10(first.reviews + 10),
  "price-asc": (first, second) => first.nightlyCents - second.nightlyCents,
  "price-desc": (first, second) => second.nightlyCents - first.nightlyCents,
  rating: (first, second) => second.rating - first.rating || second.reviews - first.reviews,
};

export function filterHomes(
  homes: readonly HomeType[],
  search: z.infer<SearchFormSchemaType>,
  today: ISODateType,
  bookings: readonly z.infer<typeof bookingSchema>[],
): HomeType[] {
  const stay = { checkIn: search.checkIn, checkOut: search.checkOut };
  const hasDates = !!stay.checkIn.length && !!stay.checkOut.length;

  const result = homes
    .filter((home) => _matchesText(home, search.q))
    .filter((home) => !search.town.length || home.town === search.town)
    .filter((home) => home.maxGuests >= search.guests)
    .filter((home) => _isInPriceRange(home, search.minPrice, search.maxPrice))
    .filter((home) => search.amenities.every((amenity) => home.amenities.includes(amenity)))
    .filter((home) => !hasDates || isRangeAvailable(stay, today, blockedRangesFor(home, today, bookings)))
    .sort(homeSorters[search.sort]);
  return result;
}
