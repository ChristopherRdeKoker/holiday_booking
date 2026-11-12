import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { z } from "zod";
import { HomeCard } from "@/components/HomeCard";
import { SearchPanel } from "@/components/SearchPanel";
import { homes } from "@/data/homes";
import { useBookings, useToday } from "@/hooks/useAppStores";
import { formatDate, nightsBetween } from "@/lib/dates";
import { filterHomes } from "@/lib/filterHomes";
import type { SearchFormSchemaType } from "@/lib/schemas/searchFormSchema";
import { defaultSearch, readSearchParams, writeSearchParams } from "@/lib/searchParams";

function _stayQuery(search: z.infer<SearchFormSchemaType>): string {
  const params = new URLSearchParams();
  if (search.checkIn && search.checkOut) params.set("checkIn", search.checkIn);
  if (search.checkIn && search.checkOut) params.set("checkOut", search.checkOut);
  if (search.guests > 1) params.set("guests", String(search.guests));

  const query = params.toString();
  const result = query ? `?${query}` : "";
  return result;
}

export function BrowsePage() {
  const [params, setParams] = useSearchParams();
  const today = useToday();
  const { bookings } = useBookings();

  const { search, isInvalid } = useMemo(() => readSearchParams(params, today), [params, today]);
  const results = useMemo(() => filterHomes(homes, search, today, bookings), [search, today, bookings]);
  const hasDates = !!search.checkIn.length && !!search.checkOut.length;
  const homesLabel = results.length === 1 ? "home" : "homes";

  function handleSearch(next: z.infer<SearchFormSchemaType>) {
    setParams(writeSearchParams(next));
  }

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Holiday homes across South Africa</p>
          <h1>Find your stoep.</h1>
          <p className="hero-lede">Twelve hand-picked, entirely imaginary places to slow down: West Coast lofts, Karoo stoeps, forest cabins and lagoon houses.</p>
        </div>
        <SearchPanel key={params.toString()} search={search} today={today} onSearch={handleSearch} />
      </section>

      <section className="results" aria-labelledby="results-heading">
        <div className="results-head">
          <h2 id="results-heading" data-testid="results-count">
            {results.length} {homesLabel}
            {search.town && ` in ${search.town}`}
          </h2>
          {hasDates && (
            <p className="muted">
              Free {formatDate(search.checkIn)} – {formatDate(search.checkOut)} · {nightsBetween(search.checkIn, search.checkOut)} nights
            </p>
          )}
        </div>
        {isInvalid && (
          <p className="inline-notice" role="status">
            That search link had invalid values, so all homes are shown instead.
          </p>
        )}
        {!results.length && (
          <div className="empty-state">
            <h3>No homes match those filters</h3>
            <p>Try different dates, fewer amenities or a wider price range.</p>
            <button type="button" className="button button-primary" onClick={() => handleSearch(defaultSearch)}>
              Clear all filters
            </button>
          </div>
        )}
        {!!results.length && (
          <ul className="home-grid">
            {results.map((home) => (
              <li key={home.id}>
                <HomeCard home={home} linkSearch={_stayQuery(search)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
