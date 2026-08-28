"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/", icon: "description", label: "Contract Intake" },
  { href: "#", icon: "assignment", label: "Contracts" },
  { href: "#", icon: "work", label: "Matters" },
  { href: "#", icon: "analytics", label: "Analytics" },
];

const bottomItems = [
  { href: "#", icon: "settings", label: "Settings" },
  { href: "#", icon: "help_outline", label: "Help" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface-container-low h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/10 flex flex-col z-50">
      <div className="px-6 py-8 border-b border-outline-variant/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <span className="font-bold text-xl text-primary">Legal AI</span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1 ml-13">Enterprise Legal Ops</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href !== "#" &&
            (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

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
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant opacity-80 hover:bg-surface-variant/30 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-xs font-semibold tracking-wider uppercase">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
