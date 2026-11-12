import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FieldError } from "@/components/FieldError";
import { amenityLabels, Icon } from "@/components/Icon";
import { towns } from "@/data/homes";
import { addDays, type ISODateType } from "@/lib/dates";
import { amenitySchema } from "@/lib/schemas/fieldSchemas";
import { createSearchFormSchema, sortSchema, type SearchFormSchemaType } from "@/lib/schemas/searchFormSchema";
import { countExtraFilters, defaultSearch } from "@/lib/searchParams";

type SearchPanelProps = {
  search: z.infer<SearchFormSchemaType>;
  today: ISODateType;
  onSearch: (search: z.infer<SearchFormSchemaType>) => void;
};

const sortLabels: Record<z.infer<typeof sortSchema>, string> = {
  recommended: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

const guestOptions = Array.from({ length: 10 }, (_, index) => index + 1);

function _formValues(search: z.infer<SearchFormSchemaType>): z.input<SearchFormSchemaType> {
  const result = {
    ...search,
    guests: String(search.guests),
    minPrice: String(search.minPrice),
    maxPrice: String(search.maxPrice),
  };
  return result;
}

export function SearchPanel({ search, today, onSearch }: SearchPanelProps) {
  const searchSchema = useMemo(() => createSearchFormSchema(today), [today]);
  const formMethods = useForm<z.input<SearchFormSchemaType>, unknown, z.output<SearchFormSchemaType>>({
    resolver: zodResolver(searchSchema),
    defaultValues: _formValues(search),
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = formMethods;

  const checkIn = watch("checkIn");
  const extraFilterCount = countExtraFilters(search);
  const earliestCheckOut = addDays(checkIn || today, 1);

  function handleClearAll() {
    reset(_formValues(defaultSearch));
    onSearch(defaultSearch);
  }

  return (
    <form className="search-panel" role="search" aria-label="Find a home" noValidate onSubmit={handleSubmit(onSearch)}>
      <div className="search-grid">
        <div className="field field-where">
          <label htmlFor="q">Where</label>
          <input id="q" type="search" placeholder="Town, home or vibe" autoComplete="off" {...register("q")} />
        </div>
        <div className="field">
          <label htmlFor="town">Town</label>
          <select id="town" {...register("town")}>
            <option value="">Anywhere</option>
            {towns.map((town) => (
              <option key={town} value={town}>
                {town}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="checkIn">Check-in</label>
          <input id="checkIn" type="date" min={today} aria-invalid={!!errors.checkIn} aria-describedby="err-checkIn" {...register("checkIn")} />
          <FieldError id="err-checkIn" message={errors.checkIn?.message} />
        </div>
        <div className="field">
          <label htmlFor="checkOut">Check-out</label>
          <input id="checkOut" type="date" min={earliestCheckOut} aria-invalid={!!errors.checkOut} aria-describedby="err-checkOut" {...register("checkOut")} />
          <FieldError id="err-checkOut" message={errors.checkOut?.message} />
        </div>
        <div className="field">
          <label htmlFor="guests">Guests</label>
          <select id="guests" {...register("guests")}>
            {guestOptions.map((count) => (
              <option key={count} value={String(count)}>
                {count} {count === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="button button-primary search-submit">
          <Icon name="search" />
          Search
        </button>
      </div>
      <details className="filters" open={!!extraFilterCount || undefined}>
        <summary>
          <Icon name="sliders" />
          More filters{!!extraFilterCount && ` (${extraFilterCount})`}
        </summary>
        <div className="filters-body">
          <fieldset className="price-fields">
            <legend>Price per night (R)</legend>
            <div className="field">
              <label htmlFor="minPrice">Min</label>
              <input id="minPrice" inputMode="numeric" placeholder="0" aria-invalid={!!errors.minPrice} aria-describedby="err-minPrice" {...register("minPrice")} />
              <FieldError id="err-minPrice" message={errors.minPrice?.message} />
            </div>
            <div className="field">
              <label htmlFor="maxPrice">Max</label>
              <input id="maxPrice" inputMode="numeric" placeholder="Any" aria-invalid={!!errors.maxPrice} aria-describedby="err-maxPrice" {...register("maxPrice")} />
              <FieldError id="err-maxPrice" message={errors.maxPrice?.message} />
            </div>
          </fieldset>
          <fieldset className="amenity-fields">
            <legend>Amenities</legend>
            <div className="chip-grid">
              {amenitySchema.options.map((amenity) => (
                <label key={amenity} className="chip">
                  <input type="checkbox" value={amenity} {...register("amenities")} />
                  <span>{amenityLabels[amenity]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field field-sort">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" {...register("sort")}>
              {sortSchema.options.map((sort) => (
                <option key={sort} value={sort}>
                  {sortLabels[sort]}
                </option>
              ))}
            </select>
          </div>
          <div className="filters-actions">
            <button type="button" className="button button-ghost" onClick={handleClearAll}>
              Clear all
            </button>
            <button type="submit" className="button button-primary" disabled={!isDirty}>
              Apply filters
            </button>
          </div>
        </div>
      </details>
    </form>
  );
}
