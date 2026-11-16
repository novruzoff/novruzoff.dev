#!/usr/bin/env node
// Social cards (1200×630 PNG): public/og.png (home) and public/og/{projects,resume,contact}.png.
// Re-run with `pnpm run og` after changing projects.ts, experience.ts or the copy constants
// below, then commit the PNGs in public/. `pnpm run og -- --check` only compares.
//
// How it works: each card is a small HTML page in Geist Mono (the woff2 files from
// public/fonts, inlined as data: URIs so no server is needed), screenshotted by headless
// Chromium at 1200×630, device scale 1. No npm dependency: it drives the browser binary
// directly with --screenshot. Byte-identical output needs the same Chromium build as the
// committed cards (chrome-headless-shell from Playwright's cache, build 1248); another
// build renders the same design with slightly different antialiasing.

import { registerHooks } from "node:module";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir, platform, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");

// ── Copy that lives in .astro files, not in src/data ─────────────────────────
// These can't be imported (Astro components don't run in Node), so they're
// mirrored here. Keep them in step with the files named in each comment.

// src/components/Header.astro, DEFAULT_LINKS
const NAV = ["projects", "resume", "contact"];
// src/pages/index.astro, the greeting and statement panels
const HOME_GREETING = ["hi.", "i'm murad, a software engineer in montréal."];
const HOME_STATEMENT = "i build software for the web, end to end.";
// src/pages/contact.astro: the lead line, EMAIL, and the profiles' display values
const CONTACT_LINE = "open to internships, contract work, and interesting problems.";
const CONTACT_EMAIL = "murad@novruzoff.dev";
const CONTACT_HANDLES = ["github.com/novruzoff", "linkedin.com/in/novruzovmurad"];
// Card footer line (cards only)
const BYLINE = "murad novruzov · software engineer";

// ── Data files ───────────────────────────────────────────────────────────────
// Node 24 runs .ts directly (type stripping), but the data files use
// extensionless relative imports (`./penknife`), which Vite resolves and Node
// doesn't. This hook retries such an import with ".ts". Type-only imports
// (penknife.ts → Header.astro) are stripped before they're resolved.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      const relative = specifier.startsWith("./") || specifier.startsWith("../");
      if (error?.code === "ERR_MODULE_NOT_FOUND" && relative && !/\.[a-z]+$/i.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw error;
    }
  },
});
const { projects } = await import(pathToFileURL(join(ROOT, "src/data/projects.ts")).href);
const { experience } = await import(pathToFileURL(join(ROOT, "src/data/experience.ts")).href);

// ── Helpers ──────────────────────────────────────────────────────────────────

// Same escaping as Python's html.escape (the cards were first made with it).
const escape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");

// "sep 2025 — present" → "2025 — present"; "jan 2026 — may 2026" → "2026".
// The cards show years only; a range within one year collapses to that year.
const years = (dates) => {
  const ends = dates
    .split("—")
    .map((part) => part.trim())
    .map((part) => (part === "present" ? part : (part.match(/\d{4}/)?.[0] ?? part)));
  return ends.length === 2 && ends[0] === ends[1] ? ends[0] : ends.join(" — ");
};

// "ARB (azerbaijan republic broadcaster)" → "ARB": the card has room for the name only.
const shortCompany = (company) => company.replace(/\s*\(.*\)\s*$/, "");

const fontFaces = () => {
  const font = (weight) =>
    `data:font/woff2;base64,${readFileSync(join(ROOT, `public/fonts/geist-mono-${weight}.woff2`)).toString("base64")}`;
  return `@font-face{font-family:G;font-weight:400;src:url(${font(400)}) format("woff2")}
@font-face{font-family:G;font-weight:600;src:url(${font(600)}) format("woff2")}`;
};

// ── Card templates ───────────────────────────────────────────────────────────
// The markup and CSS below are the shipped design; don't restyle here without
// regenerating every card. Colors are the site tokens written out: #0f0f10
// page, #161618 elevated, #004d98 fill, #5d95da accent, white at .95/.75/.55/.48,
// and the home text panels' pair: #0b141e (--panel-dark) / #6a8baf (--panel-muted).

// Home: the greeting (muted on dark), a gradient standing in for the video, and the
// statement (dark on muted), mirroring the homepage's inverted text-panel pair.
const homeCard = (faces) => `<!doctype html><html><head><meta charset="utf-8"><style>
${faces}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;background:#0f0f10;font-family:G;color:rgba(255,255,255,.95);-webkit-font-smoothing:antialiased}
.top,.bot{position:absolute;left:40px;right:40px;display:flex;justify-content:space-between;align-items:center}
.top{top:0;height:76px;border-bottom:1px solid rgba(255,255,255,.06)}
.name{font-weight:600;font-size:24px}
.links{font-size:19px;color:rgba(255,255,255,.55);display:flex;gap:24px}
.links span::before{content:"/";color:rgba(255,255,255,.48)}
.frame{position:absolute;left:40px;right:40px;top:96px;bottom:76px;border:1px solid rgba(255,255,255,.06);padding:12px;display:grid;grid-template-columns:1.25fr .8fr 1fr;gap:12px}
.p{border:1px solid rgba(255,255,255,.06);padding:26px;display:flex;flex-direction:column}
.greet{background:#0b141e}
.greet p{font-weight:600;font-size:40px;line-height:1.15;letter-spacing:-.01em;color:#6a8baf}
.loop{background:linear-gradient(180deg,#0b2b52 0%,#5d95da 38%,#004d98 64%,#0f0f10 100%)}
.stmt{background:#6a8baf;justify-content:flex-end;text-align:right}
.stmt p{font-weight:600;font-size:36px;line-height:1.15;letter-spacing:-.01em;color:#0b141e}
.bot{bottom:0;height:76px;font-size:19px;color:rgba(255,255,255,.48)}
.bot b{font-weight:400;color:rgba(255,255,255,.75)}
</style></head><body>
<div class="top"><span class="name">novruzoff</span><span class="links">${NAV.map((n) => `<span>${n}</span>`).join("")}</span></div>
<div class="frame">
 <div class="p greet"><p>${HOME_GREETING.map(escape).join("<br>")}</p></div>
 <div class="p loop"></div>
 <div class="p stmt"><p>${escape(HOME_STATEMENT)}</p></div>
</div>
<div class="bot"><span>${escape(BYLINE)}</span><b>novruzoff.dev</b></div>
</body></html>
`;

const PAGE_CSS = `*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;background:#0f0f10;font-family:G;color:rgba(255,255,255,.95);-webkit-font-smoothing:antialiased}
.top,.bot{position:absolute;left:40px;right:40px;display:flex;justify-content:space-between;align-items:center}
.top{top:0;height:76px;border-bottom:1px solid rgba(255,255,255,.06)}
.name{font-weight:600;font-size:24px}
.links{font-size:19px;color:rgba(255,255,255,.55);display:flex;gap:24px}
.links span::before{content:"/";color:rgba(255,255,255,.48)}
.links .cur{color:rgba(255,255,255,.95)}.links .cur::before{color:#5d95da}
.frame{position:absolute;left:40px;right:40px;top:96px;bottom:76px;border:1px solid rgba(255,255,255,.06);padding:12px;display:grid;grid-template-columns:.9fr 1.3fr;gap:12px}
.p{border:1px solid rgba(255,255,255,.06);padding:28px;display:flex;flex-direction:column}
.big{background:#004d98;justify-content:flex-end}
.big h1{font-weight:600;font-size:76px;line-height:1;letter-spacing:-.01em}
.side{background:#161618;justify-content:center;gap:12px}
.side li{list-style:none;font-size:24px;line-height:1.35;color:rgba(255,255,255,.75)}
.side li b{font-weight:600;color:rgba(255,255,255,.95)}
.side li span{color:rgba(255,255,255,.48)}
.side .lead{font-size:26px;line-height:1.35;color:rgba(255,255,255,.75)}
.side .email{font-weight:600;font-size:34px;color:#5d95da;margin-top:18px}
.side .handles{font-size:21px;color:rgba(255,255,255,.55);margin-top:10px}
.bot{bottom:0;height:76px;font-size:19px;color:rgba(255,255,255,.48)}
.bot b{font-weight:400;color:rgba(255,255,255,.75)}`;

// Sub-pages: the page name large on the blue panel, that page's content beside it,
// the page's own link highlighted in the header, its URL in the footer.
const pageCard = (faces, slug, side) => {
  const nav = NAV.map((n) => `<span class="${n === slug ? "cur" : ""}">${n}</span>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>${faces}
${PAGE_CSS}</style></head><body>
<div class="top"><span class="name">novruzoff</span><span class="links">${nav}</span></div>
<div class="frame"><div class="p big"><h1>${slug}</h1></div><div class="p side">${side}</div></div>
<div class="bot"><span>${escape(BYLINE)}</span><b>novruzoff.dev/${slug}</b></div></body></html>`;
};

const sides = {
  // Every project in projects.ts order: title · years.
  projects:
    "<ul>" +
    projects
      .map((p) => `<li><b>${escape(p.title)}</b> <span>· ${escape(years(p.dates))}</span></li>`)
      .join("") +
    "</ul>",
  // Every role in experience.ts order: role over company.
  resume:
    "<ul>" +
    experience
      .map((r) => `<li><b>${escape(r.role)}</b><br><span>${escape(shortCompany(r.company))}</span></li>`)
      .join("") +
    "</ul>",
  contact:
    `<p class="lead">${escape(CONTACT_LINE)}</p>` +
    `<p class="email">${escape(CONTACT_EMAIL)}</p>` +
    `<p class="handles">${CONTACT_HANDLES.map(escape).join("<br>")}</p>`,
};

// ── Browser ──────────────────────────────────────────────────────────────────
// CHROME_PATH wins. Otherwise the newest chrome-headless-shell in Playwright's
// cache (what the committed cards were made with), then a system Chrome/Chromium.
const findChrome = () => {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = {
    darwin: join(homedir(), "Library/Caches/ms-playwright"),
    win32: join(process.env.LOCALAPPDATA ?? "", "ms-playwright"),
  }[platform()] ?? join(homedir(), ".cache/ms-playwright");
  if (existsSync(cache)) {
    const shells = readdirSync(cache)
      .filter((dir) => dir.startsWith("chromium_headless_shell-"))
      .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
    for (const dir of shells) {
      for (const sub of readdirSync(join(cache, dir))) {
        for (const name of ["chrome-headless-shell", "chrome-headless-shell.exe"]) {
          const bin = join(cache, dir, sub, name);
          if (existsSync(bin)) return bin;
        }
      }
    }
  }
  const system = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = system.find(existsSync);
  if (found) return found;
  throw new Error(
    "No Chromium found. Set CHROME_PATH, or install one with `npx playwright install chromium-headless-shell`."
  );
};

const screenshot = (chrome, htmlPath, pngPath) => {
  execFileSync(
    chrome,
    [
      "--headless",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      // Gives the inlined fonts time to load before the capture.
      "--virtual-time-budget=2000",
      "--window-size=1200,630",
      `--screenshot=${pngPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: "ignore" }
  );
};

// ── Run ──────────────────────────────────────────────────────────────────────
const chrome = findChrome();
const faces = fontFaces();
const cards = [
  { out: "public/og.png", html: homeCard(faces) },
  ...["projects", "resume", "contact"].map((slug) => ({
    out: `public/og/${slug}.png`,
    html: pageCard(faces, slug, sides[slug]),
  })),
];

const work = mkdtempSync(join(tmpdir(), "og-"));
let changed = 0;
try {
  cards.forEach(({ out, html }, i) => {
    const htmlPath = join(work, `card-${i}.html`);
    const pngPath = join(work, `card-${i}.png`);
    writeFileSync(htmlPath, html);
    screenshot(chrome, htmlPath, pngPath);
    const fresh = readFileSync(pngPath);
    const target = join(ROOT, out);
    const current = existsSync(target) ? readFileSync(target) : null;
    if (current && current.equals(fresh)) {
      console.log(`unchanged  ${out}`);
      return;
    }
    changed++;
    if (CHECK_ONLY) {
      console.log(`differs    ${out}  (${current?.length ?? 0} → ${fresh.length} bytes)`);
    } else {
      writeFileSync(target, fresh);
      console.log(`written    ${out}  (${fresh.length} bytes)`);
    }
  });
} finally {
  rmSync(work, { recursive: true, force: true });
}
console.log(`\n${changed} of ${cards.length} card(s) ${CHECK_ONLY ? "differ" : "updated"} · ${chrome}`);
if (CHECK_ONLY && changed > 0) process.exitCode = 1;
