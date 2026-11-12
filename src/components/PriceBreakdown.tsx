import { formatRand, VAT_RATE_PERCENT, type QuoteType } from "@/lib/pricing";

export function PriceBreakdown({ quote }: { quote: QuoteType }) {
  const nightsLabel = `${quote.nights} night${quote.nights === 1 ? "" : "s"}`;
  return (
    <dl className="price-breakdown">
      <div>
        <dt>
          {formatRand(quote.nightlyCents)} × {nightsLabel}
        </dt>
        <dd>{formatRand(quote.staySubtotalCents)}</dd>
      </div>
      <div>
        <dt>Cleaning fee</dt>
        <dd>{formatRand(quote.cleaningCents)}</dd>
      </div>
      <div>
        <dt>VAT ({VAT_RATE_PERCENT}%)</dt>
        <dd>{formatRand(quote.vatCents)}</dd>
      </div>
      <div className="price-total">
        <dt>Total</dt>
        <dd data-testid="price-total">{formatRand(quote.totalCents)}</dd>
      </div>
    </dl>
  );
}
