"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function HowItWorks() {
  return (
    <section id="how" className="section">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            From idea to live site in <span className="gradient-text">three steps</span>
          </h2>
        </div>
      </Reveal>

      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-12 hidden h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent md:block dark:via-white/10"
        />
        {STEPS.map((s, i) => (
          <Reveal key={s.number} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="card relative h-full p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
                  <span className="text-sm font-semibold">{s.number}</span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                {s.description}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
