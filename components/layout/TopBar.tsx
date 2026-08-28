"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HistoryEntry, MatterRecord } from "@/types/contract";

interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
}

function buildNotifications(history: HistoryEntry[], matters: MatterRecord[]): Notification[] {
  const notes: Notification[] = [];
  const recent = [...history]
    .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
    .slice(0, 3);
  recent.forEach((h) => {
    const diff = Date.now() - new Date(h.analyzedAt).getTime();
    const time = diff < 3600000 ? `${Math.round(diff / 60000)}m ago` : `${Math.round(diff / 3600000)}h ago`;
    notes.push({
      id: `analysis-${h.id}`,
      icon: h.riskLevel === "HIGH" || h.riskLevel === "CRITICAL" ? "warning" : "check_circle",
      title: `${h.riskLevel} risk — ${h.filename}`,
      body: `Analysis complete · Score ${h.riskScore}/100`,
      time,
    });
  });
  matters.slice(0, 2).forEach((m) => {
    notes.push({
      id: `matter-${m.matterId}`,
      icon: "work",
      title: `Matter created: ${m.matterId}`,
      body: `${m.contractType} · ${m.counterparty}`,
      time: (() => {
        const diff = Date.now() - new Date(m.createdAt).getTime();
        return diff < 3600000 ? `${Math.round(diff / 60000)}m ago` : `${Math.round(diff / 3600000)}h ago`;
      })(),
    });
  });
  return notes;
}

export default function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const history: HistoryEntry[] = JSON.parse(sessionStorage.getItem("legalai_history") ?? "[]");
      const matters: MatterRecord[] = JSON.parse(sessionStorage.getItem("legalai_matters") ?? "[]");
      setNotifications(buildNotifications(history, matters));
    } catch { /* ignore */ }
  }, [showNotifs]);

  // Close popovers on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setShowAccount(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/contracts?q=${encodeURIComponent(q)}`);
    setQuery("");
  }

  return (
    <header className="bg-surface fixed top-0 right-0 w-[calc(100%-256px)] h-16 border-b border-outline-variant/10 flex justify-between items-center px-6 z-40">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px]">
            search
          </span>
          <input
            className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Search contracts, matters..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifsRef} className="relative">
          <button
            onClick={() => { setShowNotifs((v) => !v); setShowAccount(false); }}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-outline-variant/20 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/10">
                <h3 className="text-xs font-bold text-primary-container uppercase tracking-wider">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                  No recent activity. Upload a contract to get started.
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/10 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 flex items-start gap-3 hover:bg-surface-container-low transition-colors">
                      <span className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 ${n.icon === "warning" ? "text-secondary" : "text-primary-container"}`}>
                        {n.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary-container truncate">{n.title}</p>
                        <p className="text-xs text-on-surface-variant">{n.body}</p>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/60 shrink-0">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account */}
        <div ref={accountRef} className="relative">
          <button
            onClick={() => { setShowAccount((v) => !v); setShowNotifs(false); }}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all"
            aria-label="Account"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>

          {showAccount && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl border border-outline-variant/20 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-4 border-b border-outline-variant/10">
                <p className="text-sm font-bold text-primary-container">Nuvei Legal Dashboard</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Prototype · AI-assisted legal ops</p>
              </div>
              <div className="py-1">
                {[
                  { label: "Settings", href: "/settings", icon: "settings" },
                  { label: "Security Policy", href: "/security", icon: "security" },
                  { label: "Help", href: "/help", icon: "help_outline" },
                ].map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    onClick={() => setShowAccount(false)}
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{icon}</span>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
