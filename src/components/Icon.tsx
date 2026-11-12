import type { z } from "zod";
import { cn } from "@/lib/cn";
import type { amenitySchema } from "@/lib/schemas/fieldSchemas";

type AmenityType = z.infer<typeof amenitySchema>;

const iconPaths = {
  heart: "M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z",
  star: "M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z",
  guests: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-6.5 9c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16.5 11a3 3 0 1 0-1-5.8M18 14.2c2 .7 3.5 2.6 3.5 5.3",
  bed: "M3 18V6m0 8h18v4m0-4v-2a3 3 0 0 0-3-3h-7v5M7 11.5a1.5 1.5 0 1 0 0-.01",
  bath: "M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zm2 0V6a2 2 0 0 1 3.6-1.2M7 19l-1 2m12-2 1 2",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  calendar: "M4 6.5h16v13H4zM4 10.5h16M8 4v4m8-4v4",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zm4.8-1.7L20 20",
  home: "M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5M10 20v-5h4v5",
  suitcase: "M4 8h16v11H4zM9 8V5.5h6V8M4 13h16",
  chevronLeft: "M15 5l-7 7 7 7",
  chevronRight: "M9 5l7 7-7 7",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6 6 18",
  sliders: "M4 7h10m4 0h2M4 17h4m4 0h8M16 5v4M10 15v4",
  wifi: "M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01",
  pool: "M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2.5-1.5 4.5-1.5S19 17 21 17M3 20.5c2 0 2-1.5 4.5-1.5s2 1.5 4.5 1.5 2.5-1.5 4.5-1.5 2.5 1.5 4.5 1.5M8 14V5.5a2 2 0 0 1 4 0M16 14V5.5a2 2 0 0 0-4 0M8 9h8",
  braai: "M4 10h16a8 8 0 0 1-16 0zM8 18l-2 3m10-3 2 3M9 7c0-1.5 1-1.5 1-3m4 3c0-1.5 1-1.5 1-3",
  fireplace: "M3 20V5h18v15M7 20v-7h10v7M12 19c-2 0-2.5-1.6-2-3 .4-1 1.5-1.5 2-3 .5 1.5 2.5 2.5 2.5 4 0 1.2-1 2-2.5 2z",
  wave: "M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2",
  mountain: "M2 20 9 7l4 7 2.5-4L22 20zM7.5 10l1.5 1.5L11 10",
  paw: "M8 9.5a1.8 2.3 0 1 0 0-.01M16 9.5a1.8 2.3 0 1 0 0-.01M4.5 13a1.6 2 0 1 0 0-.01M19.5 13a1.6 2 0 1 0 0-.01M12 13c-3 0-5 3.5-4 5.5s3 .5 4 .5 3 1.5 4-.5-1-5.5-4-5.5z",
  car: "M5 16.5V12l2-5h10l2 5v4.5M3.5 16.5h17M7 19.5v-3m10 3v-3M5 12h14",
  snow: "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 6l2.5-1.5M9.5 19.5 12 18l2.5 1.5",
  tub: "M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM7 9c0-2 1.5-2 1.5-4M11.5 9c0-2 1.5-2 1.5-4M16 9c0-2 1.5-2 1.5-4",
  kitchen: "M7 3v8a2 2 0 0 1-2 2v8M7 3v6M5 3v6m4-6v6M16 21V3c2.5 1.5 3.5 4 3.5 8H16",
  laptop: "M5 6h14v9H5zM3 18h18",
  sun: "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8",
} as const;

export type IconNameType = keyof typeof iconPaths;

export const amenityIcons: Record<AmenityType, IconNameType> = {
  wifi: "wifi",
  pool: "pool",
  braai: "braai",
  fireplace: "fireplace",
  "sea-view": "wave",
  "mountain-view": "mountain",
  "pet-friendly": "paw",
  parking: "car",
  aircon: "snow",
  "hot-tub": "tub",
  kitchen: "kitchen",
  workspace: "laptop",
};

export const amenityLabels: Record<AmenityType, string> = {
  wifi: "Wi-Fi",
  pool: "Pool",
  braai: "Braai",
  fireplace: "Fireplace",
  "sea-view": "Sea view",
  "mountain-view": "Mountain view",
  "pet-friendly": "Pet friendly",
  parking: "Parking",
  aircon: "Air-con",
  "hot-tub": "Hot tub",
  kitchen: "Full kitchen",
  workspace: "Workspace",
};

export function Icon({ name, className, filled = false }: { name: IconNameType; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("icon", className)} aria-hidden="true" focusable="false">
      <path d={iconPaths[name]} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
