import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { z } from "zod";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { useHomeAvailability } from "@/hooks/useHomeAvailability";
import { checkRange, problemMessage, type DateRangeType } from "@/lib/availability";
import { emptySelection, type StaySelectionType } from "@/lib/calendarDays";
import { formatDate, isISODate, nightsBetween } from "@/lib/dates";
import { formatWholeRand, quote } from "@/lib/pricing";
import type { homeSchema } from "@/lib/schemas/homeSchema";

function _selectionFromParams(params: URLSearchParams, isFree: (stay: DateRangeType) => boolean): StaySelectionType {
  const stay = { checkIn: params.get("checkIn") ?? "", checkOut: params.get("checkOut") ?? "" };
  const isUsable = isISODate(stay.checkIn) && isISODate(stay.checkOut) && isFree(stay);
  const result = isUsable ? stay : emptySelection;
  return result;
}

export function BookingPanel({ home }: { home: z.infer<typeof homeSchema> }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { today, blocked, nights } = useHomeAvailability(home);

  const [selection, setSelection] = useState(() => _selectionFromParams(params, (stay) => checkRange(stay, today, blocked) === null));
  const [guests, setGuests] = useState(() => Math.min(Math.max(Number(params.get("guests")) || 1, 1), home.maxGuests));

  const stay = { checkIn: selection.checkIn, checkOut: selection.checkOut };
  const hasStay = !!stay.checkIn.length && !!stay.checkOut.length;
  const problem = hasStay ? checkRange(stay, today, blocked) : null;
  const price = useMemo(
    () => (hasStay && !problem ? quote(home.nightlyCents, nightsBetween(selection.checkIn, selection.checkOut), home.cleaningCents) : null),
    [hasStay, problem, selection, home],
  );
  const guestOptions = Array.from({ length: home.maxGuests }, (_, index) => index + 1);

  function handleReserve() {
    const bookingParams = new URLSearchParams({ checkIn: selection.checkIn, checkOut: selection.checkOut, guests: String(guests) });
    navigate(`/book/${home.id}?${bookingParams.toString()}`);
  }

  return (
    <>
      <section className="detail-section detail-calendar" aria-labelledby="availability-heading">
        <h2 id="availability-heading">Availability</h2>
        <p className="muted">Struck-through nights are already booked. You can check out on the morning another stay begins.</p>
        <AvailabilityCalendar today={today} nights={nights} selection={selection} onSelect={setSelection} />
      </section>
      <aside className="booking-card" aria-labelledby="booking-heading">
        <h2 id="booking-heading" className="booking-card-price">
          <strong>{formatWholeRand(home.nightlyCents)}</strong> <span className="muted">/ night</span>
        </h2>
        <div className="booking-dates">
          <div>
            <p className="label">Check-in</p>
            <p data-testid="selected-check-in">{selection.checkIn ? formatDate(selection.checkIn) : "Add date"}</p>
          </div>
          <div>
            <p className="label">Check-out</p>
            <p data-testid="selected-check-out">{selection.checkOut ? formatDate(selection.checkOut) : "Add date"}</p>
          </div>
        </div>
        <div className="field">
          <label htmlFor="panel-guests">Guests</label>
          <select id="panel-guests" value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
            {guestOptions.map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
        {price && <PriceBreakdown quote={price} />}
        {problem && (
          <p className="field-error" role="alert">
            {problemMessage(problem)}
          </p>
        )}
        <button type="button" className="button button-primary button-block" disabled={!price} onClick={handleReserve}>
          {price ? "Reserve" : "Choose dates to reserve"}
        </button>
        {!!selection.checkIn.length && (
          <button type="button" className="button button-ghost button-block" onClick={() => setSelection(emptySelection)}>
            Clear dates
          </button>
        )}
        <p className="fine-print">You won't be charged. This is a demo.</p>
      </aside>
    </>
  );
}
