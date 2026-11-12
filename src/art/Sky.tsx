import { skyColours, type TimeOfDayType } from "@/art/palette";
import { seededRandom } from "@/art/random";

type SkyProps = {
  idPrefix: string;
  time: TimeOfDayType;
  seed: number;
  width: number;
  height: number;
};

export function Sky({ idPrefix, time, seed, width, height }: SkyProps) {
  const sky = skyColours[time];
  const rand = seededRandom(seed + 101);
  const sunX = 70 + rand() * (width - 140);
  const sunHeights: Record<TimeOfDayType, number> = { day: 0.2, golden: 0.52, dusk: 0.22 };
  const sunY = height * sunHeights[time];
  const stars = time === "dusk" ? Array.from({ length: 26 }, () => [rand() * width, rand() * height * 0.42, 0.6 + rand() * 1.1] as const) : [];
  const clouds = time === "dusk" ? [] : Array.from({ length: 2 + Math.floor(rand() * 2) }, () => [rand() * width, 30 + rand() * 70, 0.7 + rand() * 0.6] as const);
  return (
    <g>
      <defs>
        <linearGradient id={`${idPrefix}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <radialGradient id={`${idPrefix}-glow`}>
          <stop offset="0" stopColor={sky.sun} stopOpacity="0.9" />
          <stop offset="1" stopColor={sky.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill={`url(#${idPrefix}-sky)`} />
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fffbe8" opacity={0.8} />
      ))}
      <circle cx={sunX} cy={sunY} r={70} fill={`url(#${idPrefix}-glow)`} />
      <circle cx={sunX} cy={sunY} r={time === "dusk" ? 14 : 22} fill={sky.sun} />
      {clouds.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" opacity={0.85}>
          <ellipse cx="0" cy="0" rx="34" ry="11" />
          <ellipse cx="-14" cy="-7" rx="16" ry="11" />
          <ellipse cx="12" cy="-9" rx="20" ry="13" />
        </g>
      ))}
    </g>
  );
}
