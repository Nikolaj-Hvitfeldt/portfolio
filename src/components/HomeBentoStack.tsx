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

const AVATAR_SRC_DOM = "/me-avatar.avif";
const AVATAR_SRC_BAKED = "/me-avatar-with-pupils.avif";

const STATIC_TABLET_CLASS =
  "object-[68%_40%] brightness-[1.08] contrast-[1.12] saturate-[1.08] mix-blend-normal motion-reduce:brightness-100";

/**
 * Desktop: `object-position` + DOM pupils + gaze — band from the **face** box
 * width (ResizeObserver), not the window. Below `md` we use a baked art asset
 * with pupils so layout stays clean without per-breakpoint % tuning.
 */
type BandKey = 0 | 1 | 2;
type EyePoint = { x: number; y: number };
const EYE_BY_BAND: Record<
  BandKey,
  {
    objectClass: string;
    objectPos: { x: number; y: number };
  }
> = {
  /** Narrow face strip (most phones) — matches a looser `object-` + tighter crop. */
  0: {
    objectClass: "object-[72%_42%]",
    objectPos: { x: 0.72, y: 0.42 },
  },
  /** Mid-width strip (short devtool windows, smaller bento) */
  1: {
    objectClass: "object-[70%_41%]",
    objectPos: { x: 0.7, y: 0.41 },
  },
  /** Wide face strip (typical large desktop bento) */
  2: {
    objectClass: "object-[68%_40%]",
    objectPos: { x: 0.68, y: 0.4 },
  },
};

const AVATAR_IMAGE_SIZE = { w: 1024, h: 1536 } as const;
/** Eye landmarks in source-image normalized coordinates (0..1). */
const EYE_SOURCE_LEFT: EyePoint = { x: 0.4, y: 0.356 };
const EYE_SOURCE_RIGHT: EyePoint = { x: 0.486, y: 0.335 };

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function projectSourcePointToBox(
  point: EyePoint,
  boxW: number,
  boxH: number,
  objectPos: { x: number; y: number },
) {
  const scale = Math.max(
    boxW / AVATAR_IMAGE_SIZE.w,
    boxH / AVATAR_IMAGE_SIZE.h,
  );
  const renderW = AVATAR_IMAGE_SIZE.w * scale;
  const renderH = AVATAR_IMAGE_SIZE.h * scale;
  const offsetX = (boxW - renderW) * objectPos.x;
  const offsetY = (boxH - renderH) * objectPos.y;
  const x = clamp01((offsetX + point.x * renderW) / boxW);
  const y = clamp01((offsetY + point.y * renderH) / boxH);
  return { x, y };
}

function toPercent(v: number) {
  return `${(v * 100).toFixed(3)}%`;
}

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
const PUPIL_RANGE_X: readonly [number, number] = [-0.62, 0.12];
const PUPIL_RANGE_Y: readonly [number, number] = [-0.1, 0.3];
const LEFT_EYE_LEFT_BIAS = 1.18;
const LEFT_EYE_DOWN_BIAS = 1.14;
/** Right eye: nudge down less when gaze is hard-right (px space after clamp×max). */
const RIGHT_EYE_DOWN_DAMP_WHEN_RIGHT = 0.92;
const RIGHT_EYE_DOWN_DAMP_X_START_PX = 0.12;

/** Pointer span: normalize to ~[-1,1] before PUPIL_RANGE_* (fraction of face size). */
const GAZE_SPAN = { x: 0.4, y: 0.32 } as const;
/** Reference min(face w,h) for full PUPIL_MAX_PX; smaller faces = proportionally less travel. */
const PUPIL_MOTION_SIZE_REF = 200;

/** Desktop eye export (for docs / other imports); use EYE_BY_BAND[2] in app. */
export const AVATAR_EYE_LEFT = {
  top: toPercent(EYE_SOURCE_LEFT.y),
  left: toPercent(EYE_SOURCE_LEFT.x),
};
export const AVATAR_EYE_RIGHT = {
  top: toPercent(EYE_SOURCE_RIGHT.y),
  left: toPercent(EYE_SOURCE_RIGHT.x),
};

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

  const stackRef = useRef<HTMLDivElement>(null);
  /** face image box in the top slice — same as pupil %; drives responsive gaze. */
  const faceTrackRef = useRef<HTMLDivElement | null>(null);
  /** Stays in sync for pointer handlers (avoids stale gaze when band/layout changes). */
  const gazeConfigRef = useRef({ x: 0.45, y: 0.35 });
  const touchLikeActiveRef = useRef(false);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [faceBox, setFaceBox] = useState({ w: 320, h: 480 });
  const band = useDomEyes ? bandFromFaceSize(faceBox.w) : 2;
  const eye = EYE_BY_BAND[band];
  const leftEyeProjected = projectSourcePointToBox(
    EYE_SOURCE_LEFT,
    Math.max(1, faceBox.w),
    Math.max(1, faceBox.h),
    eye.objectPos,
  );
  const rightEyeProjected = projectSourcePointToBox(
    EYE_SOURCE_RIGHT,
    Math.max(1, faceBox.w),
    Math.max(1, faceBox.h),
    eye.objectPos,
  );
  const eyeInBox = {
    left: {
      top: toPercent(leftEyeProjected.y),
      left: toPercent(leftEyeProjected.x),
    },
    right: {
      top: toPercent(rightEyeProjected.y),
      left: toPercent(rightEyeProjected.x),
    },
  };
  const leftEyePupilX = pupil.x < 0 ? pupil.x * LEFT_EYE_LEFT_BIAS : pupil.x;
  const leftEyePupilY = pupil.y > 0 ? pupil.y * LEFT_EYE_DOWN_BIAS : pupil.y;
  const rightEyeFarRight =
    pupil.x > RIGHT_EYE_DOWN_DAMP_X_START_PX ? pupil.x : 0;
  const rightEyeDownBlend = Math.min(1, rightEyeFarRight / 0.35);
  const rightEyePupilY =
    pupil.y > 0
      ? pupil.y *
        (1 - (1 - RIGHT_EYE_DOWN_DAMP_WHEN_RIGHT) * rightEyeDownBlend)
      : pupil.y;

  useLayoutEffect(() => {
    isDesktopRef.current = isDesktop;
  }, [isDesktop]);

  useLayoutEffect(() => {
    if (!useDomEyes) {
      return;
    }
    gazeConfigRef.current = {
      x: (leftEyeProjected.x + rightEyeProjected.x) * 0.5,
      y: (leftEyeProjected.y + rightEyeProjected.y) * 0.5,
    };
  }, [
    useDomEyes,
    leftEyeProjected.x,
    leftEyeProjected.y,
    rightEyeProjected.x,
    rightEyeProjected.y,
  ]);

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
    const stackH = el.getBoundingClientRect().height;
    const topH = first.getBoundingClientRect().height;
    /** Round for WebKit: subpixel stackH/topH causes visible seams between avatar slices. */
    setMetrics({
      stackH: Math.round(stackH),
      topH: Math.round(topH),
      /** 0 is valid: stack uses gap-0 so the avatar is one column with no void between cards. */
      gap: Number.isFinite(gapVal) ? Math.round(gapVal * 1000) / 1000 : 12,
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

      const g = gazeConfigRef.current;
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
      queueMicrotask(resetPupils);
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
      if (w > 0) {
        const h = el.getBoundingClientRect().height;
        setFaceBox({ w, h: Math.max(1, h) });
      }
    };
    onBox(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      const w = rect?.width;
      const h = rect?.height;
      if (w != null && w > 0 && h != null && h > 0) {
        setFaceBox({ w, h });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [stackH, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      queueMicrotask(() => {
        setPupil({ x: 0, y: 0 });
      });
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
      className="home-bento-avatar-col relative flex h-full min-h-0 flex-col gap-2 md:row-span-2 md:col-start-1"
    >
      {items.map((child, index) => {
        const isTop = index === 0;
        return (
          <div
            key={index}
            className={`relative z-10 flex min-h-0 w-full flex-1 overflow-hidden ${
              isTop
                ? "rounded-t-2xl rounded-b-none"
                : "rounded-b-2xl rounded-t-none"
            }`}
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
                    top: isTop ? 0 : Math.round(bottomSliceTop),
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
                      className={`home-avatar-image ${sharedAvatarImageClass}`}
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
                            left: eyeInBox.left.left,
                            top: eyeInBox.left.top,
                            transform: `translate(calc(-50% + ${leftEyePupilX}px), calc(-50% + ${leftEyePupilY}px))`,
                          }}
                        />
                        <span
                          className="home-avatar-pupil"
                          style={{
                            top: eyeInBox.right.top,
                            left: eyeInBox.right.left,
                            transform: `translate(calc(-50% + ${pupil.x}px), calc(-50% + ${rightEyePupilY}px))`,
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
