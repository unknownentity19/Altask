"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/content";
import { CloseIcon, MenuIcon } from "@/components/icons/Icons";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 80], [6, 14]);
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.6)"]
  );
  const bgDark = useTransform(
    scrollY,
    [0, 80],
    ["rgba(11,13,18,0)", "rgba(11,13,18,0.6)"]
  );
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0)", "rgba(15,23,42,0.08)"]
  );

  return (
    <motion.header
      style={{
        backdropFilter: blur.get() ? `saturate(140%) blur(${blur.get()}px)` : undefined,
      }}
      className="sticky top-0 z-50 w-full"
    >
      <motion.div
        style={{
          // Use both vars; CSS handles light/dark via class
          background: bg as unknown as string,
          borderBottom: "1px solid",
          borderBottomColor: border as unknown as string,
        }}
        className="dark:[&]:!bg-[var(--nav-bg-dark)] [--nav-bg-dark:rgba(11,13,18,0.6)] backdrop-blur"
      >
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="#" aria-label="Altask home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="#" className="text-sm text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white">
              Sign in
            </Link>
            <Link href="#pricing" className="btn-primary">
              Get Started
            </Link>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200/70 bg-white/70 dark:border-white/10 dark:bg-white/5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "container-page md:hidden",
              "border-b border-ink-200/70 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-ink-950/90"
            )}
          >
            <nav className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="#pricing"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2"
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
