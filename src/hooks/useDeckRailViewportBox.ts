"use client";

import {
  useCallback,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";

/** Syncs a fixed, viewport-right rail to an element’s vertical box (deck scroll hint). */
export function useDeckRailViewportBox(anchorRef: RefObject<HTMLElement | null>) {
  const [box, setBox] = useState({ top: 0, height: 0 });
  const update = useCallback(() => {
    const el = anchorRef.current;
    if (!el) {
      return;
    }
    const r = el.getBoundingClientRect();
    setBox({ top: r.top, height: r.height });
  }, [anchorRef]);

  useLayoutEffect(() => {
    update();
    const el = anchorRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(update);
    });
    ro.observe(el);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { capture: true, passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, { capture: true });
    };
  }, [update, anchorRef]);

  return box;
}
