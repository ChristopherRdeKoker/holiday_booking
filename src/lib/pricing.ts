export const VAT_RATE_PERCENT = 15;

export type QuoteType = {
  nights: number;
  nightlyCents: number;
  staySubtotalCents: number;
  cleaningCents: number;
  exVatCents: number;
  vatCents: number;
  totalCents: number;
};

function _requireWholeCount(name: string, value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative integer, got ${value}`);
}

export function quote(nightlyCents: number, nights: number, cleaningCents: number): QuoteType {
  _requireWholeCount("nightlyCents", nightlyCents);
  _requireWholeCount("nights", nights);
  _requireWholeCount("cleaningCents", cleaningCents);
  if (nights < 1) throw new RangeError("A stay needs at least one night");

  const staySubtotalCents = nightlyCents * nights;
  const exVatCents = staySubtotalCents + cleaningCents;
  const vatCents = Math.round((exVatCents * VAT_RATE_PERCENT) / 100);

  const result = { nights, nightlyCents, staySubtotalCents, cleaningCents, exVatCents, vatCents, totalCents: exVatCents + vatCents };
  return result;
}

const randFormatter = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const wholeRandFormatter = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0, maximumFractionDigits: 0 });

export function formatRand(cents: number): string {
  const result = randFormatter.format(cents / 100);
  return result;
}

export function formatWholeRand(cents: number): string {
  const result = wholeRandFormatter.format(Math.round(cents / 100));
  return result;
}
