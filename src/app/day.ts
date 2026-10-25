export type TimeSlot = {
  id: string;
  label: string;
  vn: string;
  topic: string;
  time: string;
  sky: string;
  ink: string;
  accent: string;
};

export const timeSlots: TimeSlot[] = [
  { id: "dawn", label: "Dawn", vn: "rạng đông", topic: "Profile", time: "05:00", sky: "#141833", ink: "#E9E6F2", accent: "#F4A6B4" },
  { id: "sunrise", label: "Sunrise", vn: "bình minh", topic: "Objective", time: "06:30", sky: "#F6EADB", ink: "#2A1A12", accent: "#F26B1D" },
  { id: "midday", label: "Midday", vn: "giữa trưa", topic: "Experience", time: "12:00", sky: "#F7F7F2", ink: "#0A0A0A", accent: "#E63228" },
  { id: "sunset", label: "Sunset", vn: "hoàng hôn", topic: "Skills", time: "18:00", sky: "#E0602F", ink: "#1F0B06", accent: "#FFE0A3" },
  { id: "dusk", label: "Dusk", vn: "chạng vạng", topic: "Education", time: "19:00", sky: "#2F2A55", ink: "#F1E6F7", accent: "#FF8B6A" },
  { id: "twilight", label: "Twilight", vn: "nhá nhem", topic: "Contact", time: "20:00", sky: "#0B1020", ink: "#E8ECF5", accent: "#A8D8FF" },
];

export const slotById = Object.fromEntries(timeSlots.map((slot) => [slot.id, slot])) as Record<string, TimeSlot>;

// Section ids from earlier versions of the site, which shared links may still use.
export const legacyHashes: Record<string, string> = {
  about: "sunrise",
  education: "dusk",
  experience: "midday",
  contact: "twilight",
};

// The Day clock reads this at the very bottom of the page.
export const END_OF_DAY = "21:00";

export function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatClock(totalMinutes: number) {
  const minutes = Math.round(totalMinutes);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
