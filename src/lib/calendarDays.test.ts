import { describe, expect, it } from "vitest";
import { bookedNights } from "@/lib/availability";
import { calendarDayLabel, describeCalendarDay, emptySelection, selectCalendarDay } from "@/lib/calendarDays";

const today = "2026-11-12";
const nights = bookedNights([{ checkIn: "2026-11-20", checkOut: "2026-11-23" }]);

describe("selectCalendarDay", () => {
  it("picks check-in, then check-out", () => {
    const withCheckIn = selectCalendarDay("2026-11-15", today, nights, emptySelection);
    expect(withCheckIn).toEqual({ checkIn: "2026-11-15", checkOut: "" });
    expect(selectCalendarDay("2026-11-18", today, nights, withCheckIn)).toEqual({ checkIn: "2026-11-15", checkOut: "2026-11-18" });
  });
  it("allows check-out on the first booked night", () => {
    expect(selectCalendarDay("2026-11-20", today, nights, { checkIn: "2026-11-17", checkOut: "" })).toEqual({ checkIn: "2026-11-17", checkOut: "2026-11-20" });
  });
  it("restarts the stay when the second click can't be a check-out", () => {
    expect(selectCalendarDay("2026-11-25", today, nights, { checkIn: "2026-11-17", checkOut: "" })).toEqual({ checkIn: "2026-11-25", checkOut: "" });
  });
  it("ignores past and booked days", () => {
    expect(selectCalendarDay("2026-11-10", today, nights, emptySelection)).toEqual(emptySelection);
    expect(selectCalendarDay("2026-11-21", today, nights, emptySelection)).toEqual(emptySelection);
  });
});

describe("describeCalendarDay", () => {
  it("marks stay days and labels them", () => {
    const selection = { checkIn: "2026-11-14", checkOut: "2026-11-17" };
    const middle = describeCalendarDay("2026-11-15", today, nights, selection);
    expect(middle.isInStay).toBe(true);
    expect(calendarDayLabel("2026-11-15", middle)).toMatch(/in your stay/);
    const booked = describeCalendarDay("2026-11-21", today, nights, selection);
    expect(booked.isSelectable).toBe(false);
    expect(calendarDayLabel("2026-11-21", booked)).toMatch(/booked$/);
  });
});
