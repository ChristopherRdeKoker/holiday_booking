import { z } from "zod";
import { bookingListSchema, bookingSchema, favouriteIdSchema } from "@/lib/schemas/bookingSchema";

export type KeyValueStoreType = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export type LoadResultType<ItemType> = {
  items: ItemType[];
  notice: string | null;
};

type ReadOutcomeType = { raw: unknown[]; notice: null } | { raw: null; notice: string };

export const BOOKINGS_KEY = "stoep.bookings.v1";
export const FAVOURITES_KEY = "stoep.favourites.v1";

export function createMemoryStore(): KeyValueStoreType {
  const entries = new Map<string, string>();
  const result = {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
  };
  return result;
}

function _readJsonArray(store: KeyValueStoreType, key: string, label: string): ReadOutcomeType {
  let text: string | null;
  try {
    text = store.getItem(key);
  } catch {
    return { raw: null, notice: `Your browser blocked access to saved ${label}, so nothing is saved between visits right now.` };
  }
  if (text === null) return { raw: [], notice: null };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { raw: null, notice: `Saved ${label} were unreadable (not valid data) and have been reset.` };
  }

  const asArray = z.array(z.unknown()).safeParse(parsed);
  const result: ReadOutcomeType = asArray.success ? { raw: asArray.data, notice: null } : { raw: null, notice: `Saved ${label} were in an unexpected format and have been reset.` };
  return result;
}

function _keepBackup(store: KeyValueStoreType, key: string): void {
  try {
    const text = store.getItem(key);
    if (text !== null) store.setItem(`${key}.corrupt`, text);
  } catch {
    return;
  }
}

function _loadList<ItemType>(
  store: KeyValueStoreType,
  key: string,
  label: string,
  parseItem: (raw: unknown) => ItemType | null,
  identify: (item: ItemType) => string,
): LoadResultType<ItemType> {
  const outcome = _readJsonArray(store, key, label);
  if (outcome.raw === null) {
    _keepBackup(store, key);
    return { items: [], notice: outcome.notice };
  }

  const seenIds = new Set<string>();
  const items: ItemType[] = [];
  for (const raw of outcome.raw) {
    const item = parseItem(raw);
    if (item === null || seenIds.has(identify(item))) continue;
    seenIds.add(identify(item));
    items.push(item);
  }

  const droppedCount = outcome.raw.length - items.length;
  if (!droppedCount) return { items, notice: null };

  _keepBackup(store, key);
  const keptText = items.length === 1 ? "The other 1 is intact." : `The other ${items.length} are intact.`;
  const result = {
    items,
    notice: `${droppedCount} of ${outcome.raw.length} saved ${label} couldn't be read and were removed. ${keptText}`,
  };
  return result;
}

export function loadBookings(store: KeyValueStoreType, homeIds: ReadonlySet<string>): LoadResultType<z.infer<typeof bookingSchema>> {
  const result = _loadList(
    store,
    BOOKINGS_KEY,
    "bookings",
    (raw) => {
      const parsed = bookingSchema.safeParse(raw);
      const isKnownHome = parsed.success && homeIds.has(parsed.data.homeId);
      return isKnownHome ? parsed.data : null;
    },
    (booking) => booking.ref,
  );
  return result;
}

export function loadFavourites(store: KeyValueStoreType, homeIds: ReadonlySet<string>): LoadResultType<string> {
  const result = _loadList(
    store,
    FAVOURITES_KEY,
    "favourites",
    (raw) => {
      const parsed = favouriteIdSchema.safeParse(raw);
      const isKnownHome = parsed.success && homeIds.has(parsed.data);
      return isKnownHome ? parsed.data : null;
    },
    (homeId) => homeId,
  );
  return result;
}

function _writeJson(store: KeyValueStoreType, key: string, value: unknown): string | null {
  try {
    store.setItem(key, JSON.stringify(value));
    return null;
  } catch {
    return "Couldn't save to this browser's storage (it may be full or blocked). Changes will last until you close the tab.";
  }
}

export function saveBookings(store: KeyValueStoreType, bookings: readonly z.infer<typeof bookingSchema>[]): string | null {
  const checked = bookingListSchema.safeParse(bookings);
  if (!checked.success) return "A booking failed validation and was not saved.";
  const result = _writeJson(store, BOOKINGS_KEY, checked.data);
  return result;
}

export function saveFavourites(store: KeyValueStoreType, homeIds: readonly string[]): string | null {
  const result = _writeJson(store, FAVOURITES_KEY, homeIds);
  return result;
}

export function openBrowserStore(): { store: KeyValueStoreType; notice: string | null } {
  try {
    const browserStore = window.localStorage;
    browserStore.setItem("stoep.probe", "1");
    browserStore.removeItem("stoep.probe");
    return { store: browserStore, notice: null };
  } catch {
    return { store: createMemoryStore(), notice: "This browser blocks local storage, so bookings and favourites only last until you close the tab." };
  }
}
