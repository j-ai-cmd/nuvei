interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

export default function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <nav className="flex border-b border-outline-variant/20 overflow-x-auto mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-6 py-3 text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-colors ${
            active === tab.id ? "text-primary border-b-2 border-secondary" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
