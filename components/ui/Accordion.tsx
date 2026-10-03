import BasicAccordion, { type AccordionItem } from "@/components/smoothui/basic-accordion";

export default function Accordion({
  items,
  allowMultiple = true,
  defaultExpandedIds,
}: {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIds?: Array<string | number>;
}) {
  return (
    <BasicAccordion
      items={items}
      allowMultiple={allowMultiple}
      defaultExpandedIds={defaultExpandedIds}
      className="nuvei-accordion bg-surface-container-lowest rounded-lg border border-outline-variant/10"
    />
  );
}
