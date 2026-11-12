import { describe, expect, it } from "vitest";
import { createSearchFormSchema } from "@/lib/schemas/searchFormSchema";

const searchFormSchema = createSearchFormSchema("2026-11-12");

const emptySearch = { q: "", town: "", checkIn: "", checkOut: "", guests: "2", minPrice: "", maxPrice: "", amenities: [], sort: "recommended" };

describe("searchFormSchema", () => {
  it("accepts an empty search and coerces numbers", () => {
    const parsed = searchFormSchema.safeParse(emptySearch);
    expect(parsed.success && parsed.data.guests).toBe(2);
  });
  it("requires both dates or neither", () => {
    expect(searchFormSchema.safeParse({ ...emptySearch, checkIn: "2026-12-01" }).success).toBe(false);
  });
  it("rejects check-out before check-in, impossible dates and overlong stays", () => {
    expect(searchFormSchema.safeParse({ ...emptySearch, checkIn: "2026-12-05", checkOut: "2026-12-05" }).success).toBe(false);
    expect(searchFormSchema.safeParse({ ...emptySearch, checkIn: "2026-02-30", checkOut: "2026-03-02" }).success).toBe(false);
    expect(searchFormSchema.safeParse({ ...emptySearch, checkIn: "2026-12-01", checkOut: "2027-02-01" }).success).toBe(false);
  });
  it("rejects a check-in before today but accepts today", () => {
    const pastIssue = searchFormSchema.safeParse({ ...emptySearch, checkIn: "2026-11-11", checkOut: "2026-11-14" });
    expect(!pastIssue.success && pastIssue.error.flatten().fieldErrors.checkIn).toEqual(["Check-in can't be in the past"]);
    expect(searchFormSchema.safeParse({ ...emptySearch, checkIn: "2026-11-12", checkOut: "2026-11-14" }).success).toBe(true);
  });
  it("rejects min above max, fractions and unknown amenities", () => {
    expect(searchFormSchema.safeParse({ ...emptySearch, minPrice: "3000", maxPrice: "1000" }).success).toBe(false);
    expect(searchFormSchema.safeParse({ ...emptySearch, minPrice: "12.5" }).success).toBe(false);
    expect(searchFormSchema.safeParse({ ...emptySearch, amenities: ["moat"] }).success).toBe(false);
  });
});
