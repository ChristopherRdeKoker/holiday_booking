import { canCheckIn, canCheckOut } from "@/lib/availability";
import { formatDate, type ISODateType } from "@/lib/dates";

export type StaySelectionType = {
  checkIn: ISODateType | "";
  checkOut: ISODateType | "";
};

export type CalendarDayType = {
  isSelectable: boolean;
  isBooked: boolean;
  isPast: boolean;
  isCheckIn: boolean;
  isCheckOut: boolean;
  isInStay: boolean;
};

export const emptySelection: StaySelectionType = { checkIn: "", checkOut: "" };

export function describeCalendarDay(day: ISODateType, today: ISODateType, nights: ReadonlySet<ISODateType>, selection: StaySelectionType): CalendarDayType {
  const isChoosingCheckOut = !!selection.checkIn.length && !selection.checkOut.length;
  const isValidCheckOut = isChoosingCheckOut && canCheckOut(selection.checkIn, day, nights);
  const hasStay = !!selection.checkIn.length && !!selection.checkOut.length;

  const result = {
    isSelectable: isValidCheckOut || canCheckIn(day, today, nights),
    isBooked: nights.has(day),
    isPast: day < today,
    isCheckIn: day === selection.checkIn,
    isCheckOut: day === selection.checkOut,
    isInStay: hasStay && day > selection.checkIn && day < selection.checkOut,
  };
  return result;
}

export function selectCalendarDay(day: ISODateType, today: ISODateType, nights: ReadonlySet<ISODateType>, selection: StaySelectionType): StaySelectionType {
  const isChoosingCheckOut = !!selection.checkIn.length && !selection.checkOut.length;
  if (isChoosingCheckOut && canCheckOut(selection.checkIn, day, nights)) return { checkIn: selection.checkIn, checkOut: day };
  if (canCheckIn(day, today, nights)) return { checkIn: day, checkOut: "" };
  return selection;
}

export function calendarDayLabel(day: ISODateType, state: CalendarDayType): string {
  const parts = [formatDate(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })];
  if (state.isCheckIn) parts.push("your check-in");
  if (state.isCheckOut) parts.push("your check-out");
  if (state.isInStay) parts.push("in your stay");
  if (state.isBooked) parts.push("booked");
  if (state.isPast) parts.push("in the past");
  if (!state.isSelectable && !state.isBooked && !state.isPast) parts.push("not available");

  const result = parts.join(", ");
  return result;
}

export function calendarStatus(selection: StaySelectionType): string {
  if (!selection.checkIn.length) return "Choose your check-in date.";
  if (!selection.checkOut.length) return `Check-in ${formatDate(selection.checkIn)}. Now choose your check-out date.`;
  const result = `Your stay: ${formatDate(selection.checkIn)} to ${formatDate(selection.checkOut)}.`;
  return result;
}
