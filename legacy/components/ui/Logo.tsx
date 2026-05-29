import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/assets/images/logo.svg"
      alt="Altask"
      className={cn("h-12 w-auto", className)}
    />
  );
}
