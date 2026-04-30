"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { P_SMOOTH } from "@/lib/projectDeck";

/**
 * 0..1 from wheel and touch. Target moves immediately; `p` eases for fluid motion.
 * At 0/1 (smoothed) we allow default scrolling (leave section / reach footer).
 */
export function useDeckScrollProgress(n: number) {
  const [p, setP] = useState(0);
  const pTargetRef = useRef(0);
  const pSmoothRef = useRef(0);
  const rafRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchYRef = useRef<number | null>(null);
  const tickRef = useRef<(() => void) | null>(null);

  const tick = useCallback(() => {
    rafRef.current = 0;
    const target = pTargetRef.current;
    const sm = pSmoothRef.current;
    const next = sm + (target - sm) * P_SMOOTH;
    const done = Math.abs(target - next) < 0.00035;
    const out = done ? target : next;
    pSmoothRef.current = out;
    setP(out);
    if (!done) {
      rafRef.current = requestAnimationFrame(() => {
        tickRef.current?.();
      });
    }
  }, []);

  useLayoutEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const runTowardTarget = useCallback(() => {
    if (rafRef.current) {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      tickRef.current?.();
    });
  }, []);

  const bumpByDelta = useCallback(
    (delta: number) => {
      pTargetRef.current = Math.max(0, Math.min(1, pTargetRef.current + delta));
      runTowardTarget();
    },
    [runTowardTarget],
  );

  const setInstant = useCallback((v: number) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    const c = Math.max(0, Math.min(1, v));
    pTargetRef.current = c;
    pSmoothRef.current = c;
    setP(c);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) {
      return;
    }
    const wheelScale = 2000 * Math.sqrt(Math.max(1, n) / 3);
    const normDeltaY = (e: WheelEvent) => {
      if (e.deltaMode === 1) {
        return e.deltaY * 16;
      }
      if (e.deltaMode === 2) {
        return e.deltaY * (el.clientHeight || 600);
      }
      return e.deltaY;
    };

    const onWheel = (e: WheelEvent) => {
      const sm = pSmoothRef.current;
      const ta = pTargetRef.current;
      const dy = normDeltaY(e);
      if (ta <= 0 && dy < 0 && sm <= 0.001) {
        return;
      }
      if (ta >= 1 && dy > 0 && sm >= 0.999) {
        return;
      }
      e.preventDefault();
      bumpByDelta(dy / wheelScale);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchYRef.current = e.touches[0].clientY;
      } else {
        touchYRef.current = null;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || touchYRef.current === null) {
        return;
      }
      const y = e.touches[0].clientY;
      const dy = touchYRef.current - y;
      touchYRef.current = y;
      const sm = pSmoothRef.current;
      const ta = pTargetRef.current;
      if (ta <= 0 && dy < 0 && sm <= 0.001) {
        return;
      }
      if (ta >= 1 && dy > 0 && sm >= 0.999) {
        return;
      }
      e.preventDefault();
      bumpByDelta(dy / wheelScale);
    };

    const onTouchEnd = () => {
      touchYRef.current = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== "ArrowDown" &&
        e.key !== "ArrowUp" &&
        e.key !== "PageDown" &&
        e.key !== "PageUp" &&
        e.key !== "Home" &&
        e.key !== "End"
      ) {
        return;
      }
      const sm = pSmoothRef.current;
      const ta = pTargetRef.current;
      if (e.key === "End") {
        if (ta >= 1) {
          return;
        }
        e.preventDefault();
        setInstant(1);
        return;
      }
      if (e.key === "Home") {
        if (ta <= 0) {
          return;
        }
        e.preventDefault();
        setInstant(0);
        return;
      }
      let delta = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        delta = 0.05;
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        delta = -0.05;
      }
      if (ta <= 0 && delta < 0 && sm <= 0.001) {
        return;
      }
      if (ta >= 1 && delta > 0 && sm >= 0.999) {
        return;
      }
      e.preventDefault();
      bumpByDelta(delta);
    };

    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      el.removeEventListener("wheel", onWheel, { capture: true });
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [bumpByDelta, n, setInstant]);

  return { p, trackRef };
}
