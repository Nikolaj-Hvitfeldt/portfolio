"use client";

import {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const DESKTOP_MQ = "(min-width: 768px)";

function subscribeMinWidth768(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(DESKTOP_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function snapshotIsDesktop() {
  return typeof window === "undefined"
    ? true
    : window.matchMedia(DESKTOP_MQ).matches;
}

const AVATAR_SRC_DOM = "/me-avatar.png";
const AVATAR_SRC_BAKED = "/me-avatar-with-pupils.png";

const STATIC_TABLET_CLASS =
  "object-[68%_40%] brightness-[1.08] contrast-[1.12] saturate-[1.08] mix-blend-normal motion-reduce:brightness-100";

/**
 * Desktop: `object-position` + DOM pupils + gaze — band from the **face** box
 * width (ResizeObserver), not the window. Below `md` we use a baked art asset
 * with pupils so layout stays clean without per-breakpoint % tuning.
 */
type EyeInBox = { top: string; left: string };
type BandKey = 0 | 1 | 2;
const EYE_BY_BAND: Record<
  BandKey,
  {
    objectClass: string;
    left: EyeInBox;
    right: EyeInBox;
    gazeAnchor: { x: number; y: number };
  }
> = {
  /** Narrow face strip (most phones) — matches a looser `object-` + tighter crop. */
  0: {
    objectClass: "object-[72%_42%]",
    left: { top: "35.5%", left: "35%" },
    right: { top: "33.5%", left: "45.2%" },
    gazeAnchor: { x: 0.403, y: 0.345 },
  },
  /** Mid-width strip (short devtool windows, smaller bento) */
  1: {
    objectClass: "object-[70%_41%]",
    left: { top: "36%", left: "35%" },
    right: { top: "33.7%", left: "45.5%" },
    gazeAnchor: { x: 0.402, y: 0.346 },
  },
  /** Wide face strip (typical large desktop bento) */
  2: {
    objectClass: "object-[68%_40%]",
    left: { top: "37%", left: "35%" },
    right: { top: "33.5%", left: "46%" },
    gazeAnchor: { x: 0.405, y: 0.3475 },
  },
};

/** Face `contentRect.width` in px; thresholds separate phone / in-between / wide. */
function bandFromFaceSize(w: number): BandKey {
  if (w < 196) return 0;
  if (w < 256) return 1;
  return 2;
}

const PUPIL_MAX_PX = 4;
const PUPIL_MAX_PX_TOUCH = 3;
/**
 * Clamped to [min, max] before × max px. Right/up are intentionally very small;
 * left/down stay subtle so pupils never swim far from center.
 * - X: min = look left, max = look right
 * - Y: min = look up (pointer above), max = look down
 */
const PUPIL_RANGE_X: readonly [number, number] = [-0.48, 0.12];
const PUPIL_RANGE_Y: readonly [number, number] = [-0.1, 0.3];

/** Pointer span: normalize to ~[-1,1] before PUPIL_RANGE_* (fraction of face size). */
const GAZE_SPAN = { x: 0.4, y: 0.32 } as const;
/** Reference min(face w,h) for full PUPIL_MAX_PX; smaller faces = proportionally less travel. */
const PUPIL_MOTION_SIZE_REF = 200;

/** Desktop eye export (for docs / other imports); use EYE_BY_BAND[2] in app. */
export const AVATAR_EYE_LEFT = EYE_BY_BAND[2].left;
export const AVATAR_EYE_RIGHT = EYE_BY_BAND[2].right;

type Metrics = { stackH: number; topH: number; gap: number };

type HomeBentoStackProps = {
  children: ReactNode;
  /** From parent: disables eye motion to align with other motion prefs. */
  reduceMotion: boolean;
};

const AVATAR_WIDTH_CLASS =
  "w-[min(62%,11rem)] max-w-[200px] sm:max-w-[220px] sm:w-[min(64%,12.5rem)] md:max-w-[240px] md:w-[min(66%,13rem)]";

/**
 * Two stacked bento cards share one continuous avatar: each card clips its "slice" of
 * the same full-height image (gap shows page background). DOM pupils in the top slice.
 */
export function HomeBentoStack({
  children,
  reduceMotion,
}: HomeBentoStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const eyesOff = reduceMotion || prefersReducedMotion;

  const isDesktop = useSyncExternalStore(
    subscribeMinWidth768,
    snapshotIsDesktop,
    () => true,
  );
  const useDomEyes = isDesktop;
  const showPupilLayer = isDesktop && !eyesOff;
  const isDesktopRef = useRef(isDesktop);
  isDesktopRef.current = isDesktop;

  const stackRef = useRef<HTMLDivElement>(null);
  /** face image box in the top slice — same as pupil %; drives responsive gaze. */
  const faceTrackRef = useRef<HTMLDivElement | null>(null);
  /** Stays in sync for pointer handlers (avoids stale gaze when band changes). */
  const gazeConfigRef = useRef(EYE_BY_BAND[2]);
  const touchLikeActiveRef = useRef(false);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [faceW, setFaceW] = useState(320);
  const band = useDomEyes ? bandFromFaceSize(faceW) : 2;
  const eye = EYE_BY_BAND[band];
  if (useDomEyes) {
    gazeConfigRef.current = eye;
  }
  const [metrics, setMetrics] = useState<Metrics>({
    stackH: 0,
    topH: 0,
    gap: 12,
  });

  const measure = useCallback(() => {
    const el = stackRef.current;
    if (!el) return;
    const kids = el.children;
    if (kids.length < 2) return;
    const first = kids[0] as HTMLElement;
    const gapVal = parseFloat(
      getComputedStyle(el).rowGap || getComputedStyle(el).gap || "12",
    );
    setMetrics({
      stackH: el.getBoundingClientRect().height,
      topH: first.getBoundingClientRect().height,
      gap: Number.isFinite(gapVal) && gapVal > 0 ? gapVal : 12,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(() => {
      measure();
    });
    return () => cancelAnimationFrame(id);
  }, [measure]);

  useEffect(() => {
    const el = stackRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(el);
    for (const k of el.children) {
      ro.observe(k);
    }
    return () => ro.disconnect();
  }, [measure]);

  const movePupils = useCallback(
    (clientX: number, clientY: number, pointerType: string) => {
      if (!isDesktopRef.current) return;
      const el = faceTrackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      const g = gazeConfigRef.current.gazeAnchor;
      const cx = rect.left + rect.width * g.x;
      const cy = rect.top + rect.height * g.y;
      const spanX = Math.max(1, rect.width * GAZE_SPAN.x);
      const spanY = Math.max(1, rect.height * GAZE_SPAN.y);
      // Touch: slightly “heavier” pointer so the same movement is less jumpy
      const coarse = pointerType === "touch" ? 1.12 : 1;
      const relX = (clientX - cx) / (spanX * coarse);
      const relY = (clientY - cy) / (spanY * coarse);
      const clampedX = Math.max(
        PUPIL_RANGE_X[0],
        Math.min(PUPIL_RANGE_X[1], relX),
      );
      const clampedY = Math.max(
        PUPIL_RANGE_Y[0],
        Math.min(PUPIL_RANGE_Y[1], relY),
      );
      const size = Math.min(rect.width, rect.height);
      const motionScale = Math.max(
        0.45,
        Math.min(1, size / PUPIL_MOTION_SIZE_REF),
      );
      const baseMax =
        pointerType === "touch" ? PUPIL_MAX_PX_TOUCH : PUPIL_MAX_PX;
      const max = baseMax * motionScale;
      setPupil({ x: clampedX * max, y: clampedY * max });
    },
    [],
  );

  const resetPupils = useCallback(() => {
    setPupil({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (eyesOff) {
      resetPupils();
    }
  }, [eyesOff, resetPupils]);

  useEffect(() => {
    if (eyesOff || !isDesktop) return;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && !touchLikeActiveRef.current) return;
      const kind: "touch" | "mouse" =
        e.pointerType === "touch" ? "touch" : "mouse";
      movePupils(e.clientX, e.clientY, kind);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        movePupils(e.clientX, e.clientY, "mouse");
        return;
      }
      touchLikeActiveRef.current = true;
      movePupils(e.clientX, e.clientY, "touch");
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") return;
      touchLikeActiveRef.current = false;
      resetPupils();
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") return;
      touchLikeActiveRef.current = false;
      resetPupils();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [eyesOff, isDesktop, movePupils, resetPupils]);

  const { stackH, topH, gap } = metrics;
  const bottomSliceTop = stackH > 0 ? -(topH + gap) : 0;
  const items = Children.toArray(children);

  useLayoutEffect(() => {
    if (stackH <= 0 || !isDesktop) return;
    const el = faceTrackRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const onBox = (w: number) => {
      if (w > 0) setFaceW(w);
    };
    onBox(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w != null && w > 0) onBox(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [stackH, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      setPupil({ x: 0, y: 0 });
    }
  }, [isDesktop]);

  if (items.length !== 2) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-3 md:row-span-2 md:col-start-1">
        {children}
      </div>
    );
  }

  const sharedAvatarImageClass = useDomEyes
    ? `object-cover ${eye.objectClass} brightness-[1.08] contrast-[1.12] saturate-[1.08] mix-blend-normal motion-reduce:brightness-100 ${
        eyesOff ? "object-right" : "motion-reduce:object-right"
      }`
    : `object-cover ${STATIC_TABLET_CLASS} ${
        eyesOff ? "object-right" : "motion-reduce:object-right"
      }`;
  const avatarSrc = useDomEyes ? AVATAR_SRC_DOM : AVATAR_SRC_BAKED;

  return (
    <div
      ref={stackRef}
      className="relative flex h-full min-h-0 flex-col gap-3 md:row-span-2 md:col-start-1"
    >
      {items.map((child, index) => {
        const isTop = index === 0;
        return (
          <div
            key={index}
            className="relative z-10 flex min-h-0 w-full flex-1 overflow-hidden rounded-2xl"
          >
            {stackH > 0 && (
              <div
                className="pointer-events-none absolute inset-0 z-0"
                aria-hidden
              >
                <div
                  className={`absolute right-0 z-0 ${AVATAR_WIDTH_CLASS}`}
                  style={{
                    height: stackH,
                    top: isTop ? 0 : bottomSliceTop,
                  }}
                >
                  <div
                    ref={isTop ? faceTrackRef : null}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={avatarSrc}
                      alt=""
                      fill
                      priority={isTop}
                      sizes="(max-width: 768px) 50vw, 250px"
                      className={sharedAvatarImageClass}
                    />
                    {useDomEyes ? (
                      <div
                        className="home-avatar-edge-scrim pointer-events-none absolute inset-0"
                        aria-hidden
                      />
                    ) : null}
                    {isTop && showPupilLayer ? (
                      <div
                        className="pointer-events-none absolute inset-0 z-30"
                        aria-hidden
                      >
                        <span
                          className="home-avatar-pupil"
                          style={{
                            top: eye.left.top,
                            left: eye.left.left,
                            transform: `translate(calc(-50% + ${pupil.x}px), calc(-50% + ${pupil.y}px))`,
                          }}
                        />
                        <span
                          className="home-avatar-pupil"
                          style={{
                            top: eye.right.top,
                            left: eye.right.left,
                            transform: `translate(calc(-50% + ${pupil.x}px), calc(-50% + ${pupil.y}px))`,
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            <div className="relative z-10 flex h-full min-h-0 w-full min-w-0">
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}
