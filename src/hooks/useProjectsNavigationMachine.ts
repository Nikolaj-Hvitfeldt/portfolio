"use client";

import { useCallback, useState } from "react";
import { getProjectById, PROJECTS } from "@/lib/projects";

export type NavPhase = "list" | "flipping" | "detail" | "closing";
export type FlipRect = { x: number; y: number; width: number; height: number };

type Params = {
  reduceMotion: boolean;
};

export function useProjectsNavigationMachine({ reduceMotion }: Params) {
  const [navPhase, setNavPhase] = useState<NavPhase>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [flipFrom, setFlipFrom] = useState<FlipRect | null>(null);
  const [flipTo, setFlipTo] = useState<FlipRect | null>(null);

  const selected = selectedId ? getProjectById(selectedId) : undefined;
  const selectedIndex = selectedId
    ? PROJECTS.findIndex((p) => p.id === selectedId)
    : null;

  const siblingExitActive = navPhase === "flipping";
  const siblingEnterActive = navPhase === "closing";
  const selectedFadeActive = navPhase === "closing";
  const hideSelectedInStack = navPhase === "flipping";
  const showStack = navPhase !== "detail";
  const showDetail = navPhase !== "list";

  const onSelectProject = useCallback(
    (id: string, sourceEl?: HTMLElement) => {
      setSelectedId(id);
      if (reduceMotion || !sourceEl) {
        setNavPhase("detail");
        setShowDetailsPanel(true);
        return;
      }
      const r = sourceEl.getBoundingClientRect();
      setFlipFrom({ x: r.left, y: r.top, width: r.width, height: r.height });
      setFlipTo(null);
      setShowDetailsPanel(true);
      setNavPhase("flipping");
    },
    [reduceMotion],
  );

  const closeToList = useCallback(() => {
    setShowDetailsPanel(false);
    setNavPhase("list");
    setSelectedId(null);
    setFlipFrom(null);
    setFlipTo(null);
  }, []);

  return {
    navPhase,
    setNavPhase,
    selectedId,
    setSelectedId,
    selected,
    selectedIndex,
    showDetailsPanel,
    setShowDetailsPanel,
    flipFrom,
    setFlipFrom,
    flipTo,
    setFlipTo,
    siblingExitActive,
    siblingEnterActive,
    selectedFadeActive,
    hideSelectedInStack,
    showStack,
    showDetail,
    onSelectProject,
    closeToList,
  };
}
