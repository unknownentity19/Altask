"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { EditorMock } from "@/components/ui/EditorMock";

const HIGHLIGHTS = [
  {
    title: "Live multiplayer canvas",
    description: "Cursors, comments, and presence built into every project.",
  },
  {
    title: "Pixel-perfect responsive",
    description: "Independent overrides per breakpoint without leaving the canvas.",
  },
  {
    title: "Built for performance",
    description: "Ships clean semantic HTML and optimized assets to a global edge.",
  },
];

export function ProductPreview() {
  return (
    <section id="preview" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-aurora opacity-70" />
      <div className="section">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">The Editor</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              A canvas that finally feels{" "}
              <span className="gradient-text">like a real product</span>
            </h2>
            <p className="mt-4 text-ink-600 dark:text-ink-300">
              Drag components, tweak settings, and watch your site come to life with zero compromises.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative mt-14"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-brand-500/15 via-accent-500/15 to-brand-500/15 blur-2xl"
            />
            <div className="relative rounded-3xl border border-ink-200/70 bg-white/70 p-2 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
              <EditorMock variant="full" />
            </div>
          </motion.div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.08}>
              <div className="card p-5 shadow-soft">
                <h3 className="text-sm font-semibold tracking-tight">{h.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-300">{h.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
