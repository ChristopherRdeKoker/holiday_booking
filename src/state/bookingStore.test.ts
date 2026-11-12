import { describe, expect, it } from "vitest";
import { homes } from "@/data/homes";
import { RangeProblemEnum } from "@/lib/availability";
import { BookingFailureEnum } from "@/lib/bookingProblems";
import { addDays } from "@/lib/dates";
import { BOOKINGS_KEY, createMemoryStore, loadBookings } from "@/lib/storage";
import { createBookingStore } from "@/state/bookingStore";
import { createNoticeStore } from "@/state/noticeStore";

const today = "2026-11-12";
const home = homes[0];
const freeStay = { checkIn: addDays(today, 60), checkOut: addDays(today, 63) };
const details = { name: "Thandi M", email: "thandi@example.com", guests: 2, agree: true };

function freshStore() {
  const storage = createMemoryStore();
  const bookingStore = createBookingStore(storage, [], createNoticeStore([]));
  return { storage, bookingStore };
}

describe("bookingStore", () => {
  it("books a free stay, prices it and persists it", () => {
    const { storage, bookingStore } = freshStore();
    const outcome = bookingStore.create(home.id, freeStay, details, today);
    expect(outcome.problem).toBeNull();
    expect(outcome.booking?.totalCents).toBe(Math.round((home.nightlyCents * 3 + home.cleaningCents) * 1.15));
    expect(loadBookings(storage, new Set([home.id])).items).toHaveLength(1);
    expect(storage.getItem(BOOKINGS_KEY)).toContain(outcome.booking?.ref);
  });

  it("refuses an overlapping stay for the same home but allows another home", () => {
    const { bookingStore } = freshStore();
    bookingStore.create(home.id, freeStay, details, today);
    const overlapping = { checkIn: addDays(freeStay.checkIn, 2), checkOut: addDays(freeStay.checkOut, 2) };
    expect(bookingStore.create(home.id, overlapping, details, today).problem).toBe(RangeProblemEnum.OverlapsBooking);
    expect(bookingStore.create(homes[1].id, overlapping, details, today).problem).toBeNull();
    expect(bookingStore.create(home.id, { checkIn: freeStay.checkOut, checkOut: addDays(freeStay.checkOut, 1) }, details, today).problem).toBeNull();
  });

  it("refuses a seeded booked range, past dates and too many guests", () => {
    const { bookingStore } = freshStore();
    const [start, nights] = home.blockedOffsets[0];
    const seeded = { checkIn: addDays(today, start), checkOut: addDays(today, start + nights) };
    expect(bookingStore.create(home.id, seeded, details, today).problem).toBe(RangeProblemEnum.OverlapsBooking);
    expect(bookingStore.create(home.id, { checkIn: addDays(today, -1), checkOut: addDays(today, 1) }, details, today).problem).toBe(RangeProblemEnum.CheckInInPast);
    expect(bookingStore.create(home.id, freeStay, { ...details, guests: home.maxGuests + 1 }, today).problem).toBe(BookingFailureEnum.TooManyGuests);
    expect(bookingStore.getSnapshot()).toHaveLength(0);
  });

  it("frees the dates when a booking is cancelled", () => {
    const { bookingStore } = freshStore();
    const first = bookingStore.create(home.id, freeStay, details, today);
    bookingStore.cancel(first.booking?.ref ?? "");
    expect(bookingStore.getSnapshot()[0].status).toBe("cancelled");
    expect(bookingStore.create(home.id, freeStay, details, today).problem).toBeNull();
  });

  it("reports a failed save through the notices instead of throwing", () => {
    const notices = createNoticeStore([]);
    const brokenStorage = { getItem: () => null, setItem: () => { throw new Error("quota"); }, removeItem: () => undefined };
    const bookingStore = createBookingStore(brokenStorage, [], notices);
    expect(bookingStore.create(home.id, freeStay, details, today).problem).toBeNull();
    expect(notices.getSnapshot().map((notice) => notice.text)).toEqual([expect.stringMatching(/Couldn't save/)]);
  });
});
