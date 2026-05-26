"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FAQS } from "@/lib/content";
import { ChevronDownIcon } from "@/components/icons/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Answers to the <span className="gradient-text">questions we get most</span>
          </h2>
          <p className="mt-4 text-ink-600 dark:text-ink-300">
            Still curious? Reach out any time, we love hearing from builders.
          </p>
        </Reveal>

        <div className="lg:col-span-8">
          <ul className="space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.question} delay={i * 0.05}>
                  <li
                    className={cn(
                      "card overflow-hidden shadow-soft transition-shadow",
                      isOpen && "shadow-glow"
                    )}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-base font-semibold tracking-tight">
                        {item.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid h-8 w-8 place-items-center rounded-full border border-ink-200/70 text-ink-700 dark:border-white/10 dark:text-ink-200"
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
