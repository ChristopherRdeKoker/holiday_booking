import type { ReactElement } from "react";
import type { z } from "zod";
import { shade } from "@/art/palette";
import type { houseStyleSchema } from "@/lib/schemas/homeSchema";

export type HouseColoursType = {
  wall: string;
  roof: string;
  accent: string;
  lit: boolean;
};

function _glass(lit: boolean): string {
  const result = lit ? "#ffd77a" : "#bcd7e3";
  return result;
}

function Window({ x, y, w, h, c }: { x: number; y: number; w: number; h: number; c: HouseColoursType }) {
  return (
    <g>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} fill={shade(c.wall, -0.35)} />
      <rect x={x} y={y} width={w} height={h} fill={_glass(c.lit)} />
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} stroke={shade(c.wall, -0.35)} strokeWidth="2" />
    </g>
  );
}

function Stoep({ x, w, c }: { x: number; w: number; c: HouseColoursType }) {
  return (
    <g>
      <rect x={x} y={-8} width={w} height={8} fill={shade(c.wall, -0.25)} />
      {Array.from({ length: Math.floor(w / 14) + 1 }, (_, i) => (
        <rect key={i} x={x + i * 14} y={-22} width={2.5} height={14} fill={shade(c.wall, -0.4)} />
      ))}
      <rect x={x} y={-24} width={w} height={3} fill={shade(c.wall, -0.4)} />
    </g>
  );
}

const houses: Record<z.infer<typeof houseStyleSchema>, (c: HouseColoursType) => ReactElement> = {
  cottage: (c) => (
    <g>
      <rect x="-70" y="-78" width="140" height="78" fill={c.wall} />
      <path d="M-82 -76 L0 -132 L82 -76 Z" fill={c.roof} />
      <rect x="34" y="-128" width="14" height="34" fill={shade(c.wall, -0.15)} />
      <rect x="-14" y="-50" width="28" height="50" fill={c.accent} />
      <circle cx="8" cy="-24" r="2" fill={shade(c.accent, 0.6)} />
      <Window x={-56} y={-58} w={28} h={24} c={c} />
      <Window x={28} y={-58} w={28} h={24} c={c} />
      <Stoep x={-78} w={156} c={c} />
    </g>
  ),
  modern: (c) => (
    <g>
      <rect x="-100" y="-70" width="120" height="70" fill={c.wall} />
      <rect x="-30" y="-122" width="130" height="58" fill={c.wall} />
      <rect x="-104" y="-74" width="128" height="6" fill={c.roof} />
      <rect x="-34" y="-126" width="140" height="7" fill={c.roof} />
      <rect x="-22" y="-112" width="112" height="38" fill={_glass(c.lit)} />
      <path d="M6 -112 V-74 M34 -112 V-74 M62 -112 V-74" stroke={c.roof} strokeWidth="2" />
      <rect x="-92" y="-56" width="70" height="44" fill={_glass(c.lit)} />
      <path d="M-57 -56 V-12" stroke={c.roof} strokeWidth="2" />
      <rect x="-10" y="-48" width="22" height="48" fill={c.accent} />
      <rect x="22" y="-8" width="90" height="8" fill={shade(c.wall, -0.2)} />
      <rect x="30" y="-6" width="74" height="5" fill="#5fb7cf" />
    </g>
  ),
  farmhouse: (c) => (
    <g>
      <rect x="-96" y="-72" width="192" height="72" fill={c.wall} />
      <path d="M-100 -70 L-100 -96 L100 -96 L100 -70 Z" fill={c.roof} />
      <path d="M-26 -72 L-26 -112 Q-26 -124 -14 -128 Q-8 -144 0 -146 Q8 -144 14 -128 Q26 -124 26 -112 L26 -72 Z" fill={c.wall} stroke={shade(c.wall, -0.2)} strokeWidth="2" />
      <Window x={-8} y={-118} w={16} h={18} c={c} />
      <rect x="-14" y="-54" width="28" height="54" fill={c.accent} />
      <Window x={-78} y={-56} w={26} h={30} c={c} />
      <Window x={-44} y={-56} w={22} h={30} c={c} />
      <Window x={22} y={-56} w={22} h={30} c={c} />
      <Window x={52} y={-56} w={26} h={30} c={c} />
      <Stoep x={-104} w={208} c={c} />
    </g>
  ),
  cabin: (c) => (
    <g>
      {[-56, -20, 20, 56].map((x) => (
        <rect key={x} x={x - 3} y="-30" width="6" height="30" fill={shade(c.wall, -0.4)} />
      ))}
      <rect x="-70" y="-34" width="140" height="6" fill={shade(c.wall, -0.3)} />
      <path d="M-64 -32 L0 -140 L64 -32 Z" fill={c.roof} />
      <path d="M-46 -34 L0 -112 L46 -34 Z" fill={c.wall} />
      <path d="M-30 -34 L0 -86 L30 -34 Z" fill={_glass(c.lit)} />
      <path d="M0 -86 V-34 M-16 -60 H16" stroke={shade(c.wall, -0.4)} strokeWidth="2" />
      <path d="M-70 -34 V-50 M70 -34 V-50 M-70 -50 H70" stroke={shade(c.wall, -0.4)} strokeWidth="2.5" fill="none" />
      <path d="M-74 -32 L-90 0" stroke={shade(c.wall, -0.4)} strokeWidth="4" />
    </g>
  ),
  "beach-shack": (c) => (
    <g>
      {[-50, -16, 18, 52].map((x) => (
        <rect key={x} x={x - 2.5} y="-20" width="5" height="20" fill={shade(c.roof, -0.5)} />
      ))}
      <rect x="-62" y="-80" width="124" height="60" fill={c.wall} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1="-62" x2="62" y1={-74 + i * 6.5} y2={-74 + i * 6.5} stroke={shade(c.wall, -0.15)} strokeWidth="1" />
      ))}
      <path d="M-74 -78 L-6 -114 L74 -84 L74 -76 L-74 -70 Z" fill={c.roof} />
      <rect x="-48" y="-60" width="26" height="22" fill={_glass(c.lit)} stroke={c.roof} strokeWidth="3" />
      <rect x="6" y="-66" width="24" height="46" fill={c.accent} />
      <rect x="40" y="-60" width="16" height="16" fill={_glass(c.lit)} stroke={c.roof} strokeWidth="3" />
      <path d="M-84 -6 Q-80 -60 -70 -66 Q-78 -40 -76 -6 Z" fill="#f7d15d" />
      <path d="M78 0 L88 -40 L98 0" stroke="#7a5b3c" strokeWidth="2" fill="none" />
    </g>
  ),
  rondavel: (c) => (
    <g>
      {[-52, 52].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <rect x="-40" y="-58" width="80" height="58" rx="6" fill={c.wall} />
          <path d="M-52 -54 Q0 -60 52 -54 L4 -118 L-4 -118 Z" fill={c.roof} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${-44 + i * 17} -56 L0 -114`} stroke={shade(c.roof, -0.2)} strokeWidth="1" />
          ))}
          <rect x="-10" y="-38" width="20" height="38" rx="9" fill={c.accent} />
          <Window x={20} y={-40} w={12} h={14} c={c} />
        </g>
      ))}
      <rect x="-14" y="-12" width="28" height="12" fill={shade(c.wall, -0.3)} />
    </g>
  ),
};

export function House({ style, colours }: { style: z.infer<typeof houseStyleSchema>; colours: HouseColoursType }) {
  const result = houses[style](colours);
  return result;
}
