import AnimatedTabs from "@/components/smoothui/animated-tabs";

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

export default function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="mb-6 overflow-x-auto">
      <AnimatedTabs
        tabs={tabs}
        activeTab={active}
        onChange={(id) => onChange(id as T)}
        variant="underline"
        className="min-w-full w-max whitespace-nowrap text-xs font-bold tracking-wider uppercase"
      />
    </div>
  );
}
