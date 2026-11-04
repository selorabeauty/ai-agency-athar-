"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

export function useMotionAllowed() {
  const reduced = useReducedMotion();
  return !reduced;
}

export const editorialEase = [0.22, 1, 0.36, 1] as const;
