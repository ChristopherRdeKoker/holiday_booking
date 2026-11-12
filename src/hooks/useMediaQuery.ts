import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (listener: () => void) => {
      const mediaList = window.matchMedia(query);
      mediaList.addEventListener("change", listener);
      return () => mediaList.removeEventListener("change", listener);
    },
    [query],
  );
  const matches = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
  return matches;
}
