import { Link, useLocation, useParams } from "react-router-dom";
import { CancelBookingButton } from "@/components/CancelBookingButton";
import { Icon } from "@/components/Icon";
import { StaySummary } from "@/components/StaySummary";
import { findHome } from "@/data/homes";
import { useBookings, useToday } from "@/hooks/useAppStores";
import { cn } from "@/lib/cn";
import { formatRand } from "@/lib/pricing";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function TripPage() {
  const { reference } = useParams();
  const location = useLocation();
  const today = useToday();
  const { bookings, cancelBooking } = useBookings();
  const booking = bookings.find((candidate) => candidate.ref === reference);
  const home = booking && findHome(booking.homeId);
  if (!booking || !home) return <NotFoundPage message="We couldn't find that booking in this browser." />;

  const isCancelled = booking.status === "cancelled";
  const isNew = location.state?.isNew === true && !isCancelled;
  const canCancel = !isCancelled && booking.checkIn >= today;
  const heading = isNew ? "You're booked!" : "Your trip";

  return (
    <article className="trip-page">
      <div className={cn("trip-banner", isCancelled && "is-cancelled")}>
        <Icon name={isCancelled ? "close" : "check"} className="trip-banner-icon" />
        <div>
          <h1 data-testid="trip-heading">{isCancelled ? "Booking cancelled" : heading}</h1>
          <p>
            Reference <strong className="mono" data-testid="booking-ref">{booking.ref}</strong>
          </p>
        </div>
      </div>
      <StaySummary home={home} checkIn={booking.checkIn} checkOut={booking.checkOut} guests={booking.guests} />
      <dl className="trip-facts">
        <div>
          <dt>Booked for</dt>
          <dd>{booking.name}</dd>
        </div>
        <div>
          <dt>Confirmation sent to</dt>
          <dd>{booking.email} (not really, it's a demo)</dd>
        </div>
        <div>
          <dt>Total incl. VAT</dt>
          <dd>{formatRand(booking.totalCents)}</dd>
        </div>
      </dl>
      <div className="trip-actions">
        <Link to="/bookings" className="button button-primary">
          My bookings
        </Link>
        {canCancel && <CancelBookingButton title={home.title} onCancel={() => cancelBooking(booking.ref)} />}
      </div>
    </article>
  );
}
