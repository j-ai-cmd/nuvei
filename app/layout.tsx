import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/inter";
import AppShell from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Nuvei Legal Dashboard",
  description: "AI-powered contract intake, analysis, and risk assessment for legal operations teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Icon font is a 5KB subset of only the icons this app uses; preload so it is ready before first paint */}
        <link rel="preload" href="/fonts/material-symbols-subset.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-on-background min-h-screen">
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
