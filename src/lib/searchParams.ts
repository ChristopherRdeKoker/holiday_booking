import type { z } from "zod";
import type { ISODateType } from "@/lib/dates";
import { createSearchFormSchema, type SearchFormSchemaType } from "@/lib/schemas/searchFormSchema";

export const defaultSearch: z.infer<SearchFormSchemaType> = {
  q: "",
  town: "",
  checkIn: "",
  checkOut: "",
  guests: 1,
  minPrice: "",
  maxPrice: "",
  amenities: [],
  sort: "recommended",
};

export function readSearchParams(params: URLSearchParams, today: ISODateType): { search: z.infer<SearchFormSchemaType>; isInvalid: boolean } {
  const parsed = createSearchFormSchema(today).safeParse({
    q: params.get("q") ?? "",
    town: params.get("town") ?? "",
    checkIn: params.get("checkIn") ?? "",
    checkOut: params.get("checkOut") ?? "",
    guests: params.get("guests") ?? "1",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    amenities: params.getAll("amenity"),
    sort: params.get("sort") ?? "recommended",
  });
  const result = parsed.success ? { search: parsed.data, isInvalid: false } : { search: defaultSearch, isInvalid: true };
  return result;
}

export function writeSearchParams(search: z.infer<SearchFormSchemaType>): URLSearchParams {
  const result = new URLSearchParams();
  const query = search.q.trim();
  const hasDates = !!search.checkIn.length && !!search.checkOut.length;

  if (query.length) result.set("q", query);
  if (search.town.length) result.set("town", search.town);
  if (hasDates) result.set("checkIn", search.checkIn);
  if (hasDates) result.set("checkOut", search.checkOut);
  if (search.guests !== defaultSearch.guests) result.set("guests", String(search.guests));
  if (search.minPrice !== "") result.set("minPrice", String(search.minPrice));
  if (search.maxPrice !== "") result.set("maxPrice", String(search.maxPrice));
  for (const amenity of search.amenities) result.append("amenity", amenity);
  if (search.sort !== defaultSearch.sort) result.set("sort", search.sort);
  return result;
}

export function countExtraFilters(search: z.infer<SearchFormSchemaType>): number {
  const hasPrice = search.minPrice !== "" || search.maxPrice !== "";
  const hasSort = search.sort !== defaultSearch.sort;
  const result = search.amenities.length + Number(hasPrice) + Number(hasSort);
  return result;
}
