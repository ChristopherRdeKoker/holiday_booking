import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { z } from "zod";
import { GuestDetailsForm } from "@/components/GuestDetailsForm";
import { Icon } from "@/components/Icon";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { StaySummary } from "@/components/StaySummary";
import { findHome } from "@/data/homes";
import { useBookings } from "@/hooks/useAppStores";
import { useHomeAvailability } from "@/hooks/useHomeAvailability";
import { checkRange, problemMessage } from "@/lib/availability";
import { bookingProblemMessage } from "@/lib/bookingProblems";
import { nightsBetween } from "@/lib/dates";
import { quote } from "@/lib/pricing";
import type { guestDetailsSchema } from "@/lib/schemas/guestDetailsSchema";
import type { homeSchema } from "@/lib/schemas/homeSchema";
import { NotFoundPage } from "@/pages/NotFoundPage";

function BookingForm({ home }: { home: z.infer<typeof homeSchema> }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { createBooking } = useBookings();
  const { today, blocked } = useHomeAvailability(home);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stay = { checkIn: params.get("checkIn") ?? "", checkOut: params.get("checkOut") ?? "" };
  const requestedGuests = Math.min(Math.max(Number(params.get("guests")) || 1, 1), home.maxGuests);
  const problem = checkRange(stay, today, blocked);

  function handleConfirm(details: z.output<typeof guestDetailsSchema>) {
    const outcome = createBooking(home.id, stay, details, today);
    if (outcome.booking) navigate(`/trip/${outcome.booking.ref}`, { state: { isNew: true } });
    if (outcome.problem) setSubmitError(bookingProblemMessage(outcome.problem));
  }

  if (problem) {
    return (
      <section className="refusal" role="alert" data-testid="booking-refused">
        <h1>These dates can't be booked</h1>
        <p>{problemMessage(problem)}</p>
        <Link to={`/stays/${home.id}`} className="button button-primary">
          Pick other dates
        </Link>
      </section>
    );
  }

  const price = quote(home.nightlyCents, nightsBetween(stay.checkIn, stay.checkOut), home.cleaningCents);
  return (
    <>
      <h1>Confirm your stay</h1>
      <div className="book-layout">
        <section className="book-summary" aria-labelledby="summary-heading">
          <h2 id="summary-heading">Your trip</h2>
          <StaySummary home={home} checkIn={stay.checkIn} checkOut={stay.checkOut} guests={requestedGuests} />
          <PriceBreakdown quote={price} />
        </section>
        <div className="book-form">
          <GuestDetailsForm maxGuests={home.maxGuests} initialGuests={requestedGuests} onConfirm={handleConfirm} />
          {submitError && (
            <p className="field-error" role="alert" data-testid="booking-error">
              {submitError}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export function BookPage() {
  const { homeId } = useParams();
  const home = findHome(homeId);
  if (!home) return <NotFoundPage message="We couldn't find that home." />;

  return (
    <article className="book-page">
      <Link to={`/stays/${home.id}`} className="back-link">
        <Icon name="chevronLeft" />
        Back to {home.title}
      </Link>
      <BookingForm home={home} />
    </article>
  );
}
