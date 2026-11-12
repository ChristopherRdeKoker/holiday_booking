import { useSyncExternalStore } from "react";
import { useAppState } from "@/state/AppStateContext";

export function useToday() {
  const { today } = useAppState();
  return today;
}

export function useBookings() {
  const { bookings } = useAppState();
  const list = useSyncExternalStore(bookings.subscribe, bookings.getSnapshot);
  const result = { bookings: list, createBooking: bookings.create, cancelBooking: bookings.cancel };
  return result;
}

export function useFavourites() {
  const { favourites } = useAppState();
  const set = useSyncExternalStore(favourites.subscribe, favourites.getSnapshot);
  const result = { favourites: set, toggleFavourite: favourites.toggle };
  return result;
}

export function useNotices() {
  const { notices } = useAppState();
  const list = useSyncExternalStore(notices.subscribe, notices.getSnapshot);
  const result = { notices: list, dismissNotice: notices.dismiss };
  return result;
}
