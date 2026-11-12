import { addDays, isISODate, nightsBetween, type ISODateType } from "@/lib/dates";

export type DateRangeType = {
  checkIn: ISODateType;
  checkOut: ISODateType;
};

export const MAX_NIGHTS = 28;

export enum RangeProblemEnum {
  InvalidDate = 1,
  CheckOutNotAfterCheckIn = 2,
  CheckInInPast = 3,
  TooLong = 4,
  OverlapsBooking = 5,
}

export function rangesOverlap(first: DateRangeType, second: DateRangeType): boolean {
  const isOverlapping = first.checkIn < second.checkOut && second.checkIn < first.checkOut;
  return isOverlapping;
}

export function bookedNights(blocked: readonly DateRangeType[]): Set<ISODateType> {
  const result = new Set<ISODateType>();
  for (const range of blocked) {
    for (let night = range.checkIn; night < range.checkOut; night = addDays(night, 1)) result.add(night);
  }
  return result;
}

export function checkRange(range: DateRangeType, today: ISODateType, blocked: readonly DateRangeType[]): RangeProblemEnum | null {
  if (!isISODate(range.checkIn) || !isISODate(range.checkOut)) return RangeProblemEnum.InvalidDate;
  if (range.checkOut <= range.checkIn) return RangeProblemEnum.CheckOutNotAfterCheckIn;
  if (range.checkIn < today) return RangeProblemEnum.CheckInInPast;
  if (nightsBetween(range.checkIn, range.checkOut) > MAX_NIGHTS) return RangeProblemEnum.TooLong;
  if (blocked.some((booked) => rangesOverlap(range, booked))) return RangeProblemEnum.OverlapsBooking;
  return null;
}

export function isRangeAvailable(range: DateRangeType, today: ISODateType, blocked: readonly DateRangeType[]): boolean {
  const isAvailable = checkRange(range, today, blocked) === null;
  return isAvailable;
}

export function canCheckIn(day: ISODateType, today: ISODateType, nights: ReadonlySet<ISODateType>): boolean {
  const isAllowed = day >= today && !nights.has(day);
  return isAllowed;
}

export function canCheckOut(checkIn: ISODateType, day: ISODateType, nights: ReadonlySet<ISODateType>): boolean {
  if (day <= checkIn) return false;
  if (nightsBetween(checkIn, day) > MAX_NIGHTS) return false;
  for (let night = checkIn; night < day; night = addDays(night, 1)) {
    if (nights.has(night)) return false;
  }
  return true;
}

const problemMessages: Record<RangeProblemEnum, string> = {
  [RangeProblemEnum.InvalidDate]: "Those dates are not valid.",
  [RangeProblemEnum.CheckOutNotAfterCheckIn]: "Check-out must be at least one night after check-in.",
  [RangeProblemEnum.CheckInInPast]: "Check-in can't be in the past.",
  [RangeProblemEnum.TooLong]: `Stays are limited to ${MAX_NIGHTS} nights.`,
  [RangeProblemEnum.OverlapsBooking]: "Those dates overlap an existing booking for this home.",
};

export function problemMessage(problem: RangeProblemEnum): string {
  const result = problemMessages[problem];
  return result;
}
