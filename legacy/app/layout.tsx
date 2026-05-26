import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Altask — Build websites visually. No code. Full control.",
  description:
    "Altask is a modern drag-and-drop website builder. Compose pages, customize every detail, and publish instantly to a global edge.",
  metadataBase: new URL("https://altask.example"),
  openGraph: {
    title: "Altask — Build websites visually",
    description:
      "Drag, drop, and ship beautiful websites without writing code.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06080d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen antialiased selection:bg-brand-500/30 selection:text-ink-900 dark:selection:text-white">
        {children}
      </body>
    </html>
  );
}
