import { Link } from "react-router-dom";
import { HomeCard } from "@/components/HomeCard";
import { homes } from "@/data/homes";
import { useFavourites } from "@/hooks/useAppStores";

export function SavedPage() {
  const { favourites } = useFavourites();
  const savedHomes = homes.filter((home) => favourites.has(home.id));
  return (
    <article className="list-page">
      <h1>Saved homes</h1>
      {!savedHomes.length && (
        <div className="empty-state">
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any home to keep it here.</p>
          <Link to="/" className="button button-primary">
            Browse homes
          </Link>
        </div>
      )}
      {!!savedHomes.length && (
        <ul className="home-grid">
          {savedHomes.map((home) => (
            <li key={home.id}>
              <HomeCard home={home} linkSearch="" />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
