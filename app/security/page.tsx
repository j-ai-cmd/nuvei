import Link from "next/link";
import { Card, Icon } from "@/components/ui";

export default function SecurityPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/intake" className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors mb-4 text-sm">
          <Icon name="arrow_back" className="text-[18px] mr-1" />
          Back to intake
        </Link>
        <h1 className="text-3xl font-bold text-primary-container mb-2">Security policy</h1>
        <p className="text-base text-on-surface-variant">
          How documents are processed and what data is kept.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-primary-container mb-4">Document processing</h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "Documents upload over HTTPS straight to the app's server.",
              "Text is extracted in server memory. The file is never written to disk.",
              "The extracted text goes to the AI provider over an encrypted TLS connection.",
              "The original file is discarded as soon as its text is extracted.",
              "The app stores no documents or extracted text in a database or on disk.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary-container text-[16px] mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-primary-container mb-4">AI provider</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            The extracted contract text is sent to a third-party AI service for analysis. In practice:
          </p>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "The provider receives the document's text, not the original file.",
              "The provider's own terms of service and privacy policy govern what it does with that text.",
              "Traffic to the provider is encrypted in transit with TLS.",
              "The interface does not name the provider.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Icon name="info" className="text-on-surface-variant text-[16px] mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 font-semibold">
              Read the AI provider&apos;s data handling terms before uploading documents that contain sensitive personal
              data, classified information, or privileged legal advice.
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-primary-container mb-4">Session data</h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "Analysis results are kept only in your browser tab's session storage.",
              "Closing the tab clears them.",
              "Matters created in this prototype are session-only too. The server does not keep them.",
              "The app sets no tracking cookies.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary-container text-[16px] mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-primary-container mb-4">API key security</h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            {[
              "The AI API key exists only as an environment variable on the server.",
              "It never appears in API responses, logs, or code sent to the browser.",
              "The interface shows no provider names or model identifiers.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary-container text-[16px] mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-primary-container mb-4">Prototype disclaimer</h2>
          <p className="text-sm text-on-surface-variant">
            This is a concept prototype for demonstration. Using it for real legal work would need a security
            review, access controls, audit logging, and integration with your organisation&apos;s data governance
            policies. The AI analysis is for information only and is not legal advice.
          </p>
        </Card>
      </div>
    </div>
  );
}
