import { describe, expect, it } from "vitest";
import { homes, towns } from "@/data/homes";

describe("homes", () => {
  it("has 12 schema-valid homes with unique ids", () => {
    expect(homes).toHaveLength(12);
    expect(new Set(homes.map((home) => home.id)).size).toBe(12);
    expect(towns.length).toBeGreaterThan(5);
  });
  it("keeps seeded bookings non-overlapping and in the future", () => {
    for (const home of homes) {
      const offsets = [...home.blockedOffsets].sort((first, second) => first[0] - second[0]);
      offsets.forEach(([start, nights], index) => {
        expect(start).toBeGreaterThanOrEqual(0);
        if (index) expect(start).toBeGreaterThanOrEqual(offsets[index - 1][0] + offsets[index - 1][1]);
        expect(nights).toBeGreaterThan(0);
      });
    }
  });
});
