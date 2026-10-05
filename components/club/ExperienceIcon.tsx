"use client";

import { useId } from "react";

/**
 * Icons for the eight experiences, drawn on a 48x48 grid.
 *
 * Rendered with soft gradients, highlights and ground shadows so they read as
 * small physical objects rather than flat glyphs. Every svg carries its own
 * <defs>, with ids scoped by useId so several icons can share a page.
 */

type U = (name: string) => string;

const INK = "#1E130B";

function Defs({ u }: { u: (name: string) => string }) {
  const radial = (id: string, stops: [number, string, number?][], cx = 0.35, cy = 0.3, r = 0.8) => (
    <radialGradient id={u(id)} cx={cx} cy={cy} r={r}>
      {stops.map(([o, c, op = 1]) => (
        <stop key={o} offset={o} stopColor={c} stopOpacity={op} />
      ))}
    </radialGradient>
  );
  const linear = (id: string, stops: [number, string, number?][], x2 = 0, y2 = 1) => (
    <linearGradient id={u(id)} x1={0} y1={0} x2={x2} y2={y2}>
      {stops.map(([o, c, op = 1]) => (
        <stop key={o} offset={o} stopColor={c} stopOpacity={op} />
      ))}
    </linearGradient>
  );

  return (
    <defs>
      {radial("fur", [[0, "#E9B67C"], [0.55, "#BC7F44"], [1, "#8A5527"]])}
      {linear("ear", [[0, "#94602F"], [1, "#5A3515"]])}
      {radial("cream", [[0, "#FFFAF2"], [1, "#E6CBA3"]], 0.4, 0.3, 0.9)}
      {radial("nose", [[0, "#5E4A3A"], [1, "#0F0905"]])}
      {radial("shadow", [[0, "#3B2A1A", 0.28], [1, "#3B2A1A", 0]], 0.5, 0.5, 0.5)}
      {linear("roof", [[0, "#F7A276"], [1, "#C44D2B"]])}
      {linear("wall", [[0, "#FFF3E1"], [1, "#E3BD88"]], 1, 1)}
      {linear("door", [[0, "#4A2A12"], [1, "#22130A"]])}
      {radial("glass", [[0, "#E4F6FF"], [1, "#5FA9E2"]])}
      {linear("water", [[0, "#8FDDFB"], [1, "#2775C4"]])}
      {linear("bed", [[0, "#6FA6DA"], [1, "#22497F"]])}
      {linear("bedTop", [[0, "#A6CEF0"], [1, "#5B93C4"]])}
      {radial("cushion", [[0, "#FFF4E2"], [1, "#DDBF92"]], 0.5, 0.4, 0.7)}
      {radial("leaf", [[0, "#BDEA94"], [0.6, "#68A84B"], [1, "#3F7A33"]])}
      {radial("leafDark", [[0, "#93C972"], [1, "#356629"]])}
      {linear("trunk", [[0, "#A06A38"], [1, "#5F3A1C"]], 1, 0)}
      {linear("grass", [[0, "#A6DA74"], [1, "#5A963B"]])}
      {radial("ball", [[0, "#F6FF96"], [0.55, "#D6EA3C"], [1, "#98B015"]])}
      {linear("ceramic", [[0, "#FFFFFF"], [0.45, "#F6F0E8"], [1, "#D2C4B1"]], 1, 0)}
      {linear("saucer", [[0, "#FFFFFF"], [1, "#D9CCBA"]])}
      {radial("coffee", [[0, "#9A6539"], [1, "#4A2914"]], 0.5, 0.4, 0.7)}
      {linear("bottle", [[0, "#3F8BD6"], [0.3, "#86C8F7"], [1, "#255FA6"]], 1, 0)}
      {linear("navy", [[0, "#3360AC"], [1, "#0E2552"]])}
      {radial("gold", [[0, "#FFE29A"], [0.6, "#F2AE3F"], [1, "#C97C12"]])}
      {radial("bubble", [[0, "#FFFFFF", 0.9], [0.55, "#D8EEFF", 0.35], [1, "#6FB3EE", 0.75]], 0.35, 0.35, 0.75)}
      {radial("foam", [[0, "#FFFFFF"], [1, "#D5E7F7"]], 0.4, 0.3, 0.8)}
      {linear("party", [[0, "#FF9DB1"], [1, "#D9415F"]], 1, 1)}
      <clipPath id={u("cone")}>
        <path d="M24 6 L37 38 Q24 42.5 11 38 Z" />
      </clipPath>
    </defs>
  );
}

const url = (u: U, name: string) => `url(#${u(name)})`;

function Shadow({ u, cx = 24, cy = 43, rx = 16, ry = 2.6 }: { u: U; cx?: number; cy?: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={url(u, "shadow")} />;
}

/** A paw, used across several of the icons so the set holds together. */
function Paw({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={3.2 * s} rx={4.4 * s} ry={3.6 * s} fill={fill} />
      <circle cx={-4 * s} cy={-1.6 * s} r={1.7 * s} fill={fill} />
      <circle cx={-1.4 * s} cy={-3.4 * s} r={1.7 * s} fill={fill} />
      <circle cx={1.4 * s} cy={-3.4 * s} r={1.7 * s} fill={fill} />
      <circle cx={4 * s} cy={-1.6 * s} r={1.7 * s} fill={fill} />
    </g>
  );
}

/** The same friendly face wherever a dog appears, centred on (x, y). */
function DogHead({ u, x, y, s = 1 }: { u: U; x: number; y: number; s?: number }) {
  const ear = "M-6.5 -6 C-11.5 -8 -14.5 -2 -13.5 4 C-13 7.5 -10 8.5 -8.5 6 C-7.5 4 -7 0 -6 -3 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={ear} fill={url(u, "ear")} />
      <path d={ear} fill={url(u, "ear")} transform="scale(-1 1)" />
      <ellipse cx={0} cy={0} rx={9} ry={8.4} fill={url(u, "fur")} />
      <ellipse cx={-2.6} cy={-5.2} rx={3.4} ry={1.5} fill="#FFFFFF" opacity={0.25} />
      <ellipse cx={0} cy={3.6} rx={5.4} ry={4} fill={url(u, "cream")} />
      <ellipse cx={-5.4} cy={2.8} rx={1.4} ry={0.8} fill="#F28B82" opacity={0.45} />
      <ellipse cx={5.4} cy={2.8} rx={1.4} ry={0.8} fill="#F28B82" opacity={0.45} />
      <ellipse cx={0} cy={1.6} rx={2.3} ry={1.6} fill={url(u, "nose")} />
      <ellipse cx={-0.7} cy={1.05} rx={0.8} ry={0.4} fill="#FFFFFF" opacity={0.7} />
      <path
        d="M0 3.2 V4.6 M-2 4.8 Q-1 5.9 0 4.6 Q1 5.9 2 4.8"
        stroke="#3A2414"
        strokeWidth={0.8}
        fill="none"
        strokeLinecap="round"
      />
      {[-3.6, 3.6].map((ex) => (
        <g key={ex}>
          <circle cx={ex} cy={-1.8} r={1.45} fill={INK} />
          <circle cx={ex - 0.45} cy={-2.3} r={0.5} fill="#FFFFFF" />
        </g>
      ))}
    </g>
  );
}

function Daycare({ u }: { u: U }) {
  return (
    <>
      <Shadow u={u} rx={18} />
      <path d="M9 22 L24 11 L39 22 V40 Q39 41.5 37.5 41.5 H10.5 Q9 41.5 9 40 Z" fill={url(u, "wall")} />
      <path
        d="M4 23.5 L24 7 L44 23.5 Q45 25 43 25.5 L41 26 L24 12.5 L7 26 L5 25.5 Q3 25 4 23.5 Z"
        fill={url(u, "roof")}
      />
      <path d="M5 23 L24 7.6 L43 23" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={0.9} fill="none" />
      <circle cx={24} cy={19.5} r={2.9} fill={url(u, "glass")} stroke="#C99A62" strokeWidth={1.1} />
      <path d="M16.5 41.5 V31 A7.5 7.5 0 0 1 31.5 31 V41.5 Z" fill={url(u, "door")} />
      {/* a pup peeking out — it's a place with dogs in it */}
      <DogHead u={u} x={24} y={35.5} s={0.6} />
      <rect x={14.5} y={40.4} width={19} height={2.2} rx={1.1} fill="#B98A55" />
    </>
  );
}

function Boarding({ u }: { u: U }) {
  const z = (x: number, y: number, k: number) =>
    `M${x} ${y} h${3 * k} l${-3 * k} ${3.4 * k} h${3 * k}`;
  return (
    <>
      <Shadow u={u} rx={20} />
      <ellipse cx={24} cy={31} rx={20} ry={9} fill={url(u, "bed")} />
      <ellipse cx={24} cy={29.5} rx={19} ry={7.6} fill={url(u, "bedTop")} />
      <ellipse cx={24} cy={31} rx={14.5} ry={5.2} fill={url(u, "cushion")} />
      {/* a dog curled up asleep */}
      <path d="M34.5 30 Q40.5 30.5 38.5 25.5" stroke={url(u, "ear")} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <ellipse cx={27} cy={27.5} rx={9.5} ry={5.3} fill={url(u, "fur")} />
      <ellipse cx={27} cy={24.4} rx={5} ry={1.3} fill="#FFFFFF" opacity={0.22} />
      <circle cx={16} cy={27} r={5.4} fill={url(u, "fur")} />
      <path d="M15.6 22.3 C11.5 22 10.5 26.5 12.5 29.5 C14 31 15.8 28 15.9 25 Z" fill={url(u, "ear")} />
      <ellipse cx={12.6} cy={29} rx={3} ry={2.2} fill={url(u, "cream")} />
      <ellipse cx={10.4} cy={28.3} rx={1.1} ry={0.8} fill={url(u, "nose")} />
      <path d="M15.4 26.6 q1.4 1.2 2.8 0" stroke={INK} strokeWidth={0.9} fill="none" strokeLinecap="round" />
      <ellipse cx={20.5} cy={31.6} rx={2.6} ry={1.5} fill={url(u, "cream")} />
      {/* front lip of the bed, tucking the dog in */}
      <path d="M4 31 A20 9 0 0 0 44 31 A20 4.5 0 0 1 4 31 Z" fill={url(u, "bed")} />
      <path d="M6 31.6 A18 4.4 0 0 0 42 31.6" stroke="#B9DAF5" strokeOpacity={0.7} strokeWidth={0.9} fill="none" />
      <path d={z(33, 14, 0.8)} stroke="#16386F" strokeWidth={1.3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={z(38, 6.5, 1.1)} stroke="#16386F" strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </>
  );
}

function Drop({ u, x, y, r }: { u: U; x: number; y: number; r: number }) {
  return (
    <>
      <path
        d={`M${x} ${y - r * 1.9} C${x + r * 1.1} ${y - r * 0.4} ${x + r} ${y + r} ${x} ${y + r} C${x - r} ${y + r} ${x - r * 1.1} ${y - r * 0.4} ${x} ${y - r * 1.9} Z`}
        fill={url(u, "water")}
      />
      <ellipse cx={x - r * 0.35} cy={y} rx={r * 0.25} ry={r * 0.45} fill="#FFFFFF" opacity={0.75} />
    </>
  );
}

function Pool({ u }: { u: U }) {
  const surface = "M2 29 Q7 26.5 12 29 T22 29 T32 29 T42 29 Q44.5 30.2 46 29";
  return (
    <>
      <DogHead u={u} x={24} y={20.5} />
      <path d={`${surface} V35 Q46 44 24 44 Q2 44 2 35 Z`} fill={url(u, "water")} opacity={0.95} />
      <path d={surface} stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M8 35 q4 -1.6 8 0 M29 38.5 q4 -1.6 8 0 M18 40 q2.5 -1 5 0" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <Drop u={u} x={7.5} y={20} r={1.6} />
      <Drop u={u} x={40.5} y={18} r={1.8} />
      <Drop u={u} x={37} y={9.5} r={1.1} />
    </>
  );
}

function Park({ u }: { u: U }) {
  return (
    <>
      <ellipse cx={24} cy={41.5} rx={21} ry={4.5} fill={url(u, "grass")} />
      <ellipse cx={22} cy={39.6} rx={8} ry={1.4} fill="#2F5A20" opacity={0.25} />
      <path d="M21.6 40 L22.6 25 H25.4 L26.4 40 Z" fill={url(u, "trunk")} />
      <path d="M24.5 30 L29 25.5" stroke="#6E4520" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={14.5} cy={22} r={7.5} fill={url(u, "leafDark")} />
      <circle cx={33.5} cy={22} r={7.5} fill={url(u, "leafDark")} />
      <circle cx={24} cy={15.5} r={11} fill={url(u, "leaf")} />
      <ellipse cx={19.5} cy={10} rx={4} ry={2.3} fill="#FFFFFF" opacity={0.28} />
      <ellipse cx={11.5} cy={19} rx={2.2} ry={1.3} fill="#FFFFFF" opacity={0.2} />
      {/* the tennis ball is what makes it a dog park */}
      <ellipse cx={36.5} cy={42.6} rx={5} ry={1.1} fill="#1F3A14" opacity={0.3} />
      <circle cx={36.5} cy={37} r={5.8} fill={url(u, "ball")} />
      <path d="M31.8 34 Q35.6 37 31.6 40.3 M41.2 33.8 Q37.3 37 41.4 40.4" stroke="#FFFFFF" strokeWidth={1.1} fill="none" strokeLinecap="round" opacity={0.95} />
      <ellipse cx={34.4} cy={34.4} rx={1.8} ry={1.1} fill="#FFFFFF" opacity={0.55} />
      <path d="M6 41 l-0.8 -2.6 M8 41.6 l0.3 -2.8 M41.5 41.8 l0.7 -2.5" stroke="#4E8A35" strokeWidth={0.9} strokeLinecap="round" />
    </>
  );
}

function Cafe({ u }: { u: U }) {
  return (
    <>
      <Shadow u={u} cx={22} rx={17} ry={2.2} />
      <ellipse cx={22} cy={40} rx={17} ry={3.8} fill={url(u, "saucer")} />
      <ellipse cx={22} cy={39.6} rx={10.5} ry={2.2} fill="#E6DACB" />
      <path d="M17 8 C14.5 11 19.5 12.5 17 16 M24 6.5 C21.5 10 26.5 11.5 24 15.5" stroke="#BCAA96" strokeOpacity={0.75} strokeWidth={1.7} fill="none" strokeLinecap="round" />
      <path d="M34.5 23.5 C42.5 22.5 43 33 34 34.5" stroke="#D9CCBA" strokeWidth={3.6} fill="none" strokeLinecap="round" />
      <path d="M34.5 23.5 C42.5 22.5 43 33 34 34.5" stroke="#FFFFFF" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M8.5 20 H35.5 L33.6 33.5 Q32.6 39.4 26.6 39.4 H17.4 Q11.4 39.4 10.4 33.5 Z" fill={url(u, "ceramic")} />
      <rect x={12.6} y={22.5} width={2.2} height={11} rx={1.1} fill="#FFFFFF" opacity={0.9} />
      <Paw x={22} y={29} s={0.85} fill="#D9774E" />
      <ellipse cx={22} cy={20} rx={13.5} ry={3.6} fill="#FBF7F1" stroke="#DDD0BF" strokeWidth={0.6} />
      <ellipse cx={22} cy={20.4} rx={11.5} ry={2.7} fill={url(u, "coffee")} />
      {/* latte art, foreshortened onto the crema */}
      <g transform="translate(22 20.1) scale(1 0.42)">
        <Paw x={0} y={0} s={0.8} fill="#EBCBA2" />
      </g>
    </>
  );
}

function Bubble({ u, x, y, r }: { u: U; x: number; y: number; r: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={url(u, "bubble")} stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={0.5} />
      <ellipse cx={x - r * 0.38} cy={y - r * 0.4} rx={r * 0.32} ry={r * 0.2} fill="#FFFFFF" opacity={0.9} transform={`rotate(-35 ${x - r * 0.38} ${y - r * 0.4})`} />
    </>
  );
}

function Grooming({ u }: { u: U }) {
  return (
    <>
      <Shadow u={u} rx={14} />
      <rect x={11} y={8.6} width={8} height={2.8} rx={1.4} fill={url(u, "navy")} />
      <rect x={17} y={7.8} width={11.5} height={4.4} rx={2} fill={url(u, "navy")} />
      <rect x={21.5} y={11.5} width={5} height={3} fill="#0E2552" />
      <rect x={19.5} y={13.5} width={9} height={5} rx={1.6} fill={url(u, "navy")} />
      <rect x={14.5} y={17} width={19} height={24} rx={6} fill={url(u, "bottle")} />
      <rect x={16.8} y={19.5} width={2.2} height={17} rx={1.1} fill="#FFFFFF" opacity={0.55} />
      <rect x={18} y={24} width={12} height={11} rx={2.5} fill={url(u, "cream")} />
      <Paw x={24} y={29} s={0.68} fill="#2D6CB4" />
      {/* lather round the base and bubbles drifting up */}
      <circle cx={13.5} cy={40} r={3.4} fill={url(u, "foam")} />
      <circle cx={18.5} cy={41.2} r={3.6} fill={url(u, "foam")} />
      <circle cx={29.5} cy={41.2} r={3.6} fill={url(u, "foam")} />
      <circle cx={34.5} cy={40} r={3.1} fill={url(u, "foam")} />
      <Bubble u={u} x={38.5} y={14} r={4.2} />
      <Bubble u={u} x={41.5} y={24.5} r={2.6} />
      <Bubble u={u} x={8.5} y={20} r={3.3} />
      <Bubble u={u} x={7} y={30} r={2} />
      <Bubble u={u} x={36.5} y={33} r={2.2} />
    </>
  );
}

function PlaySchool({ u }: { u: U }) {
  return (
    <>
      <Shadow u={u} rx={12} cy={43.5} ry={2} />
      <DogHead u={u} x={24} y={31} s={1.05} />
      <path d="M15 21 Q24 26 33 21 V24.5 Q24 29 15 24.5 Z" fill="#0E2552" />
      {/* mortarboard, with a little thickness to it */}
      <path d="M5 17 L24 24 L43 17 V18.6 L24 25.6 L5 18.6 Z" fill="#0A1A3C" />
      <path d="M24 10 L43 17 L24 24 L5 17 Z" fill={url(u, "navy")} />
      <path d="M6.5 16.6 L24 10.4 L41.5 16.6" stroke="#6A93D8" strokeOpacity={0.6} strokeWidth={0.8} fill="none" />
      <path d="M24 17 Q33 17.5 39 19 V27" stroke={url(u, "gold")} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      <circle cx={24} cy={17} r={1.4} fill={url(u, "gold")} />
      <path d="M37.6 26.4 H40.4 L41.3 32 H36.7 Z" fill={url(u, "gold")} />
    </>
  );
}

function Events({ u }: { u: U }) {
  return (
    <>
      <Shadow u={u} rx={14} />
      <path d="M24 6 L37 38 Q24 42.5 11 38 Z" fill={url(u, "party")} />
      <g clipPath={url(u, "cone")}>
        <path d="M6 22 L42 8 L42 13 L6 27 Z M6 33 L42 19 L42 24 L6 38 Z" fill="#FFE08A" />
        <path d="M24 6 L37 38 Q31 40.6 26 41 Z" fill="#000000" opacity={0.12} />
        <path d="M23.4 8 L15 33" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={1.4} strokeLinecap="round" />
      </g>
      <path d="M11 38 Q24 42.5 37 38 Q38 40.6 36 41.2 Q24 45 12 41.2 Q10 40.6 11 38 Z" fill={url(u, "cream")} />
      <circle cx={24} cy={6} r={3.8} fill={url(u, "gold")} />
      <circle cx={22.8} cy={4.8} r={1.1} fill="#FFFFFF" opacity={0.7} />
      {/* confetti and streamers */}
      <rect x={6} y={10} width={3.2} height={1.8} rx={0.5} fill="#5B93C4" transform="rotate(-30 7.6 10.9)" />
      <rect x={39} y={30} width={3.2} height={1.8} rx={0.5} fill="#E8A33D" transform="rotate(25 40.6 30.9)" />
      <rect x={5} y={30} width={2.8} height={1.6} rx={0.5} fill="#4E7A4F" transform="rotate(40 6.4 30.8)" />
      <circle cx={40} cy={10} r={1.4} fill="#E8697D" />
      <circle cx={8.5} cy={21} r={1.2} fill="#E8A33D" />
      <circle cx={42} cy={21} r={1.1} fill="#5B93C4" />
      <path d="M33 5 q2 -2.4 4 0 t4 0" stroke="#5B93C4" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M3.5 17 q1.6 -2.4 3.2 0 t3.2 0" stroke="#E8697D" strokeWidth={1.3} fill="none" strokeLinecap="round" />
    </>
  );
}

const ICONS: Record<string, (props: { u: U }) => React.ReactElement> = {
  Daycare,
  Boarding,
  Pool,
  Park,
  Cafe,
  Grooming,
  "Play School": PlaySchool,
  Events,
};

export default function ExperienceIcon({
  label,
  size = 34,
}: {
  label: string;
  size?: number;
}) {
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const Icon = ICONS[label];
  if (!Icon) return null;

  const u: U = (name) => `${prefix}-${name}`;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <Defs u={u} />
      <Icon u={u} />
    </svg>
  );
}
