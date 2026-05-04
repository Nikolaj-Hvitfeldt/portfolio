"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Streak = {
  id: number;
  top: number;
  left: number;
  length: number;
  angle: number;
  duration: number;
};

const MIN_SPAWN_GAP_MS = 2600;
const MAX_SPAWN_GAP_MS = 7000;
const FIRST_SPAWN_DELAY_MS = 1200;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeStreak(id: number): Streak {
  return {
    id,
    top: randomBetween(4, 35),
    left: randomBetween(8, 65),
    length: randomBetween(260, 440),
    angle: randomBetween(38, 58),
    duration: randomBetween(1000, 1600),
  };
}

type ShootingStarsProps = {
  disabled?: boolean;
};

/**
 * Occasionally spawns a single shooting-star streak. At most one streak
 * exists at a time (replaces the previous) so the UI never shows a “burst”.
 *
 * Spawning is paused while the tab is hidden: background timers are heavily
 * throttled and `animationend` may not run, which previously let many stars
 * pile up. On `visibilitychange` back to visible we clear pending timers
 * and schedule a single next spawn.
 */
export function ShootingStars({ disabled = false }: ShootingStarsProps) {
  const [streak, setStreak] = useState<Streak | null>(null);

  useEffect(() => {
    if (disabled) return;

    let nextId = 0;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = (delay: number) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(tick, delay);
    };

    const tick = () => {
      if (cancelled) return;
      if (document.hidden) return;
      setStreak(makeStreak(nextId++));
      scheduleNext(randomBetween(MIN_SPAWN_GAP_MS, MAX_SPAWN_GAP_MS));
    };

    const onVisibility = () => {
      if (cancelled) return;
      if (document.hidden) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      } else {
        scheduleNext(
          randomBetween(MIN_SPAWN_GAP_MS, MAX_SPAWN_GAP_MS),
        );
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    scheduleNext(FIRST_SPAWN_DELAY_MS);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [disabled]);

  if (disabled) return null;

  const handleAnimationEnd = () => {
    setStreak(null);
  };

  if (!streak) return null;

  return (
    <span
      key={streak.id}
      aria-hidden
      className="shooting-star"
      style={
        {
          top: `${streak.top}%`,
          left: `${streak.left}%`,
          width: `${streak.length}px`,
          animationDuration: `${streak.duration}ms`,
          "--shoot-angle": `${streak.angle}deg`,
        } as CSSProperties
      }
      onAnimationEnd={handleAnimationEnd}
    />
  );
}
