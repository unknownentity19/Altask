"use client";

import { motion } from "framer-motion";
import { PRICING } from "@/lib/content";
import { CheckIcon } from "@/components/icons/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function Pricing() {
  return (
    <section id="pricing" className="section">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            <span className="gradient-text">Simple pricing</span> that scales with you
          </h2>
          <p className="mt-4 text-ink-600 dark:text-ink-300">
            Start free. Upgrade when you need a custom domain, more projects, or your team.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {PRICING.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={cn(
                "card relative flex h-full flex-col p-6 shadow-soft",
                tier.highlighted &&
                  "border-brand-500/40 shadow-glow ring-1 ring-brand-500/30 dark:border-brand-400/40"
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-glow">
                  Most popular
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
              </div>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{tier.description}</p>
              <div className="mt-6 flex items-end gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                <span className="pb-1 text-xs text-ink-500 dark:text-ink-400">{tier.cadence}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-brand-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <a
                  href="#"
                  className={cn(
                    tier.highlighted ? "btn-primary w-full" : "btn-secondary w-full"
                  )}
                >
                  {tier.cta}
                </a>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
