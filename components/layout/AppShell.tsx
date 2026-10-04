"use client";

import { useState } from "react";
import Drawer from "@/components/smoothui/drawer";
import SideNav, { Brand, NavLinks } from "./SideNav";
import TopBar from "./TopBar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary-container focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <SideNav />
      <Drawer open={menuOpen} onOpenChange={setMenuOpen} side="left" title="Menu" className="w-72 bg-surface-container-low">
        <div className="flex flex-col h-full">
          <Brand />
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </div>
      </Drawer>
      <TopBar onMenu={() => setMenuOpen(true)} />
      <main id="main" tabIndex={-1} className="md:ml-64 pt-20 md:pt-24 px-4 md:px-6 pb-8 md:pb-32 max-w-container-max">{children}</main>
      <Footer />
    </>
  );
}
