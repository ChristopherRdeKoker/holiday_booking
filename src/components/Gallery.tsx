import { useState } from "react";
import type { z } from "zod";
import { artViewLabels, artViews, HomeArt, type ArtViewType } from "@/art/HomeArt";
import { cn } from "@/lib/cn";
import type { homeSchema } from "@/lib/schemas/homeSchema";

export function Gallery({ home }: { home: z.infer<typeof homeSchema> }) {
  const [activeView, setActiveView] = useState<ArtViewType>("exterior");
  return (
    <section className="gallery" aria-label="Pictures">
      <figure className="gallery-main">
        <HomeArt home={home} view={activeView} className="gallery-art" />
        <figcaption className="gallery-caption">{artViewLabels[activeView]}</figcaption>
      </figure>
      <div className="gallery-thumbs" role="group" aria-label="Choose a picture">
        {artViews.map((view) => (
          <button
            key={view}
            type="button"
            className={cn("gallery-thumb", view === activeView && "is-active")}
            aria-pressed={view === activeView}
            aria-label={`Show ${artViewLabels[view].toLowerCase()}`}
            onClick={() => setActiveView(view)}
          >
            <HomeArt home={home} view={view} decorative className="gallery-thumb-art" />
          </button>
        ))}
      </div>
    </section>
  );
}
