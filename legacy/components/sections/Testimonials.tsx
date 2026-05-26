"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Loved by builders</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            What teams are <span className="gradient-text">saying about Altask</span>
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <motion.figure
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="card flex h-full flex-col p-6 shadow-soft"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6 text-brand-500/70"
                fill="currentColor"
              >
                <path d="M7.17 6A5 5 0 0 0 3 11v7h7v-7H6.5a3.5 3.5 0 0 1 3.5-3.5V6h-2.83zM17.17 6A5 5 0 0 0 13 11v7h7v-7h-3.5a3.5 3.5 0 0 1 3.5-3.5V6h-2.83z" />
              </svg>
              <blockquote className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-100">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-soft",
                    t.accent
                  )}
                >
                  {t.initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-ink-500 dark:text-ink-400">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
