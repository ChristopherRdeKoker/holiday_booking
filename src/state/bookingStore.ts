import type { z } from "zod";
import { findHome, homeIds } from "@/data/homes";
import { checkRange, RangeProblemEnum, type DateRangeType } from "@/lib/availability";
import { blockedRangesFor } from "@/lib/blocks";
import { BookingFailureEnum } from "@/lib/bookingProblems";
import { nightsBetween, type ISODateType } from "@/lib/dates";
import { quote } from "@/lib/pricing";
import { makeReference } from "@/lib/reference";
import type { bookingSchema } from "@/lib/schemas/bookingSchema";
import type { guestDetailsSchema } from "@/lib/schemas/guestDetailsSchema";
import { BOOKINGS_KEY, loadBookings, saveBookings, type KeyValueStoreType } from "@/lib/storage";
import type { NoticeStoreType } from "@/state/noticeStore";
import { createObservable } from "@/state/observable";

type BookingType = z.infer<typeof bookingSchema>;

export type BookingResultType = { booking: BookingType; problem: null } | { booking: null; problem: RangeProblemEnum | BookingFailureEnum };

export function createBookingStore(storage: KeyValueStoreType, initial: readonly BookingType[], notices: NoticeStoreType) {
  const bookings = createObservable<readonly BookingType[]>(initial);

  function _commit(next: readonly BookingType[]): void {
    bookings.set(next);
    const saveProblem = saveBookings(storage, next);
    if (saveProblem) notices.push(saveProblem);
  }

  function _reloadFromStorage(event: StorageEvent): void {
    if (event.key !== BOOKINGS_KEY) return;
    const loaded = loadBookings(storage, homeIds);
    bookings.set(loaded.items);
    if (loaded.notice) notices.push(loaded.notice);
  }

  let subscriberCount = 0;

  function subscribe(listener: () => void): () => void {
    const unsubscribe = bookings.subscribe(listener);
    subscriberCount++;
    if (subscriberCount === 1) window.addEventListener("storage", _reloadFromStorage);
    return () => {
      unsubscribe();
      subscriberCount--;
      if (!subscriberCount) window.removeEventListener("storage", _reloadFromStorage);
    };
  }

  function create(homeId: string, stay: DateRangeType, details: z.output<typeof guestDetailsSchema>, today: ISODateType): BookingResultType {
    const home = findHome(homeId);
    if (!home) return { booking: null, problem: BookingFailureEnum.UnknownHome };
    if (details.guests > home.maxGuests) return { booking: null, problem: BookingFailureEnum.TooManyGuests };

    const current = bookings.get();
    const problem = checkRange(stay, today, blockedRangesFor(home, today, current));
    if (problem) return { booking: null, problem };

    const price = quote(home.nightlyCents, nightsBetween(stay.checkIn, stay.checkOut), home.cleaningCents);
    const booking: BookingType = {
      ref: makeReference(new Set(current.map((existing) => existing.ref))),
      homeId,
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      guests: details.guests,
      name: details.name,
      email: details.email,
      totalCents: price.totalCents,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    _commit([...current, booking]);

    const result = { booking, problem: null };
    return result;
  }

  function cancel(ref: string): void {
    _commit(bookings.get().map((booking) => (booking.ref === ref ? { ...booking, status: "cancelled" as const } : booking)));
  }

  const result = { subscribe, getSnapshot: bookings.get, create, cancel };
  return result;
}

export type BookingStoreType = ReturnType<typeof createBookingStore>;
