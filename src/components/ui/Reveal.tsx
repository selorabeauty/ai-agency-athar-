"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { editorialEase } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: {
  children?: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "li" | "span";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: editorialEase }}
    >
      {children}
    </Comp>
  );
}
