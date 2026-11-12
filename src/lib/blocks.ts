import type { z } from "zod";
import type { DateRangeType } from "@/lib/availability";
import { addDays, type ISODateType } from "@/lib/dates";
import type { bookingSchema } from "@/lib/schemas/bookingSchema";
import type { homeSchema } from "@/lib/schemas/homeSchema";

export function seededBlocks(offsets: readonly (readonly [number, number])[], today: ISODateType): DateRangeType[] {
  const result = offsets.map(([startOffset, nights]) => {
    const checkIn = addDays(today, startOffset);
    return { checkIn, checkOut: addDays(checkIn, nights) };
  });
  return result;
}

export function blockedRangesFor(home: z.infer<typeof homeSchema>, today: ISODateType, bookings: readonly z.infer<typeof bookingSchema>[]): DateRangeType[] {
  const guestRanges = bookings
    .filter((booking) => booking.homeId === home.id && booking.status === "confirmed")
    .map(({ checkIn, checkOut }) => ({ checkIn, checkOut }));
  const seededRanges = seededBlocks(home.blockedOffsets, today);

  const result = [...seededRanges, ...guestRanges];
  return result;
}
