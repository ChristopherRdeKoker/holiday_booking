import { useId } from "react";
import type { z } from "zod";
import { House } from "@/art/Houses";
import { Bedroom, LivingRoom, StoepView } from "@/art/Interiors";
import { Landscape } from "@/art/Landscape";
import { timeOfDay } from "@/art/palette";
import { Sky } from "@/art/Sky";
import type { homeSchema } from "@/lib/schemas/homeSchema";

type HomeType = z.infer<typeof homeSchema>;

export const artViews = ["exterior", "stoep", "living", "bedroom"] as const;
export type ArtViewType = (typeof artViews)[number];

export const artViewLabels: Record<ArtViewType, string> = {
  exterior: "Outside",
  stoep: "View from the stoep",
  living: "Living room",
  bedroom: "Bedroom",
};

const ART_WIDTH = 480;
const ART_HEIGHT = 320;

type HomeArtProps = {
  home: HomeType;
  view?: ArtViewType;
  className?: string;
  decorative?: boolean;
};

function Outdoors({ home, idPrefix, horizon }: { home: HomeType; idPrefix: string; horizon: number }) {
  const { scene, seed } = home.art;
  return (
    <g>
      <Sky idPrefix={idPrefix} time={timeOfDay(seed)} seed={seed} width={ART_WIDTH} height={ART_HEIGHT} />
      <Landscape scene={scene} seed={seed} horizon={horizon} width={ART_WIDTH} height={ART_HEIGHT} />
    </g>
  );
}

export function HomeArt({ home, view = "exterior", className, decorative = false }: HomeArtProps) {
  const idPrefix = `art${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { art } = home;
  const lit = timeOfDay(art.seed) === "dusk";
  const colours = { wall: art.wall, roof: art.roof, accent: art.accent };
  const label = `${artViewLabels[view]} illustration of ${home.title}, ${home.town}`;
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "img", "aria-label": label };

  return (
    <svg viewBox={`0 0 ${ART_WIDTH} ${ART_HEIGHT}`} className={className} preserveAspectRatio="xMidYMid slice" focusable="false" {...a11y}>
      {view === "exterior" && (
        <g>
          <Outdoors home={home} idPrefix={idPrefix} horizon={190} />
          <g transform={`translate(${ART_WIDTH / 2 + ((art.seed % 5) - 2) * 18} ${ART_HEIGHT - 34}) scale(0.95)`}>
            <House style={art.house} colours={{ ...colours, lit }} />
          </g>
        </g>
      )}
      {view === "stoep" && <StoepView colours={colours} view={<Outdoors home={home} idPrefix={idPrefix} horizon={176} />} />}
      {view === "living" && <LivingRoom colours={colours} lit={lit} view={<Outdoors home={home} idPrefix={`${idPrefix}w`} horizon={190} />} />}
      {view === "bedroom" && <Bedroom colours={colours} lit={lit} view={<Outdoors home={home} idPrefix={`${idPrefix}w`} horizon={190} />} />}
    </svg>
  );
}
