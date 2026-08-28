export async function extractPdfText(buffer: Buffer): Promise<string> {
  // Import lib/pdf-parse.js directly, bypassing index.js.
  // index.js checks `!module.parent` to enter debug mode — in Next.js that
  // value is undefined, so it tries to readFileSync a test PDF that doesn't
  // exist on Vercel, crashing the function before any request is processed.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse/lib/pdf-parse.js") as (
    buf: Buffer,
    options?: Record<string, unknown>
  ) => Promise<{ text: string }>;

  const data = await pdfParse(buffer);
  return data.text?.trim() ?? "";
}
