import { Link } from "react-router-dom";
import type { z } from "zod";
import { CancelBookingButton } from "@/components/CancelBookingButton";
import { HomePhoto } from "@/components/HomePhoto";
import { findHome } from "@/data/homes";
import { useBookings } from "@/hooks/useAppStores";
import { cn } from "@/lib/cn";
import { formatDate, nightsBetween } from "@/lib/dates";
import { formatRand } from "@/lib/pricing";
import type { bookingSchema } from "@/lib/schemas/bookingSchema";

export function BookingCard({ booking, canCancel }: { booking: z.infer<typeof bookingSchema>; canCancel: boolean }) {
  const { cancelBooking } = useBookings();
  const home = findHome(booking.homeId);
  if (!home) return null;

  const isCancelled = booking.status === "cancelled";
  const nights = nightsBetween(booking.checkIn, booking.checkOut);

  return (
    <article className={cn("booking-row", isCancelled && "is-cancelled")} data-testid="booking-row" data-ref={booking.ref}>
      <HomePhoto homeId={home.id} sizes="(min-width: 48rem) 13.5rem, 100vw" isDecorative className="booking-row-photo" />
      <div className="booking-row-body">
        <div className="booking-row-head">
          <h3>
            <Link to={`/trip/${booking.ref}`}>{home.title}</Link>
          </h3>
          {isCancelled && <p className="status-pill">Cancelled</p>}
        </div>
        <p className="muted">
          {home.town} · {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)} · {nights} night{nights === 1 ? "" : "s"} · {booking.guests} guest
          {booking.guests === 1 ? "" : "s"}
        </p>
        <p className="booking-row-meta">
          <span className="mono">{booking.ref}</span> · {formatRand(booking.totalCents)}
        </p>
        {canCancel && <CancelBookingButton title={home.title} onCancel={() => cancelBooking(booking.ref)} />}
      </div>
    </article>
  );
}
