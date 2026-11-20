// A Sky is a soft, Weather-app gradient: colour stops from the top of the screen to the bottom,
// plus glows (sun, horizon, moon) as ellipses in fractions of the screen. One definition paints
// both a Card (CSS) and the ambient light behind the Switcher (canvas), so the two always match.
export type Glow = { x: number; y: number; rx: number; ry: number; rgb: [number, number, number]; alpha: number };

export type Sky = {
  stops: Array<[offset: number, color: string]>;
  glows: Glow[];
};

export type TimeSlot = {
  id: string;
  topic: string;
  time: string;
  sky: Sky;
};

export const timeSlots: TimeSlot[] = [
  {
    // First light over the sea, taken from the colours of the Profile photo.
    id: "dawn",
    topic: "Profile",
    time: "05:00",
    sky: {
      stops: [[0, "#4D5D69"], [0.36, "#8C8073"], [0.5, "#C68953"], [0.64, "#6F5B4E"], [1, "#1F1E25"]],
      glows: [{ x: 0.5, y: 0.5, rx: 0.75, ry: 0.2, rgb: [255, 176, 96], alpha: 0.5 }],
    },
  },
  {
    id: "sunrise",
    topic: "Objective",
    time: "06:30",
    sky: {
      stops: [[0, "#365690"], [0.45, "#7586BA"], [0.78, "#D3A2B2"], [1, "#F0C29E"]],
      glows: [{ x: 0.5, y: 1.05, rx: 0.95, ry: 0.45, rgb: [255, 206, 150], alpha: 0.7 }],
    },
  },
  {
    id: "midday",
    topic: "Experience",
    time: "12:00",
    sky: {
      stops: [[0, "#165AC0"], [0.55, "#3A82D8"], [1, "#78B1EA"]],
      glows: [{ x: 0.88, y: -0.04, rx: 0.6, ry: 0.42, rgb: [255, 253, 236], alpha: 0.42 }],
    },
  },
  {
    id: "afternoon",
    topic: "Playground",
    time: "15:00",
    sky: {
      stops: [[0, "#1D58A4"], [0.6, "#4A86C8"], [1, "#89B2D6"]],
      glows: [{ x: 1, y: 0.95, rx: 0.8, ry: 0.5, rgb: [255, 198, 118], alpha: 0.5 }],
    },
  },
  {
    id: "sunset",
    topic: "Skills",
    time: "18:00",
    sky: {
      stops: [[0, "#272E5E"], [0.36, "#613F79"], [0.62, "#B35579"], [0.86, "#E87E58"], [1, "#F4A35E"]],
      glows: [{ x: 0.5, y: 1.02, rx: 0.95, ry: 0.36, rgb: [255, 168, 90], alpha: 0.6 }],
    },
  },
  {
    id: "dusk",
    topic: "Education",
    time: "19:00",
    sky: {
      stops: [[0, "#101434"], [0.5, "#22285A"], [0.85, "#45376D"], [1, "#664271"]],
      glows: [{ x: 0.5, y: 1.06, rx: 1, ry: 0.3, rgb: [236, 118, 110], alpha: 0.42 }],
    },
  },
  {
    id: "twilight",
    topic: "Contact",
    time: "20:00",
    sky: {
      stops: [[0, "#04070F"], [0.55, "#0A1125"], [1, "#15203D"]],
      glows: [{ x: 0.82, y: 0.12, rx: 0.36, ry: 0.26, rgb: [160, 190, 255], alpha: 0.13 }],
    },
  },
];

export const slotById = Object.fromEntries(timeSlots.map((slot) => [slot.id, slot])) as Record<string, TimeSlot>;

/** The colour at the top of a Sky, for the browser's theme-color. */
export function skyTop(sky: Sky) {
  return sky.stops[0][1];
}

const rgba = ([r, g, b]: Glow["rgb"], alpha: number) => `rgba(${r},${g},${b},${alpha})`;

export function skyCss(sky: Sky) {
  const glows = sky.glows.map(
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

  for (const glow of sky.glows) {
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
