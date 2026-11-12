import { createContext, useContext, useState, type ReactNode } from "react";
import { homeIds } from "@/data/homes";
import { todayISO, type ISODateType } from "@/lib/dates";
import { loadBookings, loadFavourites, openBrowserStore, saveBookings, saveFavourites } from "@/lib/storage";
import { createBookingStore, type BookingStoreType } from "@/state/bookingStore";
import { createFavouriteStore, type FavouriteStoreType } from "@/state/favouriteStore";
import { createNoticeStore, type NoticeStoreType } from "@/state/noticeStore";

type AppStateType = {
  today: ISODateType;
  notices: NoticeStoreType;
  bookings: BookingStoreType;
  favourites: FavouriteStoreType;
};

const AppStateContext = createContext<AppStateType | null>(null);

function _bootstrap(now: Date): AppStateType {
  const { store, notice } = openBrowserStore();
  const loadedBookings = loadBookings(store, homeIds);
  const loadedFavourites = loadFavourites(store, homeIds);

  if (loadedBookings.notice) saveBookings(store, loadedBookings.items);
  if (loadedFavourites.notice) saveFavourites(store, loadedFavourites.items);

  const startupNotices: string[] = [];
  if (notice) startupNotices.push(notice);
  if (loadedBookings.notice) startupNotices.push(loadedBookings.notice);
  if (loadedFavourites.notice) startupNotices.push(loadedFavourites.notice);

  const notices = createNoticeStore(startupNotices);
  const result = {
    today: todayISO(now),
    notices,
    bookings: createBookingStore(store, loadedBookings.items, notices),
    favourites: createFavouriteStore(store, loadedFavourites.items, notices),
  };
  return result;
}

export function AppStateProvider({ now, children }: { now: Date; children: ReactNode }) {
  const [appState] = useState(() => _bootstrap(now));
  return <AppStateContext.Provider value={appState}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateType {
  const appState = useContext(AppStateContext);
  if (!appState) throw new Error("useAppState must be used inside AppStateProvider");
  return appState;
}
