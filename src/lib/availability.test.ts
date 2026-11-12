import { describe, expect, it } from "vitest";
import { bookedNights, canCheckIn, canCheckOut, checkRange, MAX_NIGHTS, RangeProblemEnum, rangesOverlap } from "@/lib/availability";
import { addDays } from "@/lib/dates";

const today = "2026-11-12";
const existing = [{ checkIn: "2026-11-20", checkOut: "2026-11-23" }];

describe("rangesOverlap (half-open nights)", () => {
  it("detects real overlaps", () => {
    expect(rangesOverlap({ checkIn: "2026-11-19", checkOut: "2026-11-21" }, existing[0])).toBe(true);
    expect(rangesOverlap({ checkIn: "2026-11-22", checkOut: "2026-11-25" }, existing[0])).toBe(true);
    expect(rangesOverlap({ checkIn: "2026-11-18", checkOut: "2026-11-26" }, existing[0])).toBe(true);
    expect(rangesOverlap({ checkIn: "2026-11-21", checkOut: "2026-11-22" }, existing[0])).toBe(true);
  });
  it("allows back-to-back stays", () => {
    expect(rangesOverlap({ checkIn: "2026-11-23", checkOut: "2026-11-25" }, existing[0])).toBe(false);
    expect(rangesOverlap({ checkIn: "2026-11-17", checkOut: "2026-11-20" }, existing[0])).toBe(false);
  });
});

describe("checkRange", () => {
  it("accepts a free range", () => {
    expect(checkRange({ checkIn: "2026-11-14", checkOut: "2026-11-16" }, today, existing)).toBeNull();
  });
  it("accepts a check-in on today", () => {
    expect(checkRange({ checkIn: today, checkOut: "2026-11-13" }, today, existing)).toBeNull();
  });
  it("refuses past check-in", () => {
    expect(checkRange({ checkIn: "2026-11-11", checkOut: "2026-11-13" }, today, existing)).toBe(RangeProblemEnum.CheckInInPast);
  });
  it("refuses zero or negative nights", () => {
    expect(checkRange({ checkIn: "2026-11-14", checkOut: "2026-11-14" }, today, existing)).toBe(RangeProblemEnum.CheckOutNotAfterCheckIn);
    expect(checkRange({ checkIn: "2026-11-15", checkOut: "2026-11-14" }, today, existing)).toBe(RangeProblemEnum.CheckOutNotAfterCheckIn);
  });
  it("refuses overlap and garbage", () => {
    expect(checkRange({ checkIn: "2026-11-21", checkOut: "2026-11-24" }, today, existing)).toBe(RangeProblemEnum.OverlapsBooking);
    expect(checkRange({ checkIn: "2026-02-30", checkOut: "2026-03-02" }, today, existing)).toBe(RangeProblemEnum.InvalidDate);
  });
  it("caps stay length", () => {
    expect(checkRange({ checkIn: "2026-12-01", checkOut: addDays("2026-12-01", MAX_NIGHTS) }, today, [])).toBeNull();
    expect(checkRange({ checkIn: "2026-12-01", checkOut: addDays("2026-12-01", MAX_NIGHTS + 1) }, today, [])).toBe(RangeProblemEnum.TooLong);
  });
});

describe("calendar rules", () => {
  const nights = bookedNights(existing);
  it("greys out booked nights only", () => {
    expect([...nights]).toEqual(["2026-11-20", "2026-11-21", "2026-11-22"]);
  });
  it("lets a guest check in on another booking's check-out day", () => {
    expect(canCheckIn("2026-11-23", today, nights)).toBe(true);
    expect(canCheckIn("2026-11-22", today, nights)).toBe(false);
  });
  it("lets a guest check out on another booking's first night", () => {
    expect(canCheckOut("2026-11-17", "2026-11-20", nights)).toBe(true);
    expect(canCheckOut("2026-11-17", "2026-11-21", nights)).toBe(false);
  });
  it("refuses a range that jumps over a booking", () => {
    expect(canCheckOut("2026-11-18", "2026-11-25", nights)).toBe(false);
  });
  it("disables past days", () => {
    expect(canCheckIn("2026-11-11", today, nights)).toBe(false);
  });
  it("handles a stay across new year", () => {
    const ny = bookedNights([{ checkIn: "2026-12-31", checkOut: "2027-01-02" }]);
    expect([...ny]).toEqual(["2026-12-31", "2027-01-01"]);
    expect(canCheckOut("2026-12-28", "2026-12-31", ny)).toBe(true);
    expect(canCheckOut("2026-12-28", "2027-01-01", ny)).toBe(false);
    expect(canCheckIn("2027-01-02", today, ny)).toBe(true);
  });
});
