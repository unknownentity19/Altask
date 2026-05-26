"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon, PlayIcon, SparkIcon } from "@/components/icons/Icons";
import { EditorMock } from "@/components/ui/EditorMock";
import { FadeUp } from "@/components/motion/FadeUp";

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="product" className="relative overflow-hidden">
      {/* backdrops */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-aurora" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[120%] grid-bg opacity-60" />

      <div className="container-page pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <span className="eyebrow">
              <SparkIcon className="h-3.5 w-3.5 text-brand-500" />
              Now in public beta
            </span>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
              <span className="gradient-text">Build websites visually.</span>
              <br className="hidden sm:block" />
              <span className="text-ink-900 dark:text-white"> No code. Full control.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.18}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-ink-600 sm:text-lg dark:text-ink-300">
              Altask is the visual builder that finally feels native. Drag, drop, and customize every pixel,
              with the speed of a real product team and the polish of your favorite design tool.
            </p>
          </FadeUp>

          <FadeUp delay={0.28}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="#pricing" className="btn-primary">
                Start Building Free
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="#preview" className="btn-secondary">
                <PlayIcon className="h-3.5 w-3.5" />
                Watch Demo
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.38}>
            <p className="mt-4 text-xs text-ink-500 dark:text-ink-400">
              Free forever plan · No credit card required
            </p>
          </FadeUp>
        </div>

        {/* Editor preview */}
        <FadeUp delay={0.42} className="relative mx-auto mt-16 max-w-5xl">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 30, scale: 0.98 }}
            animate={prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-ink-200/70 bg-white/60 p-2 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-brand-500/30 via-accent-500/20 to-brand-500/30 opacity-40 blur-2xl"
            />
            <EditorMock variant="full" />
          </motion.div>

          {/* floating tags */}
          {!prefersReduced && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="absolute -left-3 top-10 hidden rounded-xl border border-ink-200/70 bg-white px-3 py-2 text-xs font-medium shadow-soft backdrop-blur sm:flex dark:border-white/10 dark:bg-ink-900/80"
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Auto-saved
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25, duration: 0.6 }}
                className="absolute -right-3 bottom-10 hidden rounded-xl border border-ink-200/70 bg-white px-3 py-2 text-xs font-medium shadow-soft backdrop-blur sm:flex dark:border-white/10 dark:bg-ink-900/80"
              >
                <span className="mr-2 rounded-md bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600 dark:text-brand-300">
                  LIVE
                </span>
                Published in 1.2s
              </motion.div>
            </>
          )}
        </FadeUp>
      </div>
    </section>
  );
}
