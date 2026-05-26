"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRightIcon } from "@/components/icons/Icons";

export function CTA() {
  return (
    <section className="section">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-ink-200/70 bg-gradient-to-br from-ink-900 to-ink-950 p-10 text-center shadow-glow sm:p-16 dark:border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(60%_50%_at_50%_0%,rgba(58,100,255,0.35),transparent_60%),radial-gradient(40%_40%_at_100%_100%,rgba(139,92,246,0.35),transparent_60%)]"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Ship your next site this week.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-300">
              Free forever for solo projects. No credit card. No catch.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#pricing"
                className="btn bg-white text-ink-900 shadow-soft hover:bg-ink-100"
              >
                Start Building Free
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="#preview"
                className="btn border border-white/15 bg-white/5 text-white backdrop-blur hover:bg-white/10"
              >
                Explore the Editor
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
