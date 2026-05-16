import { Music2, Play, SkipForward, Square } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  audio: string;
  avatar?: string;
};

const audioFiles = import.meta.glob<string>("../../../music/*/*.{mp3,m4a,wav,ogg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const avatarFiles = import.meta.glob<string>("../../../music/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

function getFolder(path: string) {
  return path.split("/").slice(0, -1).join("/");
}

function getFilename(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? "";
}

function getSongTitle(folder: string) {
  const parts = folder.split("/");
  return (parts[parts.length - 1] ?? "Untitled").replace(/[-_]+/g, " ").trim();
}

function buildTracks() {
  const avatarsByFolder = new Map<string, string>();

  Object.entries(avatarFiles).forEach(([path, avatar]) => {
    const folder = getFolder(path);
    const filename = getFilename(path).toLowerCase();
    const existing = avatarsByFolder.get(folder);

    if (!existing || filename.startsWith("avatar.")) {
      avatarsByFolder.set(folder, avatar);
    }
  });

  return Object.entries(audioFiles)
    .map(([path, audio]) => {
      const folder = getFolder(path);

      return {
        id: path,
        title: getSongTitle(folder),
        audio,
        avatar: avatarsByFolder.get(folder),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

const tracks = buildTracks();
const bars = Array.from({ length: 10 }, (_, index) => index);
const FADE_IN_MS = 720;
const FADE_OUT_MS = 560;
const FULL_VOLUME = 1;

function pickTrack(current?: Track) {
  if (tracks.length === 0) return undefined;

  const pool =
    current && tracks.length > 1 ? tracks.filter((track) => track.id !== current.id) : tracks;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function MusicPlayer() {
  const [current, setCurrent] = useState<Track | undefined>(() => pickTrack());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [effectKey, setEffectKey] = useState(0);
  const [titleMotion, setTitleMotion] = useState({
    isOverflowing: false,
    distance: 0,
    duration: 6,
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const stopTimeoutRef = useRef<number | undefined>(undefined);
  const fadeFrameRef = useRef<number | undefined>(undefined);
  const fadeTokenRef = useRef(0);
  const playRequestRef = useRef(0);
  const titleWindowRef = useRef<HTMLSpanElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const hasTracks = tracks.length > 0;
  const title = current?.title ?? "No music";
  const avatarGradient = current?.avatar
    ? `linear-gradient(90deg, rgba(24,24,27,0.9), rgba(24,24,27,0.18)), url(${current.avatar})`
    : "linear-gradient(90deg, #18181b, #52525b)";

  function cancelAudioFade() {
    fadeTokenRef.current += 1;

    if (fadeFrameRef.current !== undefined) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = undefined;
    }
  }

  function fadeAudioVolume(targetVolume: number, duration: number, onComplete?: () => void) {
    const audio = audioRef.current;
    if (!audio) return;

    cancelAudioFade();

    const startVolume = audio.volume;
    const volumeDelta = targetVolume - startVolume;
    const startedAt = performance.now();
    const token = fadeTokenRef.current;

    const step = (now: number) => {
      if (token !== fadeTokenRef.current) return;

      const progress = Math.min(Math.max((now - startedAt) / duration, 0), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      audio.volume = Math.min(Math.max(startVolume + volumeDelta * easedProgress, 0), 1);

      if (progress < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      fadeFrameRef.current = undefined;
      audio.volume = targetVolume;
      onComplete?.();
    };

    fadeFrameRef.current = window.requestAnimationFrame(step);
  }

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;

      cancelAudioFade();
      playRequestRef.current += 1;

      if (stopTimeoutRef.current !== undefined) {
        window.clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = undefined;
      }

      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, []);

  useEffect(() => {
    const titleWindow = titleWindowRef.current;
    const titleText = titleTextRef.current;
    if (!titleWindow || !titleText) return;

    const updateTitleMotion = () => {
      const overflowDistance = Math.ceil(titleText.scrollWidth - titleWindow.clientWidth);
      const isOverflowing = overflowDistance > 2;
      const distance = isOverflowing ? overflowDistance + 10 : 0;
      const duration = isOverflowing ? Math.min(Math.max(distance / 14, 5.2), 9.5) : 6;

      setTitleMotion((previous) => {
        if (
          previous.isOverflowing === isOverflowing &&
          previous.distance === distance &&
          previous.duration === duration
        ) {
          return previous;
        }

        return { isOverflowing, distance, duration };
      });
    };

    updateTitleMotion();

    let resizeObserver: ResizeObserver | undefined;

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateTitleMotion);
      resizeObserver.observe(titleWindow);
      resizeObserver.observe(titleText);
    }

    window.addEventListener("resize", updateTitleMotion);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateTitleMotion);
    };
  }, [title]);

  const playTrack = async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    cancelAudioFade();

    if (stopTimeoutRef.current !== undefined) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = undefined;
    }

    setCurrent(track);
    setPlaybackError(false);
    setIsStopping(false);
    const playRequest = ++playRequestRef.current;
    audio.volume = 0;
    audio.src = track.audio;
    audio.currentTime = 0;

    try {
      await audio.play();
      if (playRequest !== playRequestRef.current) return;

      setIsPlaying(true);
      setEffectKey((key) => key + 1);
      fadeAudioVolume(FULL_VOLUME, FADE_IN_MS);
    } catch {
      if (playRequest !== playRequestRef.current) return;

      setIsPlaying(false);
      setPlaybackError(true);
      audio.volume = FULL_VOLUME;
    }
  };

  const stopTrack = () => {
    const audio = audioRef.current;
    if (!audio) return;

    playRequestRef.current += 1;
    setIsPlaying(false);
    setIsStopping(true);
    setPlaybackError(false);
    setEffectKey((key) => key + 1);

    if (stopTimeoutRef.current !== undefined) {
      window.clearTimeout(stopTimeoutRef.current);
    }

    stopTimeoutRef.current = window.setTimeout(() => {
      setIsStopping(false);
      stopTimeoutRef.current = undefined;
    }, FADE_OUT_MS + 80);

    fadeAudioVolume(0, FADE_OUT_MS, () => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = FULL_VOLUME;
    });
  };

  const handlePlayback = () => {
    if (isPlaying) {
      stopTrack();
      return;
    }

    const track = current ?? pickTrack();
    if (!track) return;

    void playTrack(track);
  };

  const handleChangeTrack = () => {
    const track = pickTrack(current);
    if (!track) return;

    if (isPlaying) {
      void playTrack(track);
      return;
    }

    setCurrent(track);
    setPlaybackError(false);
    setIsStopping(false);
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setPlaybackError(true);
        }}
      />

      <div
        className="group relative flex h-9 w-44 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-950 text-white shadow-[0_1px_0_rgba(24,24,27,0.04)] transition-colors dark:border-zinc-700 dark:bg-zinc-950 sm:w-64"
        aria-label={hasTracks ? `${isPlaying ? "Playing" : "Ready"} ${title}` : "No music found"}
      >
        <span
          className="absolute inset-0 bg-cover bg-center opacity-35 transition-opacity group-hover:opacity-45"
          style={{ backgroundImage: avatarGradient }}
        />
        <span className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/58 to-black/72" />

        <AnimatePresence>
          {(isPlaying || isStopping) && (
            <motion.span
              key={`${current?.id ?? "music"}-${effectKey}`}
              className="absolute inset-y-0 left-0 w-full origin-left bg-cover bg-center"
              style={{ backgroundImage: avatarGradient }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={
                isStopping
                  ? { opacity: [0.72, 0.28, 0], scaleX: [1, 0.52, 0] }
                  : { opacity: [0, 0.72, 0.45], scaleX: [0, 1.04, 1] }
              }
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: isStopping ? 0.38 : 0.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <span className="relative flex h-full min-w-0 flex-1 items-center gap-1.5 p-1">
          <button
            type="button"
            onClick={handlePlayback}
            disabled={!hasTracks}
            title={isPlaying ? `Stop ${title}` : `Play ${title}`}
            aria-label={isPlaying ? `Stop ${title}` : `Play ${title}`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>

          <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded border border-white/15 bg-white/10">
            {current?.avatar ? (
              <img src={current.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <Music2 size={15} className="opacity-80" />
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span
              ref={titleWindowRef}
              className={`relative block h-3 min-w-0 overflow-hidden ${
                titleMotion.isOverflowing ? "music-title-mask" : ""
              }`}
            >
              <span
                ref={titleTextRef}
                className={`block whitespace-nowrap text-[10px] font-semibold leading-3 tracking-normal ${
                  titleMotion.isOverflowing ? "music-title-marquee" : "truncate"
                }`}
                style={
                  titleMotion.isOverflowing
                    ? ({
                        "--music-title-distance": `${titleMotion.distance}px`,
                        "--music-title-duration": `${titleMotion.duration}s`,
                      } as CSSProperties)
                    : undefined
                }
              >
                {title}
              </span>
            </span>

            <span className="relative mt-0.5 flex h-3 items-center gap-0.5 overflow-hidden rounded bg-white/10 px-1">
              <motion.span
                className="absolute inset-0 origin-left bg-cover bg-center"
                style={{ backgroundImage: avatarGradient }}
                animate={{
                  opacity: isPlaying ? 0.74 : isStopping ? 0.22 : 0.18,
                  scaleX: isPlaying ? 1 : isStopping ? 0.32 : 0.08,
                }}
                transition={{ duration: isPlaying ? 0.45 : 0.34, ease: "easeOut" }}
              />
              <span className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
              {bars.map((bar) => (
                <motion.span
                  key={bar}
                  className="relative z-10 w-1 rounded-full bg-white"
                  style={{
                    backgroundImage: current?.avatar
                      ? `linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.48)), url(${current.avatar})`
                      : undefined,
                    backgroundPosition: `${bar * 9}% center`,
                    backgroundSize: "72px 28px",
                  }}
                  animate={
                    isPlaying
                      ? {
                          height: [
                            `${30 + (bar % 4) * 10}%`,
                            `${90 - (bar % 5) * 8}%`,
                            `${42 + (bar % 3) * 12}%`,
                          ],
                        }
                      : { height: isStopping ? "18%" : "32%" }
                  }
                  transition={{
                    duration: 0.48 + (bar % 4) * 0.08,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </span>

            <span className="sr-only" aria-live="polite">
              {isPlaying ? "now playing" : playbackError ? "music paused" : "music"}
            </span>
          </span>

          <button
            type="button"
            onClick={handleChangeTrack}
            disabled={!hasTracks}
            title="Change song"
            aria-label="Change song"
            className="grid h-7 w-7 shrink-0 place-items-center rounded border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SkipForward size={14} />
          </button>
        </span>
      </div>
    </>
  );
}
