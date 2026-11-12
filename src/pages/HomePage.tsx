import { Link, useParams } from "react-router-dom";
import { AmenityList } from "@/components/AmenityList";
import { BookingPanel } from "@/components/BookingPanel";
import { FavouriteButton } from "@/components/FavouriteButton";
import { Gallery } from "@/components/Gallery";
import { HomeFacts } from "@/components/HomeFacts";
import { Icon } from "@/components/Icon";
import { Rating } from "@/components/Rating";
import { findHome } from "@/data/homes";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function HomePage() {
  const { homeId } = useParams();
  const home = findHome(homeId);
  if (!home) return <NotFoundPage message="We couldn't find that home." />;

  return (
    <article className="detail">
      <Link to="/" className="back-link">
        <Icon name="chevronLeft" />
        All homes
      </Link>
      <header className="detail-head">
        <div className="detail-head-text">
          <p className="eyebrow">
            {home.town}, {home.province}
          </p>
          <h1>{home.title}</h1>
          <p className="detail-tagline">{home.tagline}</p>
          <Rating value={home.rating} reviews={home.reviews} />
        </div>
        <FavouriteButton home={home} className="detail-fav" />
      </header>
      <Gallery home={home} />
      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section">
            <HomeFacts home={home} />
            <p className="detail-description">{home.description}</p>
          </section>
          <section className="detail-section" aria-labelledby="amenities-heading">
            <h2 id="amenities-heading">What this place offers</h2>
            <AmenityList amenities={home.amenities} />
          </section>
        </div>
        <BookingPanel key={home.id} home={home} />
      </div>
    </article>
  );
}
