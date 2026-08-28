import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/components/layout/SideNav";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Legal AI · Enterprise Legal Ops",
  description: "AI-powered contract intake, analysis, and risk assessment for legal operations teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-background text-on-background min-h-screen">
        <SideNav />
        <TopBar />
        <main className="ml-64 pt-24 px-6 pb-32 max-w-[1440px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
