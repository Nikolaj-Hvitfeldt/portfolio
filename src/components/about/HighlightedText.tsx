"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "@/components/about/AboutHighlights.module.css";
import { HIGHLIGHT_SEQUENCE_DELAYS } from "@/components/about/highlightConfig";

function splitByKeywords(text: string, keywords: string[]) {
  if (!keywords.length) {
    return [text];
  }
  const escaped = keywords
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(re);
}

type HighlightedTextProps = {
  text: string;
  boxKeywords: string[];
  softKeywords: string[];
  drawnKeywords: string[];
  drawnBaseDelayMs?: number;
};

export function renderMixedHighlights({
  text,
  boxKeywords,
  softKeywords,
}: Pick<HighlightedTextProps, "text" | "boxKeywords" | "softKeywords">): ReactNode[] {
  const allKeywords = [...boxKeywords, ...softKeywords];
  const parts = splitByKeywords(text, allKeywords);

  return parts.map((part, idx) => {
    const lower = part.toLowerCase();
    const isBox = boxKeywords.some((k) => lower === k.toLowerCase());
    if (isBox) {
      return (
        <span
          key={`bx-${idx}`}
          className={styles.box}
          style={{ "--scratch-delay": `${HIGHLIGHT_SEQUENCE_DELAYS.boxStartMs}ms` } as CSSProperties}
        >
          <span className={styles.boxText}>{part}</span>
          <svg aria-hidden className={styles.boxSvg} viewBox="0 0 100 32" preserveAspectRatio="none">
            <path className={styles.boxLine} d="M3 6 C16 3, 34 5, 52 4.3 C70 3.8, 85 4.7, 97.5 6" />
            <path className={`${styles.boxLine} ${styles.boxRight}`} d="M97.5 6 C99.8 12, 99.2 19.5, 96.2 27.4" />
            <path
              className={`${styles.boxLine} ${styles.boxBottom}`}
              d="M95.6 27.4 C80 30.4, 58 28.2, 36 29.1 C20.5 29.6, 8.8 28.9, 2.8 26.3"
            />
            <path className={`${styles.boxLine} ${styles.boxLeft}`} d="M2.8 26.3 C0.4 19.8, 0.9 11.6, 4.3 5.3" />
            <path
              className={`${styles.boxLine2} ${styles.box2Top}`}
              d="M1.4 4.9 C15 2.3, 35 3.7, 53 3.5 C73 3.3, 88.3 4.2, 99.3 6.1"
            />
            <path className={`${styles.boxLine2} ${styles.box2Right}`} d="M99.3 6.1 C101.8 13.4, 101 21.1, 97.6 29.2" />
            <path
              className={`${styles.boxLine2} ${styles.box2Bottom}`}
              d="M97.6 29.2 C80.2 31.8, 57.4 30.2, 35.1 30.9 C18.9 31.4, 7.2 30.1, 1.2 27.1"
            />
            <path className={`${styles.boxLine2} ${styles.box2Left}`} d="M1.2 27.1 C-1 20, -0.4 11.8, 2.9 4.8" />
          </svg>
        </span>
      );
    }

    const isSoft = softKeywords.some((k) => lower === k.toLowerCase());
    if (isSoft) {
      const delay = lower === "react" ? HIGHLIGHT_SEQUENCE_DELAYS.reactMs : HIGHLIGHT_SEQUENCE_DELAYS.typescriptMs;
      return (
        <span key={`sf-${idx}`} className={styles.soft} style={{ "--soft-delay": `${delay}ms` } as CSSProperties}>
          {part}
        </span>
      );
    }

    return <span key={`tx-${idx}`}>{part}</span>;
  });
}

export function renderDrawnHighlights({
  text,
  drawnKeywords,
  drawnBaseDelayMs = HIGHLIGHT_SEQUENCE_DELAYS.drawnStartMs,
}: Pick<HighlightedTextProps, "text" | "drawnKeywords" | "drawnBaseDelayMs">): ReactNode[] {
  const parts = splitByKeywords(text, drawnKeywords);
  let keywordIndex = 0;
  return parts.map((part, idx) => {
    const isDrawn = drawnKeywords.some((k) => part.toLowerCase() === k.toLowerCase());
    if (!isDrawn) {
      return <span key={`dt-${idx}`}>{part}</span>;
    }
    const delayMs = `${drawnBaseDelayMs + keywordIndex * 120}ms`;
    keywordIndex += 1;
    return (
      <span key={`dw-${idx}`} className={styles.scratch} style={{ "--scratch-delay": delayMs } as CSSProperties}>
        <span className={styles.scratchText}>{part}</span>
        <svg aria-hidden className={styles.scratchSvg} viewBox="0 0 100 14" preserveAspectRatio="none">
          <path className={`${styles.scratchStroke} ${styles.scratchStrokeA}`} d="M3 8.2 C18 6.6, 34 9.1, 50 7.9 C66 6.9, 82 9.1, 96 8.25" />
          <path
            className={`${styles.scratchStroke} ${styles.scratchStrokeB}`}
            d="M4 10.5 C19 9.1, 35 11.4, 51 10.4 C67 9.4, 81 11.25, 90.2 10.95 C92.9 11.05, 94.7 11.4, 95.7 11.9"
          />
        </svg>
      </span>
    );
  });
}
