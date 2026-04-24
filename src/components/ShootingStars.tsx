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

const MIN_SPAWN_GAP_MS = 4200;
const MAX_SPAWN_GAP_MS = 11000;
const FIRST_SPAWN_DELAY_MS = 2000;

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
 * Occasionally spawns a single shooting-star streak at a randomized position,
 * angle, length, and speed. Streaks clean themselves up once their CSS
 * animation finishes. When `disabled` is true (e.g. reduced-motion preference)
 * no streaks are scheduled or rendered.
 */
export function ShootingStars({ disabled = false }: ShootingStarsProps) {
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    if (disabled) return;

    let nextId = 0;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = (delay: number) => {
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        const streak = makeStreak(nextId++);
        setStreaks((prev) => [...prev, streak]);
        scheduleNext(randomBetween(MIN_SPAWN_GAP_MS, MAX_SPAWN_GAP_MS));
      }, delay);
    };

    scheduleNext(FIRST_SPAWN_DELAY_MS);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [disabled]);

  if (disabled) return null;

  const handleAnimationEnd = (id: number) => {
    setStreaks((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      {streaks.map((s) => (
        <span
          key={s.id}
          aria-hidden
          className="shooting-star"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.length}px`,
              animationDuration: `${s.duration}ms`,
              "--shoot-angle": `${s.angle}deg`,
            } as CSSProperties
          }
          onAnimationEnd={() => handleAnimationEnd(s.id)}
        />
      ))}
    </>
  );
}
