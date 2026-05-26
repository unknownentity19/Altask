import Link from "next/link";
import { FOOTER } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "Product", links: FOOTER.product },
  { title: "Company", links: FOOTER.company },
  { title: "Resources", links: FOOTER.resources },
  { title: "Social", links: FOOTER.social },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200/70 bg-white/40 backdrop-blur dark:border-white/10 dark:bg-white/[0.02]">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-600 dark:text-ink-300">
              Altask is the visual website builder for teams who care about craft. Drag, drop, and ship.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-ink-700 hover:text-ink-900 dark:text-ink-200 dark:hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-ink-200/70 pt-6 text-xs text-ink-500 dark:border-white/10 dark:text-ink-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Altask, Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-ink-700 dark:hover:text-ink-200">
              Privacy
            </Link>
            <Link href="#" className="hover:text-ink-700 dark:hover:text-ink-200">
              Terms
            </Link>
            <Link href="#" className="hover:text-ink-700 dark:hover:text-ink-200">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
