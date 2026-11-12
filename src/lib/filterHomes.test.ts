import { describe, expect, it } from "vitest";
import type { z } from "zod";
import { homes } from "@/data/homes";
import { blockedRangesFor } from "@/lib/blocks";
import { addDays } from "@/lib/dates";
import { filterHomes } from "@/lib/filterHomes";
import type { bookingSchema } from "@/lib/schemas/bookingSchema";
import { defaultSearch } from "@/lib/searchParams";

const today = "2026-11-12";

describe("filterHomes", () => {
  it("returns everything for an empty search", () => {
    expect(filterHomes(homes, defaultSearch, today, [])).toHaveLength(homes.length);
  });
  it("filters by town, guests, price and amenities", () => {
    const r = filterHomes(homes, { ...defaultSearch, guests: 6, minPrice: 2000, amenities: ["pool"] }, today, []);
    expect(r.length).toBeGreaterThan(0);
    for (const h of r) {
      expect(h.maxGuests).toBeGreaterThanOrEqual(6);
      expect(h.nightlyCents).toBeGreaterThanOrEqual(200000);
      expect(h.amenities).toContain("pool");
    }
    expect(filterHomes(homes, { ...defaultSearch, town: "Clarens" }, today, []).map((h) => h.town)).toEqual(["Clarens"]);
  });
  it("hides homes that are booked for the requested dates", () => {
    const home = homes[0];
    const [start, nights] = home.blockedOffsets[0];
    const checkIn = addDays(today, start);
    const r = filterHomes(homes, { ...defaultSearch, checkIn, checkOut: addDays(checkIn, nights) }, today, []);
    expect(r.find((h) => h.id === home.id)).toBeUndefined();
  });
  it("counts the guest's own confirmed bookings but not cancelled ones", () => {
    const home = homes[1];
    const free = { checkIn: addDays(today, 60), checkOut: addDays(today, 63) };
    const booking: z.infer<typeof bookingSchema> = { ref: "STP-AAA-AAA", homeId: home.id, ...free, guests: 1, name: "A", email: "a@example.com", totalCents: 1, createdAt: "2026-11-12T00:00:00.000Z", status: "confirmed" };
    const search = { ...defaultSearch, ...free };
    expect(filterHomes(homes, search, today, [booking]).some((h) => h.id === home.id)).toBe(false);
    expect(filterHomes(homes, search, today, [{ ...booking, status: "cancelled" }]).some((h) => h.id === home.id)).toBe(true);
    expect(blockedRangesFor(home, today, [booking])).toContainEqual(free);
  });
  it("sorts by price", () => {
    const r = filterHomes(homes, { ...defaultSearch, sort: "price-asc" }, today, []);
    expect(r.map((h) => h.nightlyCents)).toEqual([...r.map((h) => h.nightlyCents)].sort((a, b) => a - b));
  });
});


describe("seeded availability over time", () => {
  it("never lets a moving seeded block overlap a stored guest booking", () => {
    const bookingDay = "2026-11-12";
    for (const home of homes) {
      const [start, nights] = home.blockedOffsets[0];
      const checkIn = addDays(bookingDay, start + nights);
      const booking: z.infer<typeof bookingSchema> = { ref: "STP-AAA-BBB", homeId: home.id, checkIn, checkOut: addDays(checkIn, 2), guests: 1, name: "A", email: "a@example.com", totalCents: 1, createdAt: "2026-11-12T00:00:00.000Z", status: "confirmed" };
      for (let dayOffset = 0; dayOffset <= 30; dayOffset++) {
        const ranges = blockedRangesFor(home, addDays(bookingDay, dayOffset), [booking]);
        const guestRange = { checkIn: booking.checkIn, checkOut: booking.checkOut };
        const clashes = ranges.filter((range) => range.checkIn !== guestRange.checkIn && range.checkIn < guestRange.checkOut && guestRange.checkIn < range.checkOut);
        expect(clashes, `${home.id} on day +${dayOffset}`).toEqual([]);
      }
    }
  });
});
