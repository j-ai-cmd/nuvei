"use client";

export default function TopBar() {
  return (
    <header className="bg-surface fixed top-0 right-0 w-[calc(100%-256px)] h-16 border-b border-outline-variant/10 flex justify-between items-center px-6 z-40">
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[18px]">
            search
          </span>
          <input
            className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Search contracts, matters..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
