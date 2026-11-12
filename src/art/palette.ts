import type { z } from "zod";
import type { sceneSchema } from "@/lib/schemas/homeSchema";

export type TimeOfDayType = "day" | "golden" | "dusk";

export type SkyColoursType = {
  top: string;
  bottom: string;
  sun: string;
};

export const skyColours: Record<TimeOfDayType, SkyColoursType> = {
  day: { top: "#7fb8de", bottom: "#d8ecf4", sun: "#fff3c4" },
  golden: { top: "#f2a65a", bottom: "#fde3b0", sun: "#fff1cc" },
  dusk: { top: "#25335c", bottom: "#c9798a", sun: "#f8e6c8" },
};

export type LandColoursType = {
  far: string;
  mid: string;
  near: string;
  ground: string;
  water: string;
};

export const landColours: Record<z.infer<typeof sceneSchema>, LandColoursType> = {
  coast: { far: "#9fb7b9", mid: "#c8b98f", near: "#d9c79c", ground: "#e8d9b0", water: "#3f8fa6" },
  mountain: { far: "#a98c6a", mid: "#c49a5c", near: "#7c9a5a", ground: "#8fae66", water: "#5d93ad" },
  karoo: { far: "#b9937a", mid: "#c99d6b", near: "#c8a97a", ground: "#dcc39a", water: "#6e9cb0" },
  forest: { far: "#5f7f6a", mid: "#3f6b4e", near: "#2e5a3c", ground: "#4f7a45", water: "#4f8a9a" },
  vineyard: { far: "#7f8fa3", mid: "#8daa6a", near: "#6f9450", ground: "#9cb873", water: "#5b92a8" },
  lagoon: { far: "#6f8f86", mid: "#557e66", near: "#6c9a5c", ground: "#a6b97c", water: "#3c86a0" },
  bushveld: { far: "#9aa27a", mid: "#b5a465", near: "#a59a5a", ground: "#cdb77c", water: "#5b8fa0" },
};

const timesOfDay: readonly TimeOfDayType[] = ["day", "golden", "dusk"];

export function timeOfDay(seed: number): TimeOfDayType {
  const result = timesOfDay[seed % 3];
  return result;
}

export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const c = (n >> shift) & 0xff;
    const target = amount < 0 ? 0 : 255;
    return Math.round(c + (target - c) * Math.abs(amount));
  };
  const result = `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
  return result;
}
