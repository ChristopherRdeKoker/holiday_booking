import type { z } from "zod";
import { Icon } from "@/components/Icon";
import type { homeSchema } from "@/lib/schemas/homeSchema";

function _countLabel(count: number, word: string): string {
  const result = `${count} ${word}${count === 1 ? "" : "s"}`;
  return result;
}

export function HomeFacts({ home }: { home: z.infer<typeof homeSchema> }) {
  return (
    <ul className="facts">
      <li>
        <Icon name="guests" />
        {_countLabel(home.maxGuests, "guest")}
      </li>
      <li>
        <Icon name="bed" />
        {_countLabel(home.bedrooms, "bedroom")}
      </li>
      <li>
        <Icon name="bath" />
        {_countLabel(home.baths, "bath")}
      </li>
    </ul>
  );
}
