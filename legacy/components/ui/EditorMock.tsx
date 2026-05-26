"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const COMPONENTS = [
  { label: "Hero", color: "bg-brand-500" },
  { label: "Section", color: "bg-accent-500" },
  { label: "Grid", color: "bg-emerald-500" },
  { label: "Card", color: "bg-amber-500" },
  { label: "Form", color: "bg-rose-500" },
  { label: "Footer", color: "bg-slate-500" },
];

export function EditorMock({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const full = variant === "full";

  return (
    <div
      className={cn(
        "card overflow-hidden shadow-soft",
        full ? "p-3" : "p-2",
        className
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-2 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-ink-100 px-2.5 py-1 text-[10px] font-medium text-ink-500 dark:bg-white/5 dark:text-ink-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          altask.app/editor
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded-md bg-ink-900 px-2 py-1 text-[10px] font-semibold text-white dark:bg-white dark:text-ink-900">
            Publish
          </span>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-2 rounded-xl bg-gradient-to-b from-ink-50/60 to-white p-2 dark:from-white/[0.03] dark:to-transparent",
          full
            ? "grid-cols-12 lg:grid-cols-[200px_1fr_220px]"
            : "grid-cols-[88px_1fr_92px]"
        )}
      >
        {/* Left sidebar — components */}
        <aside className="rounded-lg border border-ink-200/70 bg-white/80 p-2 dark:border-white/10 dark:bg-white/[0.02]">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400">
            Components
          </p>
          <ul className="space-y-1.5">
            {COMPONENTS.slice(0, full ? 6 : 5).map((c, i) => (
              <motion.li
                key={c.label}
                initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                animate={prefersReduced ? undefined : { opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[11px] text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-white/5"
              >
                <span className={cn("h-2 w-2 rounded-full", c.color)} />
                {c.label}
              </motion.li>
            ))}
          </ul>
        </aside>

        {/* Center canvas */}
        <section className="relative overflow-hidden rounded-lg border border-ink-200/70 bg-white p-3 dark:border-white/10 dark:bg-ink-950/40">
          {/* fake hero block */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="rounded-md bg-gradient-to-br from-brand-500/15 via-accent-500/10 to-transparent p-3"
          >
            <div className="h-2 w-24 rounded-full bg-ink-900/70 dark:bg-white/70" />
            <div className="mt-2 h-3 w-3/4 rounded-full bg-ink-900/80 dark:bg-white/80" />
            <div className="mt-1.5 h-3 w-2/3 rounded-full bg-ink-900/60 dark:bg-white/60" />
            <div className="mt-3 flex gap-1.5">
              <div className="h-5 w-16 rounded-md bg-ink-900 dark:bg-white" />
              <div className="h-5 w-16 rounded-md border border-ink-300 dark:border-white/20" />
            </div>
          </motion.div>

          {/* fake content rows */}
          <div className="mt-3 grid gap-2">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-3 gap-2"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-md border border-ink-200/70 bg-white p-2 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="h-1.5 w-10 rounded-full bg-ink-300 dark:bg-white/20" />
                  <div className="mt-1.5 h-1.5 w-16 rounded-full bg-ink-200 dark:bg-white/10" />
                  <div className="mt-1 h-1.5 w-12 rounded-full bg-ink-200 dark:bg-white/10" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* dragging cursor */}
          {!prefersReduced && (
            <motion.div
              aria-hidden
              initial={{ x: 14, y: 14, opacity: 0 }}
              animate={{
                x: [14, 90, 130, 70, 14],
                y: [14, 60, 30, 80, 14],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-2 top-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow">
                <path d="M5 3l14 6-6 2-2 6L5 3z" fill="currentColor" />
              </svg>
              <span className="ml-2 inline-block rounded bg-brand-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                Drag
              </span>
            </motion.div>
          )}
        </section>

        {/* Right sidebar — settings */}
        <aside className="rounded-lg border border-ink-200/70 bg-white/80 p-2 dark:border-white/10 dark:bg-white/[0.02]">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400">
            Settings
          </p>
          <div className="space-y-2">
            <SettingRow label="Padding" value="24" />
            <SettingRow label="Radius" value="16" />
            <SettingRow label="Color" value="#3A64FF" swatch="bg-brand-500" />
            {full && (
              <>
                <SettingRow label="Shadow" value="md" />
                <SettingRow label="Font" value="Inter" />
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  value,
  swatch,
}: {
  label: string;
  value: string;
  swatch?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md bg-ink-50 px-2 py-1.5 text-[10px] dark:bg-white/[0.04]">
      <span className="text-ink-500 dark:text-ink-400">{label}</span>
      <span className="flex items-center gap-1.5 font-medium text-ink-800 dark:text-ink-100">
        {swatch && <span className={cn("h-2.5 w-2.5 rounded-full", swatch)} />}
        {value}
      </span>
    </div>
  );
}
