// A Sky is a soft, Weather-app gradient: colour stops from the top of the screen to the bottom,
// plus a sun and a moon glow as ellipses in fractions of the screen. One definition paints both a
// Card (CSS) and the ambient light behind the Switcher (canvas), so the two always match.
//
// Every Sky has the same shape, five stops and both glows (a glow that is down has alpha 0), so the
// ambient light can blend two Skies as data rather than fading one picture into another: the
// horizon slides, the sun glides, and the colours stay vivid halfway (see mixSky). The seven Skies
// are paced so each swipe changes the colour by about as much as the next (ADR 0007).
type RGB = [number, number, number];

export type Glow = { x: number; y: number; rx: number; ry: number; rgb: RGB; alpha: number };

export type Sky = {
  stops: Array<[offset: number, color: string]>;
  sun: Glow;
  moon: Glow;
};

export type TimeSlot = {
  id: string;
  topic: string;
  time: string;
  sky: Sky;
};

// The moon keeps one place in the sky and only shows after dark.
const moon = (alpha: number): Glow => ({ x: 0.82, y: 0.12, rx: 0.36, ry: 0.26, rgb: [160, 190, 255], alpha });

export const timeSlots: TimeSlot[] = [
  {
    // First light over the sea, taken from the colours of the Profile photo.
    id: "dawn",
    topic: "Profile",
    time: "05:00",
    sky: {
      stops: [[0, "#4F5D70"], [0.36, "#95816F"], [0.5, "#D38B4F"], [0.66, "#76594A"], [1, "#262029"]],
      sun: { x: 0.5, y: 0.5, rx: 0.8, ry: 0.22, rgb: [255, 178, 98], alpha: 0.5 },
      moon: moon(0),
    },
  },
  {
    id: "sunrise",
    topic: "Objective",
    time: "06:30",
    sky: {
      stops: [[0, "#485A8A"], [0.36, "#7882AD"], [0.58, "#B094AE"], [0.8, "#DAA39E"], [1, "#EDB98F"]],
      sun: { x: 0.5, y: 1.05, rx: 0.95, ry: 0.45, rgb: [255, 200, 140], alpha: 0.62 },
      moon: moon(0),
    },
  },
  {
    id: "midday",
    topic: "Experience",
    time: "12:00",
    sky: {
      stops: [[0, "#245FB8"], [0.3, "#3271C8"], [0.6, "#4B8AD6"], [0.82, "#69A1DF"], [1, "#86B5E6"]],
      sun: { x: 0.86, y: -0.04, rx: 0.62, ry: 0.42, rgb: [255, 251, 232], alpha: 0.4 },
      moon: moon(0),
    },
  },
  {
    // A deeper blue than Midday, with the gold low on the horizon that Sunset picks up.
    id: "afternoon",
    topic: "Playground",
    time: "15:00",
    sky: {
      stops: [[0, "#22498A"], [0.3, "#2F5B9E"], [0.6, "#5677AA"], [0.82, "#9894A6"], [1, "#DAA57C"]],
      sun: { x: 0.8, y: 1, rx: 0.9, ry: 0.48, rgb: [255, 188, 108], alpha: 0.6 },
      moon: moon(0),
    },
  },
  {
    id: "sunset",
    topic: "Skills",
    time: "18:00",
    sky: {
      stops: [[0, "#2D3466"], [0.32, "#55407E"], [0.58, "#9C5280"], [0.82, "#D8735E"], [1, "#EE985C"]],
      sun: { x: 0.5, y: 1.02, rx: 0.95, ry: 0.36, rgb: [255, 166, 92], alpha: 0.58 },
      moon: moon(0),
    },
  },
  {
    // An afterglow on the horizon, so night does not fall all at once after Sunset.
    id: "dusk",
    topic: "Education",
    time: "19:00",
    sky: {
      stops: [[0, "#1A1E48"], [0.32, "#282C62"], [0.58, "#3D3677"], [0.82, "#66477D"], [1, "#94557A"]],
      sun: { x: 0.5, y: 1.06, rx: 1, ry: 0.32, rgb: [236, 120, 110], alpha: 0.42 },
      moon: moon(0.04),
    },
  },
  {
    id: "twilight",
    topic: "Contact",
    time: "20:00",
    sky: {
      stops: [[0, "#070A16"], [0.32, "#0B1124"], [0.58, "#101830"], [0.82, "#16203D"], [1, "#1D2747"]],
      sun: { x: 0.5, y: 1.1, rx: 1, ry: 0.3, rgb: [200, 110, 130], alpha: 0.1 },
      moon: moon(0.13),
    },
  },
];

export const slotById = Object.fromEntries(timeSlots.map((slot) => [slot.id, slot])) as Record<string, TimeSlot>;

/** The colour at the top of a Sky, for the browser's theme-color. */
export function skyTop(sky: Sky) {
  return sky.stops[0][1];
}

const rgba = ([r, g, b]: RGB, alpha: number) => `rgba(${r},${g},${b},${alpha})`;
const lit = (sky: Sky) => [sky.sun, sky.moon].filter((glow) => glow.alpha > 0);

export function skyCss(sky: Sky) {
  const glows = lit(sky).map(
    (glow) =>
      `radial-gradient(${glow.rx * 100}% ${glow.ry * 100}% at ${glow.x * 100}% ${glow.y * 100}%, ${rgba(glow.rgb, glow.alpha)}, ${rgba(glow.rgb, 0)})`,
  );
  const stops = sky.stops.map(([offset, color]) => `${color} ${offset * 100}%`).join(", ");
  return [...glows, `linear-gradient(180deg, ${stops})`].join(", ");
}

export function paintSky(context: CanvasRenderingContext2D, sky: Sky, width: number, height: number) {
  const base = context.createLinearGradient(0, 0, 0, height);
  sky.stops.forEach(([offset, color]) => base.addColorStop(offset, color));
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);

  for (const glow of lit(sky)) {
    context.save();
    context.translate(glow.x * width, glow.y * height);
    context.scale(glow.rx * width, glow.ry * height);
    const light = context.createRadialGradient(0, 0, 0, 0, 0, 1);
    light.addColorStop(0, rgba(glow.rgb, glow.alpha));
    light.addColorStop(1, rgba(glow.rgb, 0));
    context.fillStyle = light;
    context.fillRect(-1, -1, 2, 2);
    context.restore();
  }
}

// Colours blend in OKLCH: lightness, chroma and hue each move evenly, so a blend keeps its colour
// where a plain RGB mix would pass through grey (peach to blue goes by way of lavender).
const toLinear = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toByte = (c: number) => {
  const v = Math.min(1, Math.max(0, c));
  return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055));
};

function toOklch([r, g, b]: RGB) {
  const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, C: Math.hypot(A, Bb), h: Math.atan2(Bb, A) };
}

function fromOklch(L: number, C: number, h: number): RGB {
  const A = C * Math.cos(h);
  const Bb = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * Bb) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * Bb) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * Bb) ** 3;
  return [
    toByte(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toByte(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toByte(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const parse = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;

function mixColor(from: RGB, to: RGB, t: number): RGB {
  const a = toOklch(from);
  const b = toOklch(to);
  // A near-grey has no real hue of its own, so it takes the other colour's.
  const ha = a.C < 0.02 ? b.h : a.h;
  const hb = b.C < 0.02 ? a.h : b.h;
  // The short way round the hue circle.
  const turn = ((hb - ha + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  return fromOklch(a.L + (b.L - a.L) * t, a.C + (b.C - a.C) * t, ha + turn * t);
}

function mixGlow(from: Glow, to: Glow, t: number): Glow {
  const lerp = (key: "x" | "y" | "rx" | "ry" | "alpha") => from[key] + (to[key] - from[key]) * t;
  // A glow glides to its next place, but one with far to go dims on the way, as the sun sets and
  // rises again, instead of crossing the middle of the screen.
  const travel = Math.min(1, Math.hypot(to.x - from.x, to.y - from.y));
  const dim = 1 - 0.9 * travel * Math.sin(Math.PI * t);
  return { x: lerp("x"), y: lerp("y"), rx: lerp("rx"), ry: lerp("ry"), alpha: lerp("alpha") * dim, rgb: mixColor(from.rgb, to.rgb, t) };
}

/** The Sky a fraction t of the way from one Sky to the next, stop by stop and glow by glow. */
export function mixSky(from: Sky, to: Sky, t: number): Sky {
  return {
    stops: from.stops.map(([offset, color], index) => {
      const [nextOffset, nextColor] = to.stops[index];
      const [r, g, b] = mixColor(parse(color), parse(nextColor), t);
      return [offset + (nextOffset - offset) * t, `rgb(${r},${g},${b})`];
    }),
    sun: mixGlow(from.sun, to.sun, t),
    moon: mixGlow(from.moon, to.moon, t),
  };
}

// An open Poster's address is its Topic: #experience.
export function slotHash(slot: TimeSlot) {
  return slot.topic.toLowerCase();
}

// Addresses from earlier versions of the site, which shared links may still use: old section
// names, and Time slot ids from when the Posters were named after them.
const hashAliases: Record<string, string> = {
  about: "sunrise",
  playlist: "midday",
  projects: "afternoon",
};

// The Poster a hash or path segment points at, or -1 for none.
export function slotIndexFromHash(hash: string) {
  const key = hash.replace(/^[#/]+/, "").replace(/\/+$/, "").toLowerCase();
  if (!key) return -1;
  const id = hashAliases[key] ?? key;
  return timeSlots.findIndex((slot) => slotHash(slot) === key || slot.id === id);
}

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatClock(totalMinutes: number) {
  const minutes = Math.round(totalMinutes);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
