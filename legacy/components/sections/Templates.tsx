"use client";

import { motion } from "framer-motion";
import { TEMPLATES } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/cn";

export function Templates() {
  return (
    <section id="templates" className="section">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Templates</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Start from a <span className="gradient-text">beautiful blueprint</span>
            </h2>
            <p className="mt-3 text-ink-600 dark:text-ink-300">
              Hand-crafted templates for every use case. Fully editable, production ready.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-ink-900 dark:text-ink-200 dark:hover:text-white"
          >
            Browse all templates
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPLATES.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <motion.a
              href="#"
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group card relative block overflow-hidden shadow-soft hover:shadow-glow"
            >
              <div
                className={cn(
                  "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
                  t.accent
                )}
              >
                {/* fake template preview */}
                <div className="absolute inset-3 rounded-xl bg-white/80 p-3 shadow-soft backdrop-blur dark:bg-ink-900/70">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-1.5 w-12 rounded-full bg-ink-200 dark:bg-white/10" />
                  </div>
                  <div className="mt-3 h-2 w-3/4 rounded-full bg-ink-900/80 dark:bg-white/80" />
                  <div className="mt-1.5 h-2 w-1/2 rounded-full bg-ink-900/60 dark:bg-white/60" />
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    <div className="h-12 rounded-md bg-ink-100 dark:bg-white/5" />
                    <div className="h-12 rounded-md bg-ink-100 dark:bg-white/5" />
                    <div className="col-span-2 h-10 rounded-md bg-ink-100 dark:bg-white/5" />
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    <div className="h-5 w-14 rounded-md bg-ink-900 dark:bg-white" />
                    <div className="h-5 w-14 rounded-md border border-ink-300 dark:border-white/15" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-ink-500 dark:text-ink-400">
                    {t.category}
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">{t.name}</h3>
                  <p className="mt-1 text-xs text-ink-600 dark:text-ink-400">{t.description}</p>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200/70 transition-all group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white dark:border-white/10">
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
