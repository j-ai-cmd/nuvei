import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors mb-4 text-sm">
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          Back to Intake
        </Link>
        <h1 className="text-3xl font-bold text-primary-container mb-2">Security Policy</h1>
        <p className="text-base text-on-surface-variant">
          How your documents are processed and what data is retained.
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-outline-variant/10 shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-container mb-4">Document Processing</h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "Documents are uploaded directly to our server-side API route over HTTPS.",
              "Text extraction happens entirely in server memory — no file is ever written to disk.",
              "Extracted text is sent to an AI provider for analysis over an encrypted TLS connection.",
              "The original file (binary) is discarded immediately after text extraction.",
              "No document or extracted text is stored in any database or file system by this application.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[16px] mt-0.5 shrink-0">check_circle</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-outline-variant/10 shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-container mb-4">AI Provider</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Extracted contract text is transmitted to a third-party AI API for analysis. This means:
          </p>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "The AI provider receives the text content of your document (not the original file).",
              "Data handling by the AI provider is governed by their own terms of service and privacy policy.",
              "API communication uses HTTPS/TLS encryption in transit.",
              "The AI provider identity is not disclosed in the user-facing interface.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] mt-0.5 shrink-0">info</span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 font-semibold">
              Do not upload documents containing highly sensitive personal data (PII), classified information,
              or attorney-client privileged material without first reviewing the AI provider&apos;s data handling terms.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-outline-variant/10 shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-container mb-4">Session Data</h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "Analysis results are stored only in your browser's sessionStorage — local to your browser tab.",
              "Session data is automatically cleared when you close the browser tab.",
              "Matter records created in this prototype are also session-only; they are not persisted server-side.",
              "No cookies are set by this application for tracking purposes.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[16px] mt-0.5 shrink-0">check_circle</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-outline-variant/10 shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-container mb-4">API Key Security</h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "The AI API key is stored exclusively as a server-side environment variable.",
              "The key is never included in API responses, logs, or any client-facing code.",
              "No AI provider names or model identifiers are exposed in the user interface.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[16px] mt-0.5 shrink-0">check_circle</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-outline-variant/10 shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-container mb-4">Prototype Disclaimer</h2>
          <p className="text-sm text-on-surface-variant">
            This application is a concept prototype for demonstration purposes. It is not intended for
            production legal workflows without further security review, access controls, audit logging,
            and integration with your organisation&apos;s data governance policies. All AI-generated analysis
            is for informational purposes only and does not constitute legal advice.
          </p>
        </section>
      </div>
    </div>
  );
}
