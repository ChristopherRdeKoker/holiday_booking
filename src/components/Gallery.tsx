import { Link } from "react-router-dom";
import type { z } from "zod";
import { HomePhoto } from "@/components/HomePhoto";
import { findPhotoCredit } from "@/data/photoCredits";
import type { homeSchema } from "@/lib/schemas/homeSchema";

export function Gallery({ home }: { home: z.infer<typeof homeSchema> }) {
  const credit = findPhotoCredit(home.id);

  return (
    <figure className="gallery">
      <HomePhoto homeId={home.id} sizes="(min-width: 80rem) 64rem, 100vw" isPriority className="gallery-photo" />
      <figcaption className="gallery-caption">
        <p className="gallery-caption-subject">Pictured: {credit.subject}</p>
        <p className="gallery-caption-credit">
          Photo by {credit.author}, {credit.licence}. <Link to="/credits">Photo credits</Link>
        </p>
      </figcaption>
    </figure>
  );
}
