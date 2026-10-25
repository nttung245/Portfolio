import { slotById } from "../../day";
import { bio, profile, roles } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.sunrise;
const avatar = new URL("../../../../my_picture/my_avatar.jpg", import.meta.url).href;

export function SunrisePoster() {
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} title="About" />

      <div className="motif mt-8 flex flex-1 flex-col justify-end">
        {/* Everything above the horizon line is clipped by it, so the sun and roles rise out of it. */}
        <div className="relative h-[min(64vw,52vh)] overflow-hidden">
          <div className="sun absolute inset-x-0 bottom-0 mx-auto aspect-square h-full overflow-hidden rounded-full bg-accent isolate">
            <img
              src={avatar}
              alt={profile.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover grayscale contrast-125 mix-blend-multiply"
            />
          </div>
          <p
            aria-hidden="true"
            className="roles absolute inset-x-0 bottom-0 h-[0.9em] overflow-hidden text-center font-display text-[length:min(12.5vw,17vh)] font-[850] uppercase leading-[0.9] text-sky [-webkit-text-stroke:2.5px_var(--ink)] [font-stretch:75%] [paint-order:stroke_fill]"
          >
            {roles.map((role) => (
              <span key={role} className="role-word absolute inset-x-0 bottom-0 block">
                {role}
              </span>
            ))}
          </p>
        </div>
        <div aria-hidden="true" className="h-0.5 bg-ink" />
      </div>

      <div className="mt-8 grid gap-4 font-mono text-[14px] leading-7 md:grid-cols-2 md:gap-10">
        {bio.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </Poster>
  );
}
