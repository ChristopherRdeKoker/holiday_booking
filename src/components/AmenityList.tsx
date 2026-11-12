import type { z } from "zod";
import { amenityIcons, amenityLabels, Icon } from "@/components/Icon";
import type { amenitySchema } from "@/lib/schemas/fieldSchemas";

export function AmenityList({ amenities }: { amenities: readonly z.infer<typeof amenitySchema>[] }) {
  return (
    <ul className="amenity-list">
      {amenities.map((amenity) => (
        <li key={amenity}>
          <Icon name={amenityIcons[amenity]} />
          {amenityLabels[amenity]}
        </li>
      ))}
    </ul>
  );
}
