import type { z } from "zod";
import { HomePhoto } from "@/components/HomePhoto";
import { formatDate, nightsBetween, type ISODateType } from "@/lib/dates";
import type { homeSchema } from "@/lib/schemas/homeSchema";

type StaySummaryProps = {
  home: z.infer<typeof homeSchema>;
  checkIn: ISODateType;
  checkOut: ISODateType;
  guests: number;
};

export function StaySummary({ home, checkIn, checkOut, guests }: StaySummaryProps) {
  const nights = nightsBetween(checkIn, checkOut);
  return (
    <div className="stay-summary">
      <HomePhoto homeId={home.id} sizes="10.5rem" isDecorative className="stay-summary-photo" />
      <div className="stay-summary-text">
        <p className="eyebrow">{home.town}</p>
        <h3>{home.title}</h3>
        <dl className="stay-facts">
          <div>
            <dt>Check-in</dt>
            <dd>{formatDate(checkIn, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</dd>
          </div>
          <div>
            <dt>Check-out</dt>
            <dd>{formatDate(checkOut, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</dd>
          </div>
          <div>
            <dt>Nights</dt>
            <dd>{nights}</dd>
          </div>
          <div>
            <dt>Guests</dt>
            <dd>{guests}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
