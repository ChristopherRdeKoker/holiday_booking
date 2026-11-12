import type { ReactNode } from "react";
import { shade } from "@/art/palette";

export type RoomColoursType = {
  wall: string;
  accent: string;
  roof: string;
};

type RoomProps = {
  colours: RoomColoursType;
  view: ReactNode;
  lit: boolean;
};

function ViewWindow({ x, y, w, h, view, frame }: { x: number; y: number; w: number; h: number; view: ReactNode; frame: string }) {
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill={frame} />
      <svg x={x} y={y} width={w} height={h} viewBox="60 40 360 240" preserveAspectRatio="xMidYMid slice">
        {view}
      </svg>
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.4} H${x + w}`} stroke={frame} strokeWidth="5" />
    </g>
  );
}

function Floor({ tone }: { tone: string }) {
  return (
    <g>
      <rect x="0" y="236" width="480" height="84" fill={tone} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1="0" x2="480" y1={246 + i * 13} y2={246 + i * 13} stroke={shade(tone, -0.12)} strokeWidth="1.5" />
      ))}
    </g>
  );
}

function Lamp({ x, lit }: { x: number; lit: boolean }) {
  return (
    <g>
      <line x1={x} y1="160" x2={x} y2="236" stroke="#3a3a3a" strokeWidth="3" />
      <ellipse cx={x} cy="238" rx="14" ry="4" fill="#3a3a3a" />
      <path d={`M${x - 18} 160 L${x - 11} 132 L${x + 11} 132 L${x + 18} 160 Z`} fill={lit ? "#ffe3a3" : "#efe6d2"} />
    </g>
  );
}

function Plant({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 14} 236 L${x - 11} 212 L${x + 11} 212 L${x + 14} 236 Z`} fill="#b8673f" />
      {[-40, -15, 10, 35, 60].map((a, i) => (
        <ellipse key={i} cx={x} cy={186} rx="7" ry="26" fill={i % 2 ? "#3f7a4f" : "#4f8f5c"} transform={`rotate(${a} ${x} 212)`} />
      ))}
    </g>
  );
}

export function LivingRoom({ colours, view, lit }: RoomProps) {
  const wall = shade(colours.wall, colours.wall === "#f7f7f4" ? -0.04 : 0.35);
  return (
    <g>
      <rect width="480" height="320" fill={wall} />
      <ViewWindow x={150} y={40} w={180} h={130} view={view} frame={shade(wall, -0.35)} />
      <Floor tone="#c79a6b" />
      <ellipse cx="240" cy="284" rx="170" ry="26" fill={shade(colours.accent, 0.55)} />
      <rect x="120" y="178" width="240" height="22" rx="10" fill={shade(colours.accent, -0.15)} />
      <rect x="108" y="196" width="264" height="40" rx="12" fill={colours.accent} />
      <rect x="100" y="186" width="30" height="54" rx="10" fill={shade(colours.accent, -0.2)} />
      <rect x="350" y="186" width="30" height="54" rx="10" fill={shade(colours.accent, -0.2)} />
      <rect x="150" y="186" width="36" height="22" rx="6" fill="#f3ead8" />
      <rect x="294" y="186" width="36" height="22" rx="6" fill="#e9c46a" />
      <rect x="190" y="256" width="100" height="10" rx="3" fill="#7a5236" />
      <rect x="198" y="266" width="6" height="18" fill="#7a5236" />
      <rect x="276" y="266" width="6" height="18" fill="#7a5236" />
      <circle cx="226" cy="250" r="6" fill="#ffffff" />
      <rect x="244" y="244" width="22" height="12" rx="2" fill="#4a6b8a" />
      <Lamp x={60} lit={lit} />
      <Plant x={420} />
      <rect x="38" y="60" width="66" height="50" fill="#f5efe2" stroke={shade(wall, -0.4)} strokeWidth="4" />
      <path d="M44 104 L62 82 L76 96 L86 86 L98 104 Z" fill={colours.roof} />
      {lit && <rect width="480" height="320" fill="#ffb347" opacity="0.08" />}
    </g>
  );
}

export function Bedroom({ colours, view, lit }: RoomProps) {
  const wall = shade(colours.roof, 0.72);
  return (
    <g>
      <rect width="480" height="320" fill={wall} />
      <ViewWindow x={300} y={46} w={130} h={110} view={view} frame="#f4efe6" />
      <Floor tone="#b98d63" />
      <rect x="70" y="120" width="200" height="90" rx="8" fill={shade(colours.roof, -0.1)} />
      <rect x="58" y="188" width="224" height="56" rx="8" fill="#f7f3ea" />
      <rect x="58" y="208" width="224" height="40" rx="8" fill={colours.accent} />
      <rect x="58" y="206" width="224" height="6" fill={shade(colours.accent, 0.35)} />
      <rect x="84" y="170" width="70" height="28" rx="10" fill="#ffffff" />
      <rect x="186" y="170" width="70" height="28" rx="10" fill="#ffffff" />
      <rect x="300" y="196" width="50" height="40" rx="3" fill="#8a5d3b" />
      <rect x="306" y="214" width="38" height="3" fill="#6d4a2f" />
      <path d="M314 196 L318 172 L332 172 L336 196 Z" fill={lit ? "#ffe3a3" : "#efe6d2"} />
      <ellipse cx="170" cy="282" rx="130" ry="20" fill={shade(colours.accent, 0.6)} />
      <Plant x={420} />
      {lit && <rect width="480" height="320" fill="#ffb347" opacity="0.08" />}
    </g>
  );
}

export function StoepView({ view, colours }: { view: ReactNode; colours: RoomColoursType }) {
  const rail = shade(colours.wall, -0.45);
  return (
    <g>
      {view}
      <rect x="0" y="250" width="480" height="70" fill={shade(colours.wall, -0.1)} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={i * 96} y1="250" x2={i * 96 - 60} y2="320" stroke={shade(colours.wall, -0.25)} strokeWidth="2" />
      ))}
      <rect x="0" y="206" width="480" height="7" fill={rail} />
      <rect x="0" y="244" width="480" height="7" fill={rail} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={i * 20 + 6} y="213" width="4" height="31" fill={rail} />
      ))}
      <rect x="0" y="0" width="16" height="250" fill={rail} />
      <rect x="0" y="0" width="480" height="16" fill={shade(colours.roof, -0.1)} />
      <g transform="translate(330 300)">
        <path d="M-30 0 L-22 -52 L22 -52 L30 0" stroke="#6b4a2f" strokeWidth="4" fill="none" />
        <rect x="-26" y="-58" width="52" height="16" rx="3" fill={colours.accent} />
        <path d="M-24 -58 L-34 -96 L30 -96 L24 -58 Z" fill={shade(colours.accent, -0.15)} />
      </g>
      <g transform="translate(110 300)">
        <ellipse cx="0" cy="-48" rx="28" ry="10" fill="#2f2f2f" />
        <path d="M-20 -46 L-28 0 M20 -46 L28 0 M0 -40 L0 0" stroke="#2f2f2f" strokeWidth="3" />
        <path d="M-12 -60 q4 -10 0 -18 M2 -62 q4 -10 0 -18 M14 -60 q4 -10 0 -18" stroke="#9a9a9a" strokeWidth="2" fill="none" opacity="0.7" />
      </g>
    </g>
  );
}
