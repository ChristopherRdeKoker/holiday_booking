import { describe, expect, it } from "vitest";
import { defaultSearch, readSearchParams, writeSearchParams } from "@/lib/searchParams";

describe("search params", () => {
  it("round-trips a search", () => {
    const s = { ...defaultSearch, q: "lodge", town: "Sabie", checkIn: "2026-12-01", checkOut: "2026-12-04", guests: 3, minPrice: 500 as const, maxPrice: 3000 as const, amenities: ["wifi", "braai"] as ("wifi" | "braai")[], sort: "rating" as const };
    expect(readSearchParams(writeSearchParams(s))).toEqual({ search: s, isInvalid: false });
  });
  it("falls back to defaults on tampered params", () => {
    expect(readSearchParams(new URLSearchParams("checkIn=2026-13-45&checkOut=x"))).toEqual({ search: defaultSearch, isInvalid: true });
    expect(readSearchParams(new URLSearchParams("amenity=moat")).isInvalid).toBe(true);
  });
});
