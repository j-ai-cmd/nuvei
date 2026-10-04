import { Accordion, PageHeader } from "@/components/ui";

export default function HelpPage() {
  const faqs = [
    {
      q: "What file types can I upload?",
      a: "PDF and DOCX files up to 25 MB. The PDF needs selectable text; a scanned image of a page has no text to read.",
    },
    {
      q: "Is my document sent to a third party?",
      a: "Yes. The extracted text goes to an AI provider for analysis. The file itself is read in memory and never saved on our servers. The Security Policy has the details.",
    },
    {
      q: "What does the risk score mean?",
      a: "It runs from 0 (minimal risk) to 100 (critical). The score goes up for clauses that depart from standard commercial terms, such as unlimited liability, auto-renewal with a long notice window, one-sided termination, or missing exhibits.",
    },
    {
      q: "Why does an analysis say Sample data?",
      a: "The five example contracts and the Try Demo Contract button use analyses written in advance, so you can explore the app without an API key. Anything you upload yourself is analyzed live.",
    },
    {
      q: "What is a matter?",
      a: "Create Matter makes a simulated record in a contract lifecycle management (CLM) system. In production it would go to a real CLM such as Ironclad or DocuSign CLM. Here it is kept for the current browser session only.",
    },
    {
      q: "Does the AI give legal advice?",
      a: "No. The analysis is for information only. A qualified lawyer should review every finding before anyone acts on it.",
    },
    {
      q: "How long is my data kept?",
      a: "Contract history and matters live in your browser's session storage and are cleared when you close the tab. The server keeps nothing after the request finishes.",
    },
    {
      q: "Can I export an analysis?",
      a: "Yes. Export Report on any analysis page downloads the full analysis as a plain-text file.",
    },
  ];

  return (
    <div className="max-w-3xl">
      <PageHeader title="Help" subtitle="Frequently asked questions about the platform." action={null} />

      <h2 className="sr-only">Questions</h2>
      <Accordion
        defaultExpandedIds={[0]}
        items={faqs.map(({ q, a }, i) => ({
          id: i,
          title: q,
          content: <p className="text-sm text-on-surface-variant leading-relaxed">{a}</p>,
        }))}
      />

      <div className="mt-8 bg-surface-container-low rounded-lg border border-outline-variant/50 p-6">
        <h2 className="text-sm font-bold text-primary-container mb-2">Still need help?</h2>
        <p className="text-sm text-on-surface-variant">
          This is a prototype application. For issues with the deployment, check the Vercel function logs
          for server-side errors. For AI analysis issues, verify that{" "}
          <code className="bg-surface-variant px-1 rounded-sm text-xs">KIMI_API_KEY</code> is set in your
          Vercel environment variables.
        </p>
      </div>
    </div>
  );
}
