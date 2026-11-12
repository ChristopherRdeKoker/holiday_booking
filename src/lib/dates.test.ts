import { describe, expect, it } from "vitest";
import { addDays, eachNight, formatDate, formatMonth, isISODate, monthGrid, nightsBetween, todayISO } from "@/lib/dates";

describe("isISODate", () => {
  it("accepts real calendar dates", () => {
    expect(isISODate("2026-11-12")).toBe(true);
    expect(isISODate("2028-02-29")).toBe(true);
  });
  it("rejects impossible or malformed dates", () => {
    for (const v of ["2026-02-29", "2026-13-01", "2026-00-10", "2026-04-31", "2026-1-01", "20261112", "", null, 42, "2026-11-12T00:00"]) {
      expect(isISODate(v)).toBe(false);
    }
  });
});

describe("day arithmetic", () => {
  it("counts nights as check-out minus check-in", () => {
    expect(nightsBetween("2026-11-12", "2026-11-15")).toBe(3);
    expect(nightsBetween("2026-11-12", "2026-11-13")).toBe(1);
    expect(nightsBetween("2026-11-12", "2026-11-12")).toBe(0);
  });
  it("crosses the year boundary", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(nightsBetween("2026-12-28", "2027-01-04")).toBe(7);
    expect(eachNight("2026-12-30", "2027-01-02")).toEqual(["2026-12-30", "2026-12-31", "2027-01-01"]);
  });
  it("handles leap years", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
    expect(nightsBetween("2028-02-01", "2028-03-01")).toBe(29);
  });
  it("is unaffected by daylight-saving transitions in the host zone", () => {
    expect(nightsBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(nightsBetween("2026-10-24", "2026-10-26")).toBe(2);
    expect(nightsBetween("2026-04-04", "2026-04-06")).toBe(2);
    expect(addDays("2026-03-29", 1)).toBe("2026-03-30");
    expect(addDays("2026-11-01", -1)).toBe("2026-10-31");
  });
});

describe("todayISO", () => {
  it("uses the local calendar day, not UTC", () => {
    const local = new Date(2026, 10, 12, 0, 5);
    expect(todayISO(local)).toBe("2026-11-12");
    const lateLocal = new Date(2026, 10, 12, 23, 55);
    expect(todayISO(lateLocal)).toBe("2026-11-12");
  });
});

describe("monthGrid", () => {
  it("starts weeks on Monday", () => {
    const grid = monthGrid(2026 * 12 + 10);
    expect(grid[0].slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(grid[0][6]).toBe("2026-11-01");
    expect(grid.flat().filter(Boolean)).toHaveLength(30);
    for (const week of grid) expect(week).toHaveLength(7);
  });
  it("rolls month numbers across years", () => {
    expect(monthGrid(2026 * 12 + 12).flat().find(Boolean)).toBe("2027-01-01");
    expect(formatMonth(2026 * 12 + 12)).toContain("2027");
  });
});

describe("formatDate", () => {
  it("formats the stored calendar day regardless of host zone", () => {
    expect(formatDate("2027-01-01")).toContain("2027");
    expect(formatDate("2027-01-01", { day: "numeric" })).toBe("1");
  });
});

it("reports the zone this run used", () => {
  expect(typeof Intl.DateTimeFormat().resolvedOptions().timeZone).toBe("string");
});
