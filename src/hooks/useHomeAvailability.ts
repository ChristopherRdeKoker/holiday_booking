import { useMemo } from "react";
import type { z } from "zod";
import { useBookings, useToday } from "@/hooks/useAppStores";
import { bookedNights } from "@/lib/availability";
import { blockedRangesFor } from "@/lib/blocks";
import type { homeSchema } from "@/lib/schemas/homeSchema";

export function useHomeAvailability(home: z.infer<typeof homeSchema>) {
  const today = useToday();
  const { bookings } = useBookings();
  const result = useMemo(() => {
    const blocked = blockedRangesFor(home, today, bookings);
    return { today, blocked, nights: bookedNights(blocked) };
  }, [home, today, bookings]);
  return result;
}
