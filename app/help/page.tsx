export default function HelpPage() {
  const faqs = [
    {
      q: "What file types are supported?",
      a: "PDF and DOCX files up to 25 MB. Scanned PDFs (image-only, no embedded text) cannot be processed — use a PDF with selectable text.",
    },
    {
      q: "Is my document sent to a third party?",
      a: "Yes — extracted text is sent to an AI provider for analysis. Documents are processed in memory and never written to disk on our servers. Review the Security Policy for full details.",
    },
    {
      q: "What does the risk score mean?",
      a: "Scores range from 0 (minimal risk) to 100 (critical risk). The AI identifies clauses that deviate from standard commercial practice — unlimited liability, auto-renewal traps, one-sided termination, missing exhibits, etc.",
    },
    {
      q: "Why is the analysis showing DEMO DATA?",
      a: "Demo mode activates when no AI API key is configured in the deployment environment, or when you click 'Try Demo Contract'. A DEMO DATA banner will be prominently displayed.",
    },
    {
      q: "What is a Matter?",
      a: "Clicking 'Create Matter' generates a simulated CLM (Contract Lifecycle Management) record. In a production environment this would integrate with a real CLM system such as Ironclad or DocuSign CLM. In this prototype, matters are stored in session memory only.",
    },
    {
      q: "Does the AI provide legal advice?",
      a: "No. All analysis is AI-assisted and for informational purposes only. It does not constitute legal advice. All findings must be reviewed by qualified legal counsel before any action is taken.",
    },
    {
      q: "How long is my data retained?",
      a: "Contract history and matter records are stored in browser sessionStorage — they are cleared when you close the tab. No data is persisted server-side beyond the duration of the API call.",
    },
    {
      q: "Can I export the analysis?",
      a: "Yes — use the 'Export Report' button on any analysis page to download a plain-text summary of the full analysis.",
    },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-container mb-2">Help</h1>
        <p className="text-base text-on-surface-variant">Frequently asked questions about the platform.</p>
      </div>

      <div className="space-y-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="bg-white rounded-xl border border-outline-variant/10 shadow-sm p-6">
            <h3 className="text-sm font-bold text-primary-container mb-2">{q}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-surface-container-low rounded-xl border border-outline-variant/10 p-6">
        <h2 className="text-sm font-bold text-primary-container mb-2">Still need help?</h2>
        <p className="text-sm text-on-surface-variant">
          This is a prototype application. For issues with the deployment, check the Vercel function logs
          for server-side errors. For AI analysis issues, verify that{" "}
          <code className="bg-surface-variant px-1 rounded text-xs">KIMI_API_KEY</code> is set in your
          Vercel environment variables.
        </p>
      </div>
    </div>
  );
}
