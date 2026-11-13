import { Link } from "react-router-dom";
import type { z } from "zod";
import { FavouriteButton } from "@/components/FavouriteButton";
import { HomePhoto } from "@/components/HomePhoto";
import { Icon } from "@/components/Icon";
import { Rating } from "@/components/Rating";
import { formatWholeRand } from "@/lib/pricing";
import type { homeSchema } from "@/lib/schemas/homeSchema";

type HomeCardProps = {
  home: z.infer<typeof homeSchema>;
  linkSearch: string;
  isPriority?: boolean;
};

const CARD_PHOTO_SIZES = "(min-width: 90rem) 21rem, (min-width: 80rem) 25vw, (min-width: 48rem) 50vw, 100vw";

export function HomeCard({ home, linkSearch, isPriority = false }: HomeCardProps) {
  return (
    <article className="home-card">
      <div className="home-card-media">
        <HomePhoto homeId={home.id} sizes={CARD_PHOTO_SIZES} isPriority={isPriority} className="home-card-photo" />
        <FavouriteButton home={home} className="home-card-fav" />
      </div>
      <div className="home-card-body">
        <div className="home-card-top">
          <p className="home-card-town">
            <Icon name="pin" />
            {home.town}
          </p>
          <Rating value={home.rating} reviews={home.reviews} />
        </div>
        <h3 className="home-card-title">
          <Link to={{ pathname: `/stays/${home.id}`, search: linkSearch }} className="stretched-link">
            {home.title}
          </Link>
        </h3>
        <p className="home-card-tagline">{home.tagline}</p>
        <p className="home-card-meta">
          {home.maxGuests} guests · {home.bedrooms} bedroom{home.bedrooms === 1 ? "" : "s"}
        </p>
        <p className="home-card-price">
          <strong>{formatWholeRand(home.nightlyCents)}</strong> <span className="muted">/ night</span>
        </p>
      </div>
    </article>
  );
}
