import type { SVGProps } from "react";

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function DragIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 17h7M17.5 13.5L21 17l-3.5 3.5" />
    </svg>
  );
}

export function PreviewIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function ResponsiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="4" width="14" height="11" rx="1.5" />
      <rect x="13" y="9" width="9" height="13" rx="1.5" />
      <path d="M6 18h6" />
    </svg>
  );
}

export function ComponentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l4 2.5v5L12 13l-4-2.5v-5L12 3z" />
      <path d="M5 13l4 2.5v5L5 23l-4-2.5v-5L5 13z" transform="translate(2 -2)" />
      <path d="M19 13l4 2.5v5L19 23l-4-2.5v-5L19 13z" transform="translate(-2 -2)" />
    </svg>
  );
}

export function CodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M8 6l-5 6 5 6" />
      <path d="M16 6l5 6-5 6" />
      <path d="M14 4l-4 16" />
    </svg>
  );
}

export function PublishIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12" />
      <path d="M6 9l6-6 6 6" />
      <rect x="3" y="15" width="18" height="6" rx="1.5" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12.5l5 5L20 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4l13 8-13 8V4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}

export function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.8 4.7L18.5 9 13.8 10.7 12 15l-1.8-4.3L5.5 9l4.7-1.3L12 3z" />
    </svg>
  );
}

export const FEATURE_ICONS: Record<
  string,
  (p: SVGProps<SVGSVGElement>) => JSX.Element
> = {
  drag: DragIcon,
  preview: PreviewIcon,
  responsive: ResponsiveIcon,
  components: ComponentsIcon,
  code: CodeIcon,
  publish: PublishIcon,
};
