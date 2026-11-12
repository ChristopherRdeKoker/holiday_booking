import { saveFavourites, type KeyValueStoreType } from "@/lib/storage";
import type { NoticeStoreType } from "@/state/noticeStore";
import { createObservable } from "@/state/observable";

export function createFavouriteStore(storage: KeyValueStoreType, initial: readonly string[], notices: NoticeStoreType) {
  const favourites = createObservable<ReadonlySet<string>>(new Set(initial));

  function toggle(homeId: string): void {
    const next = new Set(favourites.get());
    if (next.has(homeId)) next.delete(homeId);
    else next.add(homeId);
    favourites.set(next);

    const saveProblem = saveFavourites(storage, [...next]);
    if (saveProblem) notices.push(saveProblem);
  }

  const result = { subscribe: favourites.subscribe, getSnapshot: favourites.get, toggle };
  return result;
}

export type FavouriteStoreType = ReturnType<typeof createFavouriteStore>;
