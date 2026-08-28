"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  function clearSession() {
    try {
      const keys = Object.keys(sessionStorage).filter((k) => k.startsWith("legalai_"));
      keys.forEach((k) => sessionStorage.removeItem(k));
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } catch { /* ignore */ }
  }

  const sections = [
    {
      title: "AI Analysis",
      items: [
        { label: "AI Provider", value: "Configured server-side", readonly: true },
        { label: "Analysis Model", value: "kimi-k2.6", readonly: true },
        { label: "Max Document Size", value: "25 MB", readonly: true },
        { label: "Supported Formats", value: "PDF, DOCX", readonly: true },
      ],
    },
    {
      title: "Data & Privacy",
      items: [
        { label: "Document Storage", value: "In-memory only (never written to disk)", readonly: true },
        { label: "Session History", value: "Browser sessionStorage (cleared on tab close)", readonly: true },
        { label: "AI Provider Data Retention", value: "Per provider terms — see Security Policy", readonly: true },
      ],
    },
    {
      title: "Application",
      items: [
        { label: "Version", value: "0.1.0 (Prototype)", readonly: true },
        { label: "Runtime", value: "Next.js 14 · Node.js · Vercel", readonly: true },
        { label: "Environment", value: "Production", readonly: true },
      ],
    },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-container mb-2">Settings</h1>
        <p className="text-base text-on-surface-variant">Application configuration and session management.</p>
      </div>

      <div className="space-y-6">
        {sections.map(({ title, items }) => (
          <div key={title} className="bg-white rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/10">
              <h2 className="text-sm font-bold text-primary-container uppercase tracking-wider">{title}</h2>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {items.map(({ label, value }) => (
                <div key={label} className="px-6 py-4 flex justify-between items-center">
                  <span className="text-sm font-semibold text-on-surface">{label}</span>
                  <span className="text-sm text-on-surface-variant text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Session management */}
        <div className="bg-white rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/10">
            <h2 className="text-sm font-bold text-primary-container uppercase tracking-wider">Session Management</h2>
          </div>
          <div className="px-6 py-6">
            <p className="text-sm text-on-surface-variant mb-4">
              Clear all session data including contract history, matter records, and cached analysis results.
              This does not affect your API key or any server-side configuration.
            </p>
            <button
              onClick={clearSession}
              className="px-6 py-2.5 rounded text-xs font-bold tracking-wider uppercase bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors border border-secondary/20"
            >
              {cleared ? "✓ Session cleared" : "Clear Session Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
