"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ContactCardBubblesProps = {
  /** When true: four static bubbles, no cycling. */
  reduceMotion: boolean;
};

const tones = ["a", "b", "a", "b"] as const;

const CYCLE_MS = 3000;
const BUBBLE_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const BUBBLE_IN = 0.42;
const BUBBLE_OUT = 0.4;
const LAYOUT = { type: "spring" as const, stiffness: 420, damping: 34 };

const COUNT = 4;

type Bubble = { id: number; tone: (typeof tones)[number] };

function initialBubbles(): Bubble[] {
  return [0, 1, 2, 3].map((i) => ({ id: i, tone: tones[i % 4] }));
}

function BubbleDots() {
  return (
    <span className="contact-bubble-dots">
      <span className="contact-bubble-dot block h-[5px] min-h-[5px] w-[5px] min-w-[5px] shrink-0 rounded-full bg-white/90" />
      <span className="contact-bubble-dot block h-[5px] min-h-[5px] w-[5px] min-w-[5px] shrink-0 rounded-full bg-white/90" />
      <span className="contact-bubble-dot block h-[5px] min-h-[5px] w-[5px] min-w-[5px] shrink-0 rounded-full bg-white/90" />
    </span>
  );
}

export function ContactCardBubbles({ reduceMotion }: ContactCardBubblesProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>(initialBubbles);
  const [enterId, setEnterId] = useState<number | null>(null);
  const nextIdRef = useRef(COUNT);
  const nextStepRef = useRef(COUNT);
  const enterClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roll = useCallback(() => {
    const newId = nextIdRef.current;
    const step = nextStepRef.current;
    const newTone = tones[step % 4];
    nextIdRef.current += 1;
    nextStepRef.current += 1;
    if (enterClearTimerRef.current) {
      clearTimeout(enterClearTimerRef.current);
    }
    setEnterId(newId);
    setBubbles((prev) => {
      if (prev.length < COUNT) {
        return prev;
      }
      const [, ...rest] = prev;
      return [...rest, { id: newId, tone: newTone }];
    });
    enterClearTimerRef.current = setTimeout(() => {
      setEnterId((e) => (e === newId ? null : e));
    }, Math.ceil(BUBBLE_IN * 1000) + 80);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const t = window.setInterval(roll, CYCLE_MS);
    return () => {
      window.clearInterval(t);
      if (enterClearTimerRef.current) {
        clearTimeout(enterClearTimerRef.current);
      }
    };
  }, [reduceMotion, roll]);

  return (
    <div
      className={`relative min-h-0 min-w-0 flex-1 overflow-hidden ${reduceMotion ? "contact-card-bubbles--reduced" : ""}`}
      aria-hidden
    >
      <div className="contact-card-bubbles pointer-events-none absolute inset-0 p-1 pb-0 pr-0">
        {reduceMotion ? (
          initialBubbles().map((b) => (
            <div
              key={b.id}
              className={`contact-card-bubble contact-card-bubble--${b.tone}`}
            >
              <BubbleDots />
            </div>
          ))
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {bubbles.map((b) => {
              const isBlue = b.tone === "b";
              const className = `contact-card-bubble contact-card-bubble--${b.tone}`;
              const isEntering = enterId === b.id;

              return (
                <motion.div
                  key={b.id}
                  layout
                  className={className}
                  initial={
                    isEntering
                      ? {
                          opacity: 0,
                          y: 16,
                          x: isBlue ? -12 : 12,
                          scale: 0.98,
                        }
                      : false
                  }
                  animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    x: 0,
                    scale: 0.99,
                    transition: { duration: BUBBLE_OUT, ease: BUBBLE_EASE },
                  }}
                  transition={{
                    layout: LAYOUT,
                    opacity: { duration: BUBBLE_IN, ease: BUBBLE_EASE },
                    y: { duration: BUBBLE_IN, ease: BUBBLE_EASE },
                    x: { duration: BUBBLE_IN, ease: BUBBLE_EASE },
                    scale: { duration: BUBBLE_IN, ease: BUBBLE_EASE },
                  }}
                >
                  <BubbleDots />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
