/**
 * Pure layout for the projects “deck”: wheel-driven progress `p` → card Y / z-index / height.
 * Card pixel height must match `ProjectStackCard` styles.
 */
const STACK_STEP_PX = 12;
const HERO_Y_PX = 64;
export const H_CARD_BLOCK_PX = 188;
const BELOW_HERO_GAP_PX = 32;
const LIST_STACK_STEP_PX = H_CARD_BLOCK_PX + BELOW_HERO_GAP_PX;

function stackYpx(index: number) {
  return index * STACK_STEP_PX;
}

const firstListRowYPx = HERO_Y_PX + LIST_STACK_STEP_PX;

export const P_SMOOTH = 0.16;

function getSegment(p: number, n: number) {
  if (n <= 1) {
    return { k: 0, t: p };
  }
  const f = Math.min(n, p * n + 1e-6);
  const k = Math.min(n - 1, Math.floor(f));
  const t = Math.max(0, Math.min(1, f - k));
  return { k, t };
}

function lerpY(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

export function cardYpx(i: number, p: number, n: number): number {
  if (n === 0) {
    return 0;
  }
  const { k, t } = getSegment(p, n);
  if (k === n - 1) {
    if (i < n - 1) {
      return stackYpx(i);
    }
    return lerpY(HERO_Y_PX, stackYpx(n - 1), t);
  }
  if (i < k) {
    return stackYpx(i);
  }
  if (i === k) {
    return lerpY(HERO_Y_PX, stackYpx(k), t);
  }
  if (i === k + 1) {
    return lerpY(firstListRowYPx, HERO_Y_PX, t);
  }
  const spreadY = firstListRowYPx + (i - k - 1) * LIST_STACK_STEP_PX;
  const segEndY = firstListRowYPx + (i - k - 2) * LIST_STACK_STEP_PX;
  return lerpY(spreadY, segEndY, t);
}

export function cardZIndex(i: number, p: number, n: number): number {
  if (n <= 0) {
    return 0;
  }
  const { k } = getSegment(p, n);
  if (i < k) {
    return 10 + i;
  }
  if (i === k) {
    if (i === n - 1) {
      return 40 + 2 * n;
    }
    return 50 + 2 * n;
  }
  if (i === k + 1 && k < n - 1) {
    return 60 + 2 * n;
  }
  if (i > k) {
    return 5 + i;
  }
  return 10 + i;
}

export function getDeckNeededHeightPx(projectCount: number): number {
  const n = Math.max(projectCount, 1);
  if (n <= 1) {
    return HERO_Y_PX + H_CARD_BLOCK_PX + 48;
  }
  const lastTop = firstListRowYPx + (n - 2) * LIST_STACK_STEP_PX;
  return Math.ceil(lastTop + H_CARD_BLOCK_PX + 48);
}
