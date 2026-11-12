import { Link } from "react-router-dom";
import type { z } from "zod";
import { BookingCard } from "@/components/BookingCard";
import { useBookings, useToday } from "@/hooks/useAppStores";
import type { bookingSchema } from "@/lib/schemas/bookingSchema";

type BookingType = z.infer<typeof bookingSchema>;

function TripGroup({ title, bookings, canCancel }: { title: string; bookings: BookingType[]; canCancel: boolean }) {
  if (!bookings.length) return null;
  return (
    <section className="trip-group" aria-label={title}>
      <h2>{title}</h2>
      <ul className="booking-list">
        {bookings.map((booking) => (
          <li key={booking.ref}>
            <BookingCard booking={booking} canCancel={canCancel} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TripsPage() {
  const { bookings } = useBookings();
  const today = useToday();

  const byCheckIn = [...bookings].sort((first, second) => first.checkIn.localeCompare(second.checkIn));
  const upcoming = byCheckIn.filter((booking) => booking.status === "confirmed" && booking.checkIn >= today);
  const current = byCheckIn.filter((booking) => booking.status === "confirmed" && booking.checkIn < today && booking.checkOut > today);
  const past = byCheckIn.filter((booking) => booking.status === "confirmed" && booking.checkOut <= today);
  const cancelled = byCheckIn.filter((booking) => booking.status === "cancelled");

  return (
    <article className="list-page">
      <h1>My bookings</h1>
      {!bookings.length && (
        <div className="empty-state">
          <h2>No bookings yet</h2>
          <p>When you book a stay it shows up here, saved in this browser.</p>
          <Link to="/" className="button button-primary">
            Find a home
          </Link>
        </div>
      )}
      <TripGroup title="Upcoming" bookings={upcoming} canCancel />
      <TripGroup title="Happening now" bookings={current} canCancel={false} />
      <TripGroup title="Past" bookings={past} canCancel={false} />
      <TripGroup title="Cancelled" bookings={cancelled} canCancel={false} />
    </article>
  );
}
