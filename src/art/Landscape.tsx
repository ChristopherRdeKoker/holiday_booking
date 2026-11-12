import type { ReactElement } from "react";
import type { z } from "zod";
import { landColours, shade, type LandColoursType } from "@/art/palette";
import { seededRandom } from "@/art/random";
import type { sceneSchema } from "@/lib/schemas/homeSchema";

type LandscapeProps = {
  scene: z.infer<typeof sceneSchema>;
  seed: number;
  horizon: number;
  width: number;
  height: number;
};

type PainterType = (c: LandColoursType, rand: () => number, h: number, w: number, bottom: number) => ReactElement;

function _ridge(rand: () => number, w: number, base: number, amp: number, steps: number): string {
  let d = `M0 ${base}`;
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = base - amp * (0.4 + rand() * 0.6);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  const result = `${d} L${w} ${base} Z`;
  return result;
}

function _rolling(w: number, base: number, amp: number, phase: number): string {
  let d = `M0 ${base + 40}`;
  for (let x = 0; x <= w; x += 20) {
    const y = base - amp * Math.sin((x / w) * Math.PI * 1.6 + phase);
    d += ` L${x} ${y.toFixed(1)}`;
  }
  const result = `${d} L${w} ${base + 40} Z`;
  return result;
}

function _pine(x: number, y: number, s: number, fill: string, key: number) {
  return <path key={key} d={`M${x} ${y - 46 * s} L${x + 13 * s} ${y - 16 * s} L${x + 7 * s} ${y - 16 * s} L${x + 17 * s} ${y} L${x - 17 * s} ${y} L${x - 7 * s} ${y - 16 * s} L${x - 13 * s} ${y - 16 * s} Z`} fill={fill} />;
}

function _acacia(x: number, y: number, s: number, key: number) {
  return (
    <g key={key}>
      <path d={`M${x} ${y} L${x - 2 * s} ${y - 26 * s} M${x - 1 * s} ${y - 16 * s} L${x + 9 * s} ${y - 28 * s}`} stroke="#5a4632" strokeWidth={3 * s} strokeLinecap="round" />
      <ellipse cx={x + 2 * s} cy={y - 30 * s} rx={26 * s} ry={6 * s} fill="#5f7340" />
    </g>
  );
}

const painters: Record<z.infer<typeof sceneSchema>, PainterType> = {
  coast: (c, rand, h, w, bottom) => (
    <g>
      <path d={_ridge(rand, w * 0.45, h + 2, 26, 6)} fill={c.far} />
      <rect x="0" y={h} width={w} height={bottom - h} fill={c.water} />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${20 + rand() * (w - 60)} ${h + 12 + i * 9} q8 -4 16 0 q8 4 16 0`} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.6" fill="none" />
      ))}
      <path d={`M0 ${bottom - 52} Q${w * 0.3} ${bottom - 92} ${w * 0.62} ${bottom - 66} T${w} ${bottom - 70} L${w} ${bottom} L0 ${bottom} Z`} fill={c.near} />
      <path d={`M0 ${bottom - 30} Q${w * 0.5} ${bottom - 60} ${w} ${bottom - 34} L${w} ${bottom} L0 ${bottom} Z`} fill={c.ground} />
    </g>
  ),
  mountain: (c, rand, h, w, bottom) => (
    <g>
      <path d={_ridge(rand, w, h + 10, 120, 7)} fill={c.far} />
      <path d={_ridge(rand, w, h + 20, 70, 5)} fill={c.mid} />
      <path d={`M0 ${h + 8} L${w} ${h + 8}`} stroke={shade(c.mid, -0.2)} strokeWidth="2" opacity="0.4" />
      <rect x="0" y={h + 16} width={w} height={bottom - h} fill={c.near} />
      <path d={_rolling(w, bottom - 50, 14, 0.6)} fill={c.ground} />
    </g>
  ),
  karoo: (c, rand, h, w, bottom) => (
    <g>
      <path d={`M${w * 0.05} ${h + 4} L${w * 0.12} ${h - 46} L${w * 0.3} ${h - 46} L${w * 0.38} ${h + 4} Z`} fill={c.far} />
      <path d={`M${w * 0.55} ${h + 4} L${w * 0.6} ${h - 30} L${w * 0.82} ${h - 30} L${w * 0.9} ${h + 4} Z`} fill={shade(c.far, 0.1)} />
      <rect x="0" y={h} width={w} height={bottom - h} fill={c.ground} />
      {Array.from({ length: 22 }, (_, i) => (
        <ellipse key={i} cx={rand() * w} cy={h + 10 + rand() * (bottom - h - 20)} rx={3 + rand() * 4} ry={2 + rand() * 2} fill={shade(c.near, -0.35)} opacity="0.7" />
      ))}
      <g transform={`translate(${w * 0.86} ${h + 26})`} stroke="#5d5a55" strokeWidth="2" fill="none">
        <path d="M-10 40 L0 -30 L10 40 M-6 15 L6 15" />
        <g transform="translate(0 -32)">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="0" y1="0" x2={14 * Math.cos((i * Math.PI) / 4)} y2={14 * Math.sin((i * Math.PI) / 4)} />
          ))}
        </g>
        <path d="M0 -32 L-20 -30" />
      </g>
    </g>
  ),
  forest: (c, rand, h, w, bottom) => (
    <g>
      <path d={_ridge(rand, w, h + 10, 60, 8)} fill={c.far} />
      {Array.from({ length: 16 }, (_, i) => _pine((w / 15) * i + rand() * 10, h + 22, 0.9 + rand() * 0.4, c.mid, i))}
      <rect x="0" y={h + 10} width={w} height="18" fill="#ffffff" opacity="0.18" />
      <rect x="0" y={h + 20} width={w} height={bottom - h} fill={c.ground} />
      {[0, 1, 2, 3, 4, 5].map((i) => _pine(i < 3 ? 20 + i * 40 : w - 20 - (i - 3) * 42, bottom - 10, 1.6 + rand() * 0.4, c.near, 100 + i))}
    </g>
  ),
  vineyard: (c, rand, h, w, bottom) => (
    <g>
      <path d={_ridge(rand, w, h + 6, 90, 6)} fill={c.far} />
      <path d={_rolling(w, h + 18, 12, 1.2)} fill={c.mid} />
      <rect x="0" y={h + 30} width={w} height={bottom - h} fill={c.ground} />
      {Array.from({ length: 13 }, (_, i) => {
        const x = -w * 0.2 + (w * 1.4 * i) / 12;
        return <line key={i} x1={w / 2 + (x - w / 2) * 0.15} y1={h + 30} x2={x} y2={bottom} stroke={c.near} strokeWidth="5" strokeDasharray="6 4" />;
      })}
    </g>
  ),
  lagoon: (c, rand, h, w, bottom) => (
    <g>
      <path d={_ridge(rand, w, h + 4, 70, 6)} fill={c.far} />
      <path d={`M0 ${h + 4} Q${w * 0.2} ${h - 40} ${w * 0.38} ${h + 4} Z`} fill={c.mid} />
      <path d={`M${w * 0.62} ${h + 4} Q${w * 0.85} ${h - 50} ${w} ${h - 10} L${w} ${h + 4} Z`} fill={c.mid} />
      <rect x="0" y={h + 4} width={w} height={bottom - h} fill={c.water} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={rand() * w} y1={h + 14 + i * 7} x2={rand() * w * 0.2 + 20} y2={h + 14 + i * 7} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" transform={`translate(${rand() * 80} 0)`} />
      ))}
      <path d={`M0 ${bottom - 40} Q${w * 0.4} ${bottom - 70} ${w} ${bottom - 46} L${w} ${bottom} L0 ${bottom} Z`} fill={c.ground} />
    </g>
  ),
  bushveld: (c, rand, h, w, bottom) => (
    <g>
      <path d={_ridge(rand, w, h + 4, 30, 5)} fill={c.far} />
      <rect x="0" y={h} width={w} height={bottom - h} fill={c.ground} />
      {Array.from({ length: 5 }, (_, i) => _acacia(30 + rand() * (w - 60), h + 8 + rand() * 20, 0.6 + rand() * 0.3, i))}
      {[0, 1].map((i) => _acacia(i === 0 ? 50 : w - 50, bottom - 18, 1.5, 10 + i))}
      {Array.from({ length: 40 }, (_, i) => {
        const x = rand() * w;
        const y = h + 30 + rand() * (bottom - h - 30);
        return <path key={20 + i} d={`M${x} ${y} l-3 -8 M${x} ${y} l0 -10 M${x} ${y} l3 -8`} stroke={shade(c.mid, -0.25)} strokeWidth="1.2" />;
      })}
    </g>
  ),
};

export function Landscape({ scene, seed, horizon, width, height }: LandscapeProps) {
  const result = painters[scene](landColours[scene], seededRandom(seed + 7), horizon, width, height);
  return result;
}
