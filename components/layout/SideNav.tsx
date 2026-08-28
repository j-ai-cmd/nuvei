"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/", icon: "description", label: "Contract Intake" },
  { href: "/contracts", icon: "assignment", label: "Contracts" },
  { href: "/matters", icon: "work", label: "Matters" },
  { href: "/analytics", icon: "analytics", label: "Analytics" },
];

const bottomItems = [
  { href: "/settings", icon: "settings", label: "Settings" },
  { href: "/help", icon: "help_outline", label: "Help" },
];

// Nuvei wordmark logo
function NuveiLogo() {
  return (
    <div className="flex items-center">
      <svg viewBox="0 0 96 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
        {/* "nuvei" wordmark */}
        <text
          x="0" y="28"
          fontFamily="Inter, Arial, sans-serif"
          fontWeight="800"
          fontSize="30"
          fill="#081f2c"
          letterSpacing="-1"
        >
          nuvei
        </text>
        {/* Red dot — dot on the "i", positioned above it */}
        <circle cx="88" cy="5" r="5" fill="#ba0037" />
      </svg>
    </div>
  );
}

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface-container-low h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/10 flex flex-col z-50">
      <div className="px-6 py-6 border-b border-outline-variant/10 mb-4">
        <NuveiLogo />
        <p className="text-xs text-on-surface-variant mt-2 font-semibold tracking-wide">Legal Dashboard</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-surface-variant/50 text-primary font-bold border-l-4 border-secondary"
                  : "text-on-surface-variant opacity-80 hover:bg-surface-variant/30"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-xs font-semibold tracking-wider uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-4 py-4 border-t border-outline-variant/10 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-surface-variant/50 text-primary font-bold border-l-4 border-secondary"
                  : "text-on-surface-variant opacity-80 hover:bg-surface-variant/30"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-xs font-semibold tracking-wider uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
