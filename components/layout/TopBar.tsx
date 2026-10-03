"use client";

import { useState, useEffect, useRef } from "react";
import AnimatedInput from "@/components/smoothui/animated-input";
import DropdownMenu from "@/components/smoothui/dropdown-menu";
import { useRouter } from "next/navigation";
import { HistoryEntry, MatterRecord } from "@/types/contract";
import { getMatters, getStoredHistory } from "@/lib/storage";
import { formatRelative } from "@/lib/format";
import { AnimatedList, Icon, Tooltip } from "@/components/ui";

interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  href: string;
}

function buildNotifications(history: HistoryEntry[], matters: MatterRecord[]): Notification[] {
  const notes: Notification[] = [];
  const recent = [...history]
    .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
    .slice(0, 3);
  recent.forEach((h) => {
    notes.push({
      id: `analysis-${h.id}`,
      icon: h.riskLevel === "HIGH" || h.riskLevel === "CRITICAL" ? "warning" : "check_circle",
      title: `${h.riskLevel} risk — ${h.filename}`,
      body: `Analysis complete · Score ${h.riskScore}/100`,
      time: formatRelative(h.analyzedAt),
      href: `/analysis/${h.id}`,
    });
  });
  matters.slice(0, 2).forEach((m) => {
    notes.push({
      id: `matter-${m.matterId}`,
      icon: "work",
      title: `Matter created: ${m.matterId}`,
      body: `${m.contractType} · ${m.counterparty}`,
      time: formatRelative(m.createdAt),
      href: "/matters",
    });
  });
  return notes;
}

export default function TopBar({ onMenu }: { onMenu?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(buildNotifications(getStoredHistory(), getMatters()));
  }, [showNotifs]);

  // Close notifications on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
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
    <header className="bg-surface fixed top-0 right-0 left-0 md:left-64 h-16 border-b border-outline-variant/10 flex justify-between items-center gap-2 px-4 md:px-6 z-40">
      <button
        onClick={onMenu}
        className="md:hidden p-2 -ml-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all"
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>
      <form onSubmit={handleSearch} className="flex-1 max-w-72 min-w-0">
        <AnimatedInput
          label="Search contracts, matters..."
          value={query}
          onChange={setQuery}
          icon={<Icon name="search" className="text-on-surface-variant/60 text-[18px]" />}
          inputClassName="rounded-full bg-surface-container-low border-transparent"
          labelClassName="left-10! max-w-[calc(100%-3rem)] truncate whitespace-nowrap bg-surface-container-low text-on-surface-variant text-sm"
        />
      </form>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifsRef} className="relative">
          <Tooltip content="Notifications" placement="bottom">
            <button
              onClick={() => setShowNotifs((v) => !v)}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all relative"
              aria-label="Notifications"
            >
              <Icon name="notifications" />
              {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />}
            </button>
          </Tooltip>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-xl border border-outline-variant/20 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/10">
                <h3 className="text-xs font-bold text-primary-container uppercase tracking-wider">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                  No recent activity. Upload a contract to get started.
                </div>
              ) : (
                <AnimatedList
                  className="p-2 max-h-80 overflow-y-auto"
                  direction="down"
                  pauseOnHover={false}
                  onItemClick={(id) => {
                    const n = notifications.find((x) => x.id === id);
                    setShowNotifs(false);
                    if (n) router.push(n.href);
                  }}
                  items={[...notifications].reverse().map((n) => ({
                    id: n.id,
                    content: (
                      <div className="px-3 py-2 flex items-start gap-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                        <Icon
                          name={n.icon}
                          className={`text-[18px] mt-0.5 shrink-0 ${n.icon === "warning" ? "text-secondary" : "text-primary-container"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary-container truncate">{n.title}</p>
                          <p className="text-xs text-on-surface-variant">{n.body}</p>
                        </div>
                        <span className="text-[10px] text-on-surface-variant/60 shrink-0">{n.time}</span>
                      </div>
                    ),
                  }))}
                />
              )}
            </div>
          )}
        </div>

        {/* Account */}
        <DropdownMenu
          align="end"
          className="w-60"
          items={[
            { key: "label", label: "", groupLabel: "Nuvei Legal Dashboard" },
            { key: "sep", label: "", separator: true },
            { key: "matters", label: "Matters", icon: <Icon name="work" className="text-[18px]" />, onSelect: () => router.push("/matters") },
            { key: "security", label: "Security Policy", icon: <Icon name="security" className="text-[18px]" />, onSelect: () => router.push("/security") },
            { key: "help", label: "Help", icon: <Icon name="help_outline" className="text-[18px]" />, onSelect: () => router.push("/help") },
          ]}
        >
          <button
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all"
            aria-label="Account"
          >
            <Icon name="account_circle" />
          </button>
        </DropdownMenu>
      </div>
    </header>
  );
}
