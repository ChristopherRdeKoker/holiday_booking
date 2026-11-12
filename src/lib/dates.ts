export type ISODateType = string;

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

export function daysInMonth(year: number, monthIndex: number): number {
  const result = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  return result;
}

export function isISODate(value: unknown): value is ISODateType {
  if (typeof value !== "string") return false;
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const isRealDate = month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month - 1);
  return isRealDate;
}

export function toDayNumber(iso: ISODateType): number {
  if (!isISODate(iso)) throw new RangeError(`Not an ISO date: ${iso}`);
  const [year, month, day] = iso.split("-").map(Number);
  const result = Math.round(Date.UTC(year, month - 1, day) / DAY_MS);
  return result;
}

export function fromParts(year: number, monthIndex: number, day: number): ISODateType {
  const yearText = String(year).padStart(4, "0");
  const monthText = String(monthIndex + 1).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");
  const result = `${yearText}-${monthText}-${dayText}`;
  return result;
}

export function fromDayNumber(dayNumber: number): ISODateType {
  const utc = new Date(dayNumber * DAY_MS);
  const result = fromParts(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
  return result;
}

export function todayISO(now: Date): ISODateType {
  const result = fromParts(now.getFullYear(), now.getMonth(), now.getDate());
  return result;
}

export function addDays(iso: ISODateType, days: number): ISODateType {
  const result = fromDayNumber(toDayNumber(iso) + days);
  return result;
}

export function nightsBetween(checkIn: ISODateType, checkOut: ISODateType): number {
  const result = toDayNumber(checkOut) - toDayNumber(checkIn);
  return result;
}

export function eachNight(checkIn: ISODateType, checkOut: ISODateType): ISODateType[] {
  const result: ISODateType[] = [];
  for (let day = toDayNumber(checkIn); day < toDayNumber(checkOut); day++) result.push(fromDayNumber(day));
  return result;
}

export function monthNumberOf(iso: ISODateType): number {
  const [year, month] = iso.split("-").map(Number);
  const result = year * 12 + month - 1;
  return result;
}

export function monthGrid(monthNumber: number): (ISODateType | null)[][] {
  const year = Math.floor(monthNumber / 12);
  const monthIndex = monthNumber % 12;
  const leadingBlanks = (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;

  const cells: (ISODateType | null)[] = Array.from({ length: leadingBlanks }, () => null);
  for (let day = 1; day <= daysInMonth(year, monthIndex); day++) cells.push(fromParts(year, monthIndex, day));
  while (cells.length % 7) cells.push(null);

  const result: (ISODateType | null)[][] = [];
  for (let start = 0; start < cells.length; start += 7) result.push(cells.slice(start, start + 7));
  return result;
}

const MEDIUM_DATE: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };

export function formatDate(iso: ISODateType, options: Intl.DateTimeFormatOptions = MEDIUM_DATE): string {
  const result = new Intl.DateTimeFormat("en-ZA", { ...options, timeZone: "UTC" }).format(new Date(toDayNumber(iso) * DAY_MS));
  return result;
}

export function formatMonth(monthNumber: number): string {
  const firstOfMonth = new Date(Date.UTC(Math.floor(monthNumber / 12), monthNumber % 12, 1));
  const result = new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric", timeZone: "UTC" }).format(firstOfMonth);
  return result;
}
