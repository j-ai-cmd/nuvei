// Regenerates public/fonts/material-symbols-subset.woff2 with only the icons used in the app.
// Run after adding a new <Icon name="..."> or icon: "..." value:  npm run icons
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib"];
const SKIP = ["components/smoothui"];
const PATTERNS = [/<Icon[^>]*name="([a-z0-9_]+)"/g, /\bicon[=:]\s*"([a-z0-9_]+)"/g, /\?\s*"([a-z0-9_]+)"\s*:\s*"([a-z0-9_]+)"/g];

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (SKIP.some((s) => p.startsWith(s))) continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(p)) out.push(p);
  }
  return out;
}

const names = new Set();
for (const file of ROOTS.flatMap((r) => walk(r))) {
  const src = readFileSync(file, "utf8");
  for (const re of PATTERNS) for (const m of src.matchAll(re)) m.slice(1).forEach((n) => n && names.add(n));
}
const list = [...names].sort();
const css = await (
  await fetch(
    `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=${list.join(",")}&display=block`,
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/126 Safari/537.36" } }
  )
).text();
const url = css.match(/url\((https:[^)]+)\)/)?.[1];
if (!url) throw new Error("Google Fonts did not return a font URL:\n" + css);
const font = Buffer.from(await (await fetch(url)).arrayBuffer());
writeFileSync("public/fonts/material-symbols-subset.woff2", font);
writeFileSync("public/fonts/material-symbols-subset.json", JSON.stringify(list, null, 2) + "\n");
console.log(`Wrote ${font.length} bytes for ${list.length} icons`);
