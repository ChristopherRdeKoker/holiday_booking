import { Icon } from "@/components/Icon";

export function Rating({ value, reviews }: { value: number; reviews: number }) {
  return (
    <p className="rating">
      <Icon name="star" filled className="rating-star" />
      <span className="visually-hidden">Rated </span>
      {value.toFixed(2)}
      <span className="visually-hidden"> out of 5,</span>
      <span className="muted"> ({reviews}<span className="visually-hidden"> reviews</span>)</span>
    </p>
  );
}
