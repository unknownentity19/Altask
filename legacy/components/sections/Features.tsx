"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/content";
import { FEATURE_ICONS } from "@/components/icons/Icons";
import { Reveal } from "@/components/motion/Reveal";

export function Features() {
  return (
    <section id="features" className="section">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Features</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            <span className="gradient-text">Everything you need</span> to ship a beautiful site
          </h2>
          <p className="mt-4 text-ink-600 dark:text-ink-300">
            Powerful primitives, polished defaults, and the right escape hatches when you need them.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = FEATURE_ICONS[f.iconKey];
          return (
            <Reveal key={f.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="group card relative h-full overflow-hidden p-6 shadow-soft hover:shadow-glow"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                />
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {f.description}
                </p>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
