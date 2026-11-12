import { describe, expect, it } from "vitest";
import { defaultSearch, readSearchParams, writeSearchParams } from "@/lib/searchParams";

describe("search params", () => {
  it("round-trips a search", () => {
    const s = { ...defaultSearch, q: "lodge", town: "Sabie", checkIn: "2026-12-01", checkOut: "2026-12-04", guests: 3, minPrice: 500 as const, maxPrice: 3000 as const, amenities: ["wifi", "braai"] as ("wifi" | "braai")[], sort: "rating" as const };
    expect(readSearchParams(writeSearchParams(s), "2026-11-12")).toEqual({ search: s, isInvalid: false });
  });
  it("treats a past check-in link as invalid", () => {
    expect(readSearchParams(new URLSearchParams("checkIn=2026-11-01&checkOut=2026-11-03"), "2026-11-12").isInvalid).toBe(true);
  });
  it("falls back to defaults on tampered params", () => {
    expect(readSearchParams(new URLSearchParams("checkIn=2026-13-45&checkOut=x"), "2026-11-12")).toEqual({ search: defaultSearch, isInvalid: true });
    expect(readSearchParams(new URLSearchParams("amenity=moat"), "2026-11-12").isInvalid).toBe(true);
  });
});
