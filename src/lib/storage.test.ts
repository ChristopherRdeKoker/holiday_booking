import { describe, expect, it } from "vitest";
import type { z } from "zod";
import { makeReference, REFERENCE_PATTERN } from "@/lib/reference";
import type { bookingSchema } from "@/lib/schemas/bookingSchema";
import { BOOKINGS_KEY, createMemoryStore, FAVOURITES_KEY, loadBookings, loadFavourites, saveBookings, type KeyValueStoreType } from "@/lib/storage";

const ids = new Set(["h1", "h2"]);
const good: z.infer<typeof bookingSchema> = {
  ref: "STP-ABC-234",
  homeId: "h1",
  checkIn: "2026-11-20",
  checkOut: "2026-11-23",
  guests: 2,
  name: "Test",
  email: "t@example.com",
  totalCents: 100,
  createdAt: "2026-11-12T10:00:00.000Z",
  status: "confirmed",
};

function storeWith(key: string, value: string): KeyValueStoreType {
  const s = createMemoryStore();
  s.setItem(key, value);
  return s;
}

describe("loadBookings", () => {
  it("returns empty with no notice when nothing is saved", () => {
    expect(loadBookings(createMemoryStore(), ids)).toEqual({ items: [], notice: null });
  });
  it("round-trips valid bookings", () => {
    const s = createMemoryStore();
    expect(saveBookings(s, [good])).toBeNull();
    expect(loadBookings(s, ids)).toEqual({ items: [good], notice: null });
  });
  it("recovers from invalid JSON and keeps a backup", () => {
    const s = storeWith(BOOKINGS_KEY, "{not json");
    const r = loadBookings(s, ids);
    expect(r.items).toEqual([]);
    expect(r.notice).toMatch(/unreadable/);
    expect(s.getItem(`${BOOKINGS_KEY}.corrupt`)).toBe("{not json");
  });
  it("recovers from a wrong top-level type", () => {
    const r = loadBookings(storeWith(BOOKINGS_KEY, '{"a":1}'), ids);
    expect(r.items).toEqual([]);
    expect(r.notice).toMatch(/unexpected format/);
  });
  it("keeps good items and quantifies dropped ones", () => {
    const bad = [
      { ...good, ref: "STP-ABC-235", checkOut: good.checkIn },
      { ...good, ref: "STP-ABC-236", homeId: "nope" },
      { ...good, ref: "STP-ABC-237", status: "pending" },
      { ...good, ref: "STP-ABC-238", checkIn: "2026-02-30" },
      { ...good, ref: "STP-ABC-239", extra: 1 },
      { ...good, ref: "STP-ABC-240", email: "nope" },
      null,
      "x",
      good,
    ];
    const r = loadBookings(storeWith(BOOKINGS_KEY, JSON.stringify([good, ...bad])), ids);
    expect(r.items).toEqual([good]);
    expect(r.notice).toBe("9 of 10 saved bookings couldn't be read and were removed. The other 1 is intact.");
  });
  it("survives a store that throws", () => {
    const throwing: KeyValueStoreType = {
      getItem() { throw new Error("blocked"); },
      setItem() { throw new Error("blocked"); },
      removeItem() { throw new Error("blocked"); },
    };
    const r = loadBookings(throwing, ids);
    expect(r.items).toEqual([]);
    expect(r.notice).toMatch(/blocked/);
    expect(saveBookings(throwing, [])).toMatch(/Couldn't save/);
  });
});

describe("loadFavourites", () => {
  it("filters unknown ids and duplicates", () => {
    const r = loadFavourites(storeWith(FAVOURITES_KEY, JSON.stringify(["h1", "h1", "zz", 3])), ids);
    expect(r.items).toEqual(["h1"]);
    expect(r.notice).toBe("3 of 4 saved favourites couldn't be read and were removed. The other 1 is intact.");
  });
  it("recovers from garbage", () => {
    expect(loadFavourites(storeWith(FAVOURITES_KEY, "\u0000"), ids).items).toEqual([]);
  });
});

describe("saveBookings", () => {
  it("refuses to write an invalid booking", () => {
    const s = createMemoryStore();
    expect(saveBookings(s, [{ ...good, guests: 0 }])).toMatch(/failed validation/);
    expect(s.getItem(BOOKINGS_KEY)).toBeNull();
  });
});

describe("makeReference", () => {
  it("produces the documented format and avoids taken refs", () => {
    const ref = makeReference(new Set());
    expect(ref).toMatch(REFERENCE_PATTERN);
    let call = 0;
    const seq = (n: number) => new Uint8Array(n).fill(call++ === 0 ? 0 : 1);
    expect(makeReference(new Set(["STP-AAA-AAA"]), seq)).toBe("STP-BBB-BBB");
  });
});
