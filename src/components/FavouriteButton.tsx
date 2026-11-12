import type { z } from "zod";
import { Icon } from "@/components/Icon";
import { useFavourites } from "@/hooks/useAppStores";
import { cn } from "@/lib/cn";
import type { homeSchema } from "@/lib/schemas/homeSchema";

export function FavouriteButton({ home, className }: { home: z.infer<typeof homeSchema>; className?: string }) {
  const { favourites, toggleFavourite } = useFavourites();
  const isSaved = favourites.has(home.id);
  return (
    <button type="button" className={cn("fav-button", isSaved && "is-saved", className)} aria-pressed={isSaved} aria-label={`Save ${home.title}`} onClick={() => toggleFavourite(home.id)}>
      <Icon name="heart" filled={isSaved} />
    </button>
  );
}
