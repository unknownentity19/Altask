import type { ReactNode } from "react";

export const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Blog", href: "#blog" },
] as const;

export type Feature = {
  title: string;
  description: string;
  iconKey:
    | "drag"
    | "preview"
    | "responsive"
    | "components"
    | "code"
    | "publish";
};

export const FEATURES: Feature[] = [
  {
    title: "Drag & Drop Builder",
    description:
      "Compose pages by dragging premium blocks onto a flexible canvas. Snap, align, and rearrange in seconds.",
    iconKey: "drag",
  },
  {
    title: "Real-time Preview",
    description:
      "See pixel-perfect changes the moment you make them. No reloads, no surprises.",
    iconKey: "preview",
  },
  {
    title: "Responsive Controls",
    description:
      "Design once, fine-tune for every breakpoint with intuitive responsive overrides.",
    iconKey: "responsive",
  },
  {
    title: "Component Library",
    description:
      "Hundreds of polished, accessible components ready to drop in and customize.",
    iconKey: "components",
  },
  {
    title: "Custom Code Support",
    description:
      "Inject HTML, CSS, or JavaScript anywhere when you need full control.",
    iconKey: "code",
  },
  {
    title: "One-click Publish",
    description:
      "Push to a global edge in one click. Custom domains, SSL, and analytics included.",
    iconKey: "publish",
  },
];

export type Step = { number: string; title: string; description: string };

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Choose a Template",
    description:
      "Start from a beautifully crafted template or a blank canvas. All templates are fully editable.",
  },
  {
    number: "02",
    title: "Drag & Drop Components",
    description:
      "Build your page visually. Adjust spacing, type, and color with simple controls.",
  },
  {
    number: "03",
    title: "Publish Instantly",
    description:
      "Hit publish and your site goes live on a global CDN with HTTPS by default.",
  },
];

export type Template = {
  name: string;
  category: "Startup" | "Portfolio" | "SaaS" | "E-commerce";
  description: string;
  accent: string;
};

export const TEMPLATES: Template[] = [
  {
    name: "Lift",
    category: "Startup",
    description: "Conversion-focused landing for early-stage launches.",
    accent: "from-brand-500/20 to-accent-500/20",
  },
  {
    name: "Showcase",
    category: "Portfolio",
    description: "Editorial portfolio for designers and studios.",
    accent: "from-amber-400/20 to-pink-500/20",
  },
  {
    name: "Stack",
    category: "SaaS",
    description: "Dense product marketing for B2B SaaS.",
    accent: "from-emerald-400/20 to-brand-500/20",
  },
  {
    name: "Market",
    category: "E-commerce",
    description: "High-trust storefront with clean product pages.",
    accent: "from-rose-400/20 to-violet-500/20",
  },
];

export type PricingTier = {
  name: "Free" | "Pro" | "Team";
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const PRICING: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Everything you need to ship a beautiful starter site.",
    features: [
      "1 project",
      "Altask subdomain",
      "Drag & drop builder",
      "Community support",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "per month",
    description: "For solo founders and freelancers shipping real products.",
    features: [
      "Unlimited projects",
      "Custom domain + SSL",
      "Advanced components",
      "Custom code blocks",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    cadence: "per editor / month",
    description: "Collaboration, roles, and review for growing teams.",
    features: [
      "Everything in Pro",
      "Real-time collaboration",
      "Shared component library",
      "Roles & permissions",
      "Audit log",
    ],
    cta: "Start Team Trial",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We replaced three tools with Altask and shipped our launch site in a single afternoon. The team has not stopped iterating since.",
    name: "Maya Chen",
    role: "Founder, Northwind",
    initials: "MC",
    accent: "from-brand-500 to-accent-500",
  },
  {
    quote:
      "It feels like the design and engineering teams finally share the same canvas. Reviews are faster and our marketing site stays in sync.",
    name: "Daniel Park",
    role: "Head of Design, Lumen",
    initials: "DP",
    accent: "from-emerald-500 to-brand-500",
  },
  {
    quote:
      "I am not a developer but I rebuilt our portfolio in an evening. The component quality is genuinely on par with the best teams I have worked with.",
    name: "Rohini Patel",
    role: "Independent Designer",
    initials: "RP",
    accent: "from-amber-400 to-rose-500",
  },
];

export type FaqItem = { question: string; answer: ReactNode };

export const FAQS: FaqItem[] = [
  {
    question: "Is coding required?",
    answer:
      "No. Altask is designed for visual building. You can ship an entire site without writing a single line of code, while keeping the door open for custom code when you want it.",
  },
  {
    question: "Can I export my website?",
    answer:
      "Yes. Pro and Team plans support clean HTML, CSS, and component exports so you are never locked in.",
  },
  {
    question: "Is hosting included?",
    answer:
      "Every plan includes managed hosting on a global edge network with automatic HTTPS. Pro and Team plans add custom domains.",
  },
  {
    question: "Is it free?",
    answer:
      "Altask has a generous free tier with the full visual builder and a project on an Altask subdomain. Upgrade only when you need a custom domain or advanced features.",
  },
];

export const FOOTER = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Customers", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  resources: [
    { label: "Docs", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
    { label: "Support", href: "#" },
  ],
  social: [
    { label: "Twitter", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Dribbble", href: "#" },
  ],
};
