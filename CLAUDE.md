# novruzoff.dev

Personal portfolio for Murad Novruzov. CS student at McGill (expected May 2027), Founding Developer at True Competency, based in Montreal.

> **Redesign (branch `redesign`).** Panel-layout homepage, Geist Mono only, lowercase copy, two muted blues. Everything below describes the new system and is binding. The old hero, Lenis, scroll reveals and the Cormorant font are deleted; don't bring any of them back or "fix" new code toward the old rules.

## Stack

- Astro 6.x (static site generation). View Transitions planned, not wired yet (no `<ClientRouter />`).
- URLs have no trailing slash. `astro.config.mjs` sets `build: { format: 'file' }` (so `src/pages/penknife/privacy.astro` builds `dist/penknife/privacy.html`, and `penknife/index.astro` builds `dist/penknife.html`) and `trailingSlash: 'never'`. `vercel.json` sets `cleanUrls: true` (serves `/penknife/privacy` from that `.html` file with a 200, and 308s `*.html` to the clean URL) and `trailingSlash: false` (308s `/penknife/` to `/penknife`). These URLs are in App Store Connect, so don't change the scheme. Two side effects:
  - With `format: 'file'`, `Astro.url.pathname` is `/index.html` or `/penknife/privacy.html`. `Layout.astro` strips `(/index)?.html` before building the canonical and `og:url`, and `Header.astro` does the same before setting `aria-current`. Use that `pathname`, not `Astro.url.pathname`, for anything URL-shaped.
  - `@astrojs/sitemap` writes the root as `https://novruzoff.dev` (no slash) under either option; `serialize` can't change it. It's the same URL as the canonical `https://novruzoff.dev/`.
  - `astro preview` 404s the slash forms (it doesn't read `vercel.json`); only a Vercel deploy shows the 308s.
- TypeScript strict mode; `pnpm check` runs `astro check` (`@astrojs/check` needs TypeScript 5–6, so it's pinned to `^6` — TS 7 isn't supported yet)
- Tailwind CSS v4 (via Vite plugin)
- React and MDX: **not installed** (removed as unused). Add `@astrojs/react` if an interactive island is ever needed, `@astrojs/mdx` when case studies or writing land.
- GSAP: **removed** (never used). All motion is vanilla (WAAPI, IntersectionObserver, CSS).
- No smooth-scroll library (Lenis was removed with the old home page): native scrolling everywhere.
- Deployed on Vercel
- Domain: novruzoff.dev

## Design direction

The homepage is a full-viewport row of vertical, full-height panels side by side: photos, one looping abstract video, and two text panels (a greeting, a one-line identity statement), under a minimal header and over a social footer. It's the vibe page: no metrics, no experience timeline, no project list. The substance lives on sub-pages: `/projects`, `/resume`, `/contact`. The structural reference is jonahseguin.com — study the pattern, don't clone it. Our own type (Geist Mono), color (Barça blue on near-black) and media are what make it ours.

Everything is monospace and lowercase (see Case and Typography). Dark-only.

**Retired: the "creative-developer, motion is a feature" direction.** The name-morph hero entrance, the cursor glow, the dot-grid mesh, Lenis smooth scroll and the scroll choreography (reveals, progress hairline, drawing section rules) belonged to the old home page and were deleted with it. Don't add them back or build new work on them. Motion in the new design is small and specific: a short load-in of the panels, the video loop, and hover states (see Motion system).

### Color system

Dark-only. Near-black, not pure black. **Exactly two blues**, one muted hue; nothing else is colored.

```
--bg-page:       #0f0f10
--bg-elevated:   #161618
--bg-hover:      #1c1c1e

--border-subtle: rgba(255, 255, 255, 0.06)
--border:        rgba(255, 255, 255, 0.10)
--border-strong: rgba(255, 255, 255, 0.15)

--text-primary:   rgba(255, 255, 255, 0.95)
--text-secondary: rgba(255, 255, 255, 0.55)
--text-tertiary:  rgba(255, 255, 255, 0.48)

--panel-dark:     #0B141E                     /* very dark navy */
--panel-muted:    #6A8BAF                     /* muted mid blue */
--accent:         var(--panel-muted)          /* links, accent text, focus rings */
--accent-bg:      rgba(106, 139, 175, 0.20)   /* selection background */
--accent-border:  rgba(106, 139, 175, 0.35)   /* link underlines */
```

**Two blues, one hue.** `--panel-dark` (`#0B141E`, HSL 211.6° / 46% / 8%) and `--panel-muted` (`#6A8BAF`, 211.3° / 30% / 55%) are the site's only colors besides the neutrals. Both are muted: no saturated fills anywhere. (They replaced an earlier saturated Barça blue and a separate brighter link blue; don't reintroduce either, or add a third blue.)

- **As a pair** (the homepage text panels, the Apple touch icon, the social cards' name panels): one is the other's text. **5.23:1 either way** (AA is 4.5:1). The greeting is `--panel-muted` on `--panel-dark`; the statement and the cards' name panels are `--panel-dark` on `--panel-muted`. `--panel-dark` is only 1.03:1 against `--bg-page`, so a `--panel-dark` panel relies on its 0.5px `--border-subtle` frame to read as a panel; keep the frame. `--panel-dark` is never a text color on the page itself.
- **As the accent** (`--accent` is `--panel-muted` under its job name): links, accent text, **all header and footer text** (the name, the nav links, the footer links), the current-page underline, the current-role dot, focus rings, the metric values on /projects. Measured: **5.41:1 on `--bg-page`, 5.10:1 on `--bg-elevated`** (metric tiles), 4.80:1 on `--bg-hover` (unused today), and on the header's translucent backdrop (94% `--bg-page` over whatever scrolls beneath) 5.41:1 over the page and **4.73:1 worst case**, over a pure-white region (a photo highlight, the App Store badge); at the old 72% it was 2.20:1, and 3.68:1 over the light statement panel. The footer is solid `--bg-page`: 5.41:1. Focus rings need 3:1 and get 5.41:1 / 5.10:1.
- **There's no lighter link blue.** Hovering an accent-colored link goes to `--text-primary`; hovering a neutral link (the Penknife page links, the header) goes to `--accent` or `--text-primary`. A link inside a line of text needs its `--accent-border` underline: `--accent` is only 1.15:1 against the surrounding `--text-secondary` grey (WCAG 1.4.1).
- **Selected text** is `--text-primary` on `--accent-bg` (13.55:1). `--accent` on `--accent-bg` would be 4.21:1, so don't use it there.
- Any new use of either blue as text must be measured against its real background and clear 4.5:1; if it doesn't, change the background or use a neutral, not a new blue.

The alpha tokens are `--panel-muted` at fixed opacities, written as rgba, not `color-mix()`: the minifier emits a full-opacity fallback for a `color-mix()` it can't resolve, which would turn a 20% tint into a solid block. Focus rings use `--accent` (5.41:1 on the page, over the 3:1 a focus indicator needs).

The background steps (page → elevated → hover) each add ~6-7 per channel and keep the same faint cool bias as `#0f0f10`. `theme-color` uses `#0f0f10` too.

`--text-tertiary` is the contrast floor for any text: 4.98:1 on `--bg-page` as shipped (the minifier rounds 0.48 to alpha 122/255) and 4.93:1 on `--bg-elevated`. Don't lower it — 0.35 failed at 3.19:1.

**Tailwind: preflight and tokens only, no utilities.** No markup uses a Tailwind utility class (checked against every class in the built pages), so `global.css` imports it with automatic scanning off: `@import "tailwindcss" source(none);`. With scanning on, Tailwind turned words in comments, prose and CSS property names into utilities nothing used (17 of them, ~6 KB raw, including `.lowercase`/`.uppercase` from this file). Tailwind still provides the preflight reset and the `@theme` wiring below. If utilities are ever wanted, register the source folders explicitly (`@source "../components"; @source "../pages";`) and keep prose-heavy sources (`src/data`, the Penknife pages, this file) out.

Wire as CSS custom properties in `global.css`, exposed to Tailwind v4 via `@theme`. Single source of truth, no duplication: color values live only in `:root`; an `@theme inline` block maps Tailwind names onto them (`--color-text-primary: var(--text-primary)`). The font stack is defined once in `@theme` as `--font-mono`; `--font-*: initial` removes Tailwind's default sans and serif stacks and `--default-font-family` points preflight at the mono stack. Components style themselves with class names and scoped `<style>` blocks using the tokens (`color: var(--text-secondary)`), not utilities and not inline `style="color: …"`. The `@theme inline` color mapping only matters if utilities are turned back on; it emits nothing today.

### Case (HARD RULE)

**All rendered text is lowercase, written lowercase in the source.**

- Write the lowercase letters in the markup and data. Don't produce it with `text-transform` — the source is the truth (what's read aloud, copied, indexed and grepped is what's shown).
- Proper nouns and names are lowercase too: people, places, organizations and my own projects — "murad novruzov", "novruzoff", "true competency", "mindvista", "openrobotics", "vitruvius venture studio", "montreal", "hong kong", "azerbaijan republic broadcaster", "brim", events like "codejam 16". Months too: "sep 2025 — present".
- Section headers, nav labels and link labels are lowercase: "projects", "resume", "contact", "experience", "live", "repo".

**Exceptions — these keep their own casing, written exactly as here:**
- Acronyms and initialisms: APSC, RLS, JWT, SEO, LCP, SSMU, ARB, SCS, RBAC, MCQ, IVUS, OCT, CSS, PDF, JSON (and any other acronym — never "apsc" or "rls"). So the project is "SSMU websites" and the company is "ARB (azerbaijan republic broadcaster)". "BSc" keeps its casing.
- Brand and product casing: McGill (the one organization that keeps its casing), and third-party product and technology names — iOS, iPhone, iCal, GitHub, LinkedIn, WordPress, Lighthouse, PageSpeed, App Store, Next.js, TypeScript, PostgreSQL, Swift, SwiftUI, App Intents, JavaFX, and every name in a stack or skills list, exactly as the vendor writes it. Generic terms built from them are lowercase ("speed index", "agile").
- **Not rendered copy, so normally cased:** JSON-LD structured data, image `alt` text, `aria-label`s.
- **One deliberate exception to the brand rule:** the footer's links are `email` `github` `linkedin` `instagram` `x`, lowercase, because they read as handles, not brand names. Brand casing applies everywhere else, prose included ("my code is on GitHub"; /contact's labels are GitHub, LinkedIn, Instagram, X).

Page `<title>`s and meta descriptions are normally cased on purpose: they're search and social snippets, not page copy ("Projects — Murad Novruzov").

Not converted yet: the Penknife pages' body copy (sentence case, US English; the header and footer on those pages are already lowercase). Convert it, or explicitly exempt it, in its own step; don't mass-lowercase it in passing.

`text-transform: uppercase` is still not allowed on body content.

### No decorative marks

- No logo marks, monograms, or graphic brand elements in the header.
- No decorative dots, chevrons, or shapes next to the name.
- The handle `novruzoff`, in Geist Mono 600, is the header's name element.
- Typographic punctuation is fine and is part of the system: the `/` before header links, drawn in CSS with empty alt text (`content: "/" / ""`) so it's never announced. Footer links are plain words separated by space: no brackets, no separators.
- Typography is the brand.

### Typography

**One family: Geist Mono (OFL), weights 400 and 600.** No sans, no serif, no other web fonts. (Cormorant Italic, the old hero's serif, is deleted.)

```
--font-mono: "Geist Mono", "Geist Mono Fallback", "Geist Mono Fallback Consolas", ui-monospace, monospace;
```

- **Files:** `public/fonts/geist-mono-400.woff2` (9.7 KB) and `geist-mono-600.woff2` (9.8 KB), with `geist-mono-OFL.txt`. Self-hosted, `font-display: swap`. **Only the 600 is preloaded** (in `Layout.astro`, every page); the 400 is found through `global.css`.
- **Subset:** Basic Latin (U+0020–007E) plus U+00A0 nbsp, © · × é – — ‘ ’ “ ” … → ↗ − (U+2212, the true minus in "−97%"). The `@font-face` `unicode-range` matches the subset exactly, so any other character falls through to the fallback font instead of rendering as tofu. A new glyph in copy means re-subsetting both weights and extending the range. Source and recipe: the static `GeistMono-Regular.ttf` / `GeistMono-SemiBold.ttf` from the `geist@1.9.2` npm package (`dist/fonts/geist-mono/`), run through fontTools `subset` with `--flavor=woff2 --layout-features='kern,liga,calt,ccmp,locl,mark,mkmk' --name-IDs=0,1,2,3,4,5,6,13,14` and the `--unicodes` list above. TrueType hinting is kept on purpose (it about doubles the size, 5 → 9.7 KB, but Windows renders 11–13px mono noticeably better with it).
- **Fallback faces** (`global.css`): until Geist arrives, text renders in a metric-matched local mono so the swap doesn't reflow. `size-adjust` scales the local font's advance to Geist's 0.600em (Menlo / DejaVu Sans Mono 0.6021em → 99.66%; Consolas 0.5498em → 109.13%), and ascent/descent overrides are Geist's (1.005 / 0.295em) divided by that factor. Each fallback family has a 600 face pointing at the local bold.
- **Weights: only 400 and 600.** A 500 silently renders as 400 (the font matcher picks the nearest lighter face), and faux bold is off sitewide (`font-synthesis-weight: none`), so 700 can't be smeared out of 600. Use 600 for anything that used to be 500.
- **Tracking:** none at text sizes; never tighten small mono. At display sizes (≥ 28px), at most −0.01em.
- `.mono` still exists (many components use it) but only adds tabular figures now; the font is mono everywhere.
- Mono runs wide (0.6em per character), so widths are exact and computable — use that when checking that a line fits (e.g. the header at 320px, the 144px date column).

Hierarchy:
- **Base / body:** 14px, 400, line-height 1.6.
- **Long-form prose** (/resume about, Penknife pages): 15px, line-height 1.7, **max 70ch** (`.prose p`, Penknife's `.terms` and `.faq`; in mono 1ch is exactly one character, so ~70 characters per line).
- **Metadata (dates, tertiary labels):** 11–12px, 400, `--text-tertiary`.
- **Header:** name `novruzoff` 14px/600 `--text-primary`; links 13px/400 `--text-secondary` (12px under 400px).
- **Footer:** 12px.
- **Section headers:** 14px/600, `--text-secondary`.
- **Page titles** (Penknife `h1`): `clamp(28px, 5vw, 36px)`/600, −0.01em.
- **Panel display text** (homepage greeting and statement): 600, **line-height 1.12**, −0.01em, sized to the panel's width with container-query units (each panel is `container-type: inline-size`; `cqi` is its content box, inside the padding): **`clamp(20px, 16.5cqi, 64px)` in every layout**. 16.5cqi was set, like jonahseguin.com, so a 9-character longest word on its own line spans ~87.5% of the inner width (9 × 0.59em × 16.5 = 87.6%). **The current copy's longest word is "novruzoff," (10 characters), which spans ~97.4%**: still inside the padding (16.9cqi would be 100%), but over that target; 14.8cqi would bring it back to ~87.5%. **The locked 2×2 also caps it by height**: `clamp(20px, min(16.5cqi, 6.35vh − 15px), 64px)`. The greeting wraps to at most 7 lines (its four `<span>`s force at least 4) and 7 × 1.12 × size must fit the inner height, 50vh − 112.6px; without the cap 768×1024 overflowed by 21px. Measured, nothing overflowing or breaking mid-word: 1440×900 38.1px, 1920×1080 53.9px, 1024×768 24.6px, 1000×700 31.8px, 375×812 51.0px, 320×640 41.9px ("novruzoff," 97.3–97.4%); sized down by the height cap: 768×1024 50.0px (91.1%, 6px to spare), 700×900 42.1px, 640×640 and 767×640 25.6px. Big type makes the phone page taller than one screen. **If the copy changes, re-measure the longest word and the 2×2 line count**: both formulas depend on them.

### Motion system

Small and specific. No GSAP, no smooth scroll, no scroll-driven or scroll-triggered animation anywhere on the site.

1. **Panel entrance (home, CSS only, no gate).** Each panel fades in and rises 12px over 500ms ease-out-expo, 70ms apart left to right (`--i` on each panel, 0–4; the delay is `--i × 70ms`). **Except photo a, which doesn't animate** (`.panel-a { animation: none }`): it's the page's LCP image, and an element that starts at opacity 0 isn't an LCP candidate (with the fade, Lighthouse picked the footer text). A transform-only rise would show a large photo sliding at first paint, which reads as a shift, so it sits still and the other panels arrive beside it. Measured after: LCP element is photo a's `<img>` on mobile (1.1s) and desktop (0.2s), Lighthouse 100/100/100/100. Don't put an opacity entrance back on it. The keyframes run only under `prefers-reduced-motion: no-preference`, so reduced motion and no-JS both get the static page with nothing ever hidden. No JS gate is needed because nothing depends on a script.
2. **The video loop** (home, the page's only script, ~0.5 KB gzipped, inline):
   - The `<video>` ships with no `<source>` and `preload="none"`; the script attaches the sources on `window` `load`, so the loop never competes with the LCP image.
   - It plays only while on screen (IntersectionObserver) and while the tab is visible (`visibilitychange`).
   - Under `prefers-reduced-motion: reduce` or Save-Data (`navigator.connection.saveData`) the sources are never attached: only the poster shows, and the panel control stays hidden (not focusable: there's nothing to pause).
   - **The video panel is the pause/play control; there's no visible toggle.** WCAG 2.2.2 (Pause, Stop, Hide) requires a way to pause moving content that runs longer than 5s, but a visible button competed with the panel, so the control is invisible: a transparent `<button>` laid over the video (`.loop-control`, `inset: 0`). A click or tap anywhere on the panel, or Enter/Space when it's focused, toggles playback. It's an overlay rather than a wrapper so `hidden` can switch it off (no JS, reduced motion, Save-Data) without hiding the video. Nothing shows at rest or on hover and the cursor stays default; keyboard focus draws an inset ring (the panel clips its contents, so the global outward ring would be cut off): 1px `--accent` with a 3px `--bg-page` band outside it, a two-colour indicator (WCAG technique C40) that keeps a dark neighbour whatever frame is showing. It's the next Tab stop after the header links. Its accessible name is the action, "pause background video" / "play background video", and follows the video's real state through `play`/`pause` events, so it says "play" when the browser refuses autoplay (iOS Low Power Mode). A user's pause sticks: scrolling away and back or switching tabs doesn't resume it; an automatic off-screen pause does resume. Verified over the DevTools Protocol: mouse click, touch tap, Enter and Space each toggle; Tab reaches it with `:focus-visible`; auto-pause off screen, auto-resume on return, user pause held through the same round trip; Lighthouse accessibility 100.
   - The video itself is decorative: `aria-hidden="true"`, `tabindex="-1"`, `muted loop playsinline autoplay disablepictureinpicture disableRemotePlayback` (camelCase in source: Astro's types want it that way; HTML attributes are case-insensitive).
3. **Hover states:** color transitions at 180ms ease-out-expo; link arrows nudge 2–3px. Nothing moves on scroll.

#### Motion principles (from emil-design-eng) — still apply to new work

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo, `--ease-out-expo`) for entrances. Linear for scrubbed scroll. NEVER `ease-in` for UI.
- Duration: 400-700ms for entrances.
- Stagger: 60-100ms between siblings is the sweet spot. >150ms reads as ceremonial.
- ALWAYS respect `prefers-reduced-motion: reduce` — collapse to static end-states.
- `will-change` sparingly, only on actively animating elements. Remove after animation.

### Layout

- 0.5px borders only. Background layering creates hierarchy.
- **Every page is full width.** `.wrap` (full width, `clamp(16px, 2vw, 24px)` side padding) is the one content-edge class, shared by the header, the footer and every `<main>`, home and document pages alike, so content starts under "novruzoff" and ends under the last nav link (measured 0px off at 320–1920px). There's no centred column any more (the old 828px `.wrap` and the separate `.wrap-wide` are gone).
- **Readability caps inside the full width** (document pages): every direct child of `main.doc` stops at `--measure` (720px), left-aligned to the page edge; paragraphs stop at 70ch. Three blocks opt out (`max-width: none`) and lay out across the full page edges instead:
  - **/projects:** the card grid (1/2/3/4 columns).
  - **/resume, from 1024px: two columns** (`.resume-grid`), about, skills and education on the left, the experience timeline on the right spanning all three rows (`grid-template-rows: auto auto 1fr`, so the left column stays packed at the top). **40/60** (`2fr 3fr`), then **50/50 from 1600px**, because at 60% the timeline would pass ~900px and pull each date away from its role (measured column widths: 377/565 at 1024, 534/801 at 1440, 900/900 at 1920). Gap `clamp(40px, 4vw, 72px)`. The DOM stays in reading order (about, experience, skills, education), which is also the single-column order below 1024px, each section capped at `--measure`. The skills label | items split follows the skills section's own width (container query: label beside items from 500px, above them below), so it stacks in the narrow left column at 1024 and on phones.
  - **/contact, from 1024px: two equal columns** (`.contact-grid`): heading, line and email on the left, the links list on the right with its top hairline level with the heading. Single column below 1024px, capped at `--measure`.
  - The 70ch paragraph cap still applies inside every column. The Penknife pages stay single-column with the 720px / 70ch caps: they're documents.
- Header (`src/components/Header.astro`): sticky, 52px, 94% `--bg-page` + `backdrop-filter: blur(12px)` (94%, not more transparent, so its blue text holds 4.5:1 over anything scrolling beneath) with a 0.5px `--border-subtle` hairline. Stays on one line down to 320px: 13px links with 16px gaps; 12px with 12px gaps under 400px; the `/` prefixes drop under 360px (the widest set, the three Penknife links, measures 270px there against a 288px row).

#### Home panel grid (`src/pages/index.astro`)

Header, panel grid, footer in one flex column. Five panels: **photo a · greeting · video · statement · photo b**. Every panel has its own 0.5px `--border-subtle` frame, with a 12px gap between panels. **There's no outer frame** around the grid: its outer edges are the `.wrap` content edges, so they line up exactly with the header's ("novruzoff" on the left, the last nav link on the right; measured 0.00–0.02px at every layout). The page chrome around the locked grid (header, the 12px above and below, footer) is ~139px.

| Viewport | Layout |
|---|---|
| ≥ 1024px | Five columns: a, greeting, video, statement, b |
| 768–1023px, landscape | Four columns, photo b hidden |
| 640–1023px otherwise (portrait tablets, 640–767px) | 2×2: a + greeting over video + statement, photo b hidden. Four columns on a portrait tablet would be ~170px wide and ~900px tall: a sliver, not a panel |
| < 640px | Two columns that scroll: greeting across the top, photo a + video side by side (3:4 each), statement across the bottom, photo b hidden, no outer frame. About one phone screen (verified at 375×812 and 320×640) |

- **Height guard.** From 640px wide *and* 640px tall, the page is locked to exactly one viewport (`100dvh`) and the grid rows share what's left; media panels drop their aspect ratio and fill the cell. Below 640px tall, nothing is locked: media panels keep their aspect ratio (3:4 in 2×2 and on phones, 2:3 in the four- and five-column layouts), text panels match their row, and the page scrolls. Text panels never clip, so text can't be squeezed out.
- **Greeting:** `--panel-dark` panel, `--panel-muted` text (5.23:1), top-left, as the page's `<h1>`, one `<span>` per line: "hi." / "i'm murad," / "a.k.a novruzoff," / "a software engineer in canada."
- **Statement:** the inverse, `--panel-muted` panel, `--panel-dark` text (5.23:1), bottom-right: "i build apps, websites, and other software." Pure vibe: no company names, no metrics. (The copy lives in `index.astro`; `HOME_GREETING` / `HOME_STATEMENT` in `scripts/generate-og.mjs` and the default `ogImageAlt` in `Layout.astro` mirror it, so change all three together and run `pnpm run og`.)
- **Media panels** fill their cell with `object-fit: cover`. Photos are additionally **pre-cropped per layout** (`src/components/PanelPhoto.astro`, see Homepage media) so the file's shape matches the panel's and its width-based srcset is honest; the video is only center-cropped by cover, so a native 9:16 source crops least.
- **Missing media** renders a quiet `--bg-elevated` block labelled "photo a" / "video" / "photo b" (11px, tertiary, `aria-hidden`). See Homepage media.

#### Document pages

- `/projects`, `/resume`, `/contact`, Penknife: `Header` + `<main class="wrap doc">` + `Footer`. `.doc`, `.doc-head` (h1, `.lead`, `.meta`) and `.prose` live in `global.css`. `.doc [id]` has a 76px `scroll-margin-top`, so `/projects#mindvista` lands 76px down, clear of the 52px sticky header (verified). Don't add `scroll-padding-top` to `html`: it stacks with the margin (the old home page's 32px did, landing anchors at 108px). No JS, no reveals; section rules are static.
- **/projects is a grid of compact cards** (`src/components/ProjectCard.astro`), full width: 1 column under 640px, 2 from 640px, 3 from 1024px, 4 from 1600px, 12px gaps, `align-items: start` so opening one card never stretches the others in its row. Each card, top to bottom: title (16px/600); the date line and, for brim, the award line (12px `--text-tertiary`); the **one-liner** (`blurb`); up to **three metrics** (the first three of `metrics`, as value | label rows in an elevated 0.5px box, values `--accent` 600 on `--bg-elevated`, 5.10:1); the **main stack** (the first `stackOnCard` items, default 4); the links (live / App Store / repo, always visible, `--accent`); then a native **`<details>` fold** ("+ details" / "− details", a decorative marker; no JS for the toggle) holding the bullets, plus "more numbers" for any metrics past the third and "also" for the rest of the stack, so nothing on a project is lost. There are no summary paragraphs. Cards use the panels' 0.5px `--border-subtle` frame with no fill.
  - **One-liners** (casing per Case): true competency "cardiology training platform, built solo" · mindvista "McGill wellness platform, rebuilt off WordPress" · penknife "native iOS toolkit, 10 on-device tools" · brim AP automation "accounts-payable platform, led a 4-person team" · SSMU websites "club websites for McGill's student society" · openrobotics "JavaFX warehouse robot simulator" · mymeetings "office-hours booking platform, McGill SCS competition".
  - **Deep links:** each card is `id={slug}`. An inline script at the end of projects.astro (396 B raw, 238 B gzipped; the only JS on any document page) opens the fold of the card `location.hash` names and scrolls it into view (on load and on `hashchange`), so the /resume links land on an open card 76px down, below the sticky header. Verified for all three /resume links at 1440 and 375.
- Experience list: a vertical timeline (`<ol class="timeline">` of `.xp-node` items, most recent first): a 28px gutter (20px under 480px) holding a 9px dot, then role over company | date over location (right-aligned, tertiary). The dot is filled `--accent` when the role's `dates` contain "present" (`data-current`), otherwise a hollow 1px `--text-tertiary` ring. The 0.5px connector is trimmed to the dot on the first and last node. `ExperienceRow` (/resume) adds the bullets and a link to the role's `/projects#<slug>` entry under both columns. The link reads "view the <project title> project →", with the title taken from `projects.ts` and the arrow `aria-hidden`, so a screen reader hears the phrase, never the path; ARB has no project and no link, and under 480px moves date and location onto a line below the company (otherwise long company names break over four lines).
- Inline lists with "·" separators (stack, skills) draw the dot **after** each item but the last, so a wrapped line never starts with a separator.

## Information architecture

Routes:

| URL | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | The panel homepage (see Layout → Home panel grid). Vibe only |
| `/projects` | `src/pages/projects.astro` | A full-width grid of compact cards (see Document pages), in `projects.ts` order (most significant first, not by date): true competency, mindvista, penknife, brim AP automation, SSMU websites, openrobotics, mymeetings. Each card is `/projects#<slug>` (`#brim-ap-automation` for brim) and opens when linked to |
| `/resume` | `src/pages/resume.astro` | Lean: about, timeline with 1–2 bullets per role (linking to `/projects#<slug>`), skills, education. Two columns from 1024px (see Layout) |
| `/contact` | `src/pages/contact.astro` | One line, the `mailto:` link, GitHub, LinkedIn, Instagram and X. Two columns from 1024px (see Layout) |
| `/penknife` | `src/pages/penknife/index.astro` | Penknife (iOS app) landing: one line, ten tools, links |
| `/penknife/privacy` | `src/pages/penknife/privacy.astro` | App Store Privacy Policy URL. `EFFECTIVE_DATE` constant at the top |
| `/penknife/support` | `src/pages/penknife/support.astro` | App Store Support URL. Contact + FAQ |

**The homepage carries no substance; /projects carries the depth (on the cards and in their folds); /resume does not repeat it.** A resume bullet is one line with at most a couple of numbers, then the link to the project entry. Put new detail on the project, not the role. The sub-pages ship no JS except /projects' 238-byte card-opening script, and pass `personSchema={false}` (the Person JSON-LD stays on `/`; the sub-pages have no JSON-LD).

Old home anchors (`/#work`, `/#experience`, `/#about`, `/#contact`) no longer exist; fragments never reach the server, so they can't be redirected. They land on the homepage.

### Homepage media (`src/assets/home/`)

Optional at build time: `index.astro` finds each file with `import.meta.glob`, so a missing file is simply absent and its panel renders the placeholder. Nothing else needs changing when a file is added; rebuild.

| File | Shape | Notes |
|---|---|---|
| `photo-a.{jpg,jpeg,png,webp,avif,tif,tiff}` | any shape; **≥ 1470px tall** for a sharp 1440×900 @2x desktop, ≥ 1830px for 1920×1080 @2x | Panel 1, the LCP image (`priority`: eager, `fetchpriority="high"`). Rendered by `PanelPhoto` with five art-directed crops (below). Subject should sit in the centre third: the narrowest crop keeps only the middle 36% of a square's width |
| `photo-b.{…}` | same as photo a | Panel 5, desktop only, lazy. Two crops: the five-column locked 9:25 and the short-screen 2:3 |
| `loop.webm` and/or `loop.mp4` | portrait 9:16, ideally 720×1280 | Copied as-is (`?url` import), not transcoded. WebM (VP9/AV1) is listed first, MP4 (H.264, faststart) second. No audio track; 8–12s; seamless loop; no flashing (WCAG 2.3.1); keep detail in the center 60%; target ≤ 1 MB WebM, ≤ 2 MB MP4. A wider source still works (center-cropped), but 9:16 crops least |
| `loop-poster.{…}` | same frame as the loop's first frame | Converted to a 720w WebP poster. Shown before load, under reduced motion and Save-Data, and when autoplay is refused, so it must look intentional on its own |

**Photo pipeline (`PanelPhoto.astro`).** The panels are tall and narrow and use `object-fit: cover`, so a width-chosen variant of an uncropped source gets upscaled to the panel's *height* (a square source loaded 720×720 into a 526×1470-device-px panel at 1440×900 @2x: 2.04× upscale). `PanelPhoto` renders one art-directed `<picture>` whose sources are pre-cropped (sharp `fit: cover`, `position: center`) to each layout's panel shape:

| Layout (media condition, first match wins) | Crop (w:h) | `sizes` |
|---|---|---|
| ≥ 1024px and ≥ 640px tall (five columns, locked) | 9:25 (0.36; a 1440×900 panel is ~0.353) | `max(20vw − 19px, (100vh − 139px) × 0.36)`, fallback `20vw − 19px` |
| 768–1023px landscape, ≥ 640px tall (four columns) | 5:12 (0.417) | `max(25vw − 19px, (100vh − 139px) × 0.4167)` |
| ≥ 640px wide and tall (2×2, portrait tablets) | 6:7 (0.857) | `max(50vw − 22px, (50vh − 76px) × 0.857)` |
| ≥ 1024px, or ≥ 768px landscape, on a short screen | 2:3 (the panel's fixed ratio) | `20vw − 19px` / `25vw − 19px` |
| default: phones and short 2×2 | 3:4 (the panel's fixed ratio) | `50vw − 22px` (2×2 and phones) |

- In the locked layouts the panel's shape follows the viewport, so the image renders at `max(panel width, panel height × crop ratio)`; that's what `sizes` says. Browsers that can't parse `max()` in `sizes` skip that entry and use the panel width. The 139px is the page chrome around the locked grid (header, paddings, footer; no outer frame), measured; the column formulas match measured widths within 1–2px. If the page chrome or breakpoints change, update these together with the panel CSS.
- Variants: widths 240/360/480/640/800/960/1200/1440 under each crop's maximum, plus the maximum itself (the largest box of that shape inside the source). Never upscaled: sharp runs with `withoutEnlargement`, which would otherwise clamp and break the crop's ratio.
- Formats and quality: AVIF 60 → WebP 80 → JPEG 85 (the `<img>` fallback, default crop). The largest desktop AVIF is ~15 KB.
- **Measured with the original 1254×1254 photo-a, before the outer frame was removed** (the photos have since been replaced and the panels are ~5px wider and ~25px taller; re-measure before relying on these) (rendered device px vs file px; ≤ 1.00× is sharp): 1440×900 @2x 451×1253 for 526×1470 (**1.17×, source-limited**); 1920×1080 @2x 1.59× (source-limited); 1024×768 @2x 0.96×; 1000×700 @2x 0.93×; 1280×600 @2x 0.96×; 768×1024 @2x 0.91×; 375×812 @3x 0.77×; 1440×900 @1x 0.73×. Before the pipeline: 2.04× at 1440×900 @2x, 2.23× at 1024×768 @2x.
- Measuring it: `img.naturalWidth` with a `w`-descriptor srcset is divided by the chosen candidate's density, so it only echoes `sizes`. Read a file's real pixels by loading `currentSrc` into a plain `new Image()`.

**Strip GPS/EXIF from photos before committing**: the repo is public, and git history keeps the original files even though the served images are re-encoded. Set `PHOTO_A_ALT` / `PHOTO_B_ALT` in `index.astro` to describe the photos (they're empty, i.e. decorative, until real photos land).

### Shared chrome

- **Header** (`src/components/Header.astro`, every page, Penknife included). `novruzoff` on the left, linking to `/`; a link list on the right from the `links` prop (default: projects, resume, contact; the Penknife pages pass `PENKNIFE_NAV` from `src/data/penknife.ts`). `label` names the `<nav>` landmark (default "Primary"; Penknife passes "Penknife"). Always full width (`.wrap`); there's no width prop. No script: plain links, native keyboard behavior. Links have 6px block padding so each target is ~33px tall (WCAG 2.5.8).
  - **Colour:** everything (name, links, their `/`) is `--accent` at rest and `--text-primary` on hover and `:focus-visible`, like jonahseguin.com's single-colour chrome.
  - **Current page:** `aria-current="page"` on whichever link's `href` equals the page's served URL (the name link included, on `/`), and that link is **underlined**, since colour can't mark it any more. The underline is the site's thin link-underline shape (1px, offset 5px) but in `--accent` itself, not the 35% `--accent-border`: it's the only cue for the state, so it needs 3:1 (WCAG 1.4.11), and `--accent` is 5.41:1 where `--accent-border` is 1.67:1. The `/` is `inline-block` so the underline covers the word only.
- **Footer** (`src/components/Footer.astro`, every page): **links only, centred**, in this order: `email` (`mailto:murad@novruzoff.dev`), `github`, `linkedin`, `instagram`, `x`. No copyright line. Plain words with 16px between them, no separators; all `--accent`, hover/focus `--text-primary`. Centred at every width with `justify-content: center` on the wrapping flex list, which centres each line on its own: the five links are 273px at 12px, so they stay on one line down to 320px (8px to spare each side at 320px), and anything narrower wraps onto a second, also centred, line (verified at 300 and 260px: 0px off-centre per line). Always full width (`.wrap`). `flush` (home only) drops the top margin and hairline, since the footer sits straight under the panel grid.
- **Social profiles** (footer, /contact, and the homepage Person JSON-LD `sameAs`): GitHub `github.com/novruzoff`, LinkedIn `linkedin.com/in/novruzovmurad`, Instagram `instagram.com/novruzoffmurad`, X `x.com/novruzoffmurad`. /contact shows each as label + readable address; the contact social card lists the same four (`CONTACT_HANDLES` in `scripts/generate-og.mjs`).
- Keep link labels on the same line as their `<a>` tag in the header: whitespace inside the link renders as a gap after the CSS `/`.

Case study pages may come later under `/projects/[slug]`.

### Layout props

`src/layouts/Layout.astro` takes, with defaults that produce the home page:

- `title`, `description` — per page; also used for `og:title` / `og:description`.
- `ogImage` (`"/og.png"`), `ogImageAlt` — social card. Site-relative path; made absolute against `site`. The default alt describes `og.png` (a miniature of the home panels). `/projects`, `/resume` and `/contact` pass their own card (`/og/<page>.png`) and alt. Alt text is normally cased (names like True Competency), quoting on-card words as shown. The Penknife pages use the default.
- `title` and `description` feed `<title>`, `og:title`/`og:description` **and** `twitter:title`/`twitter:description` (stated explicitly: some clients read only `twitter:*`). Canonical and `og:url` both come from the same normalized pathname.
- `personSchema` (`true`) — Person JSON-LD for Murad.
- `appStoreId` (unset) — adds `<meta name="apple-itunes-app">` (Safari's Smart App Banner). The Penknife pages pass `PENKNIFE_APP_ID`.

Layout always preloads Geist Mono 600 (it carries the homepage's display text, which is the LCP element until photo a exists). There are no motion gates anywhere. The sub-pages and the Penknife pages pass `false` for `personSchema`.

### Penknife pages

Static by design: no JS at all, no reveals, no scroll-driven motion. Each page is `<Header links={PENKNIFE_NAV} label="Penknife" />` + `<main class="wrap doc">` + `<Footer />`, imports `src/styles/penknife.css` for its own pieces (`.terms`, `.tools`, `.store-badge`, `.doc-links`, `.faq`), and reuses the shared document styles in `global.css`, `SectionHeader`, `.mono`, `.contact-email` and the tokens.

- **App Store badge** on `/penknife`: Apple's official badge, unedited, from `public/badges/`, linking to `PENKNIFE_APP_STORE_URL` (no tracking parameters). The site is dark-only, so it's always the white badge (Apple's variant for dark backgrounds). Shown at its native 120×40 (Apple's minimum is 40px tall), with the base image reset's max-width overridden so it never shrinks. Don't redraw or recolor it; no other Apple logos.
- **App ID, URL and nav** live in `src/data/penknife.ts` (`PENKNIFE_APP_ID`, `PENKNIFE_APP_STORE_URL`, `PENKNIFE_NAV`), shared by the badge, the Smart App Banner, the header and `projects.ts`.
- **Copy:** US English (matches the app and iOS labels: "colors", "Favorites"). Contact is `support@novruzoff.dev` everywhere. The privacy policy states only facts the developer has confirmed; don't add claims. Change `EFFECTIVE_DATE` whenever the policy changes (a case-only or styling change isn't a policy change). Body copy is still sentence case; see Case.
- Listed in `projects.ts`: "Live" goes to `/penknife`, "App Store" to the listing.

## Content schema

**Source of truth is Murad's CV.** Don't add facts, numbers or claims that aren't on it. All data is lowercase per Case. Dates are a three-letter month and year joined by an em dash: "sep 2025 — present", "jan 2026 — may 2026", or a bare year ("2026").

### Project (`src/data/projects.ts`)
```ts
{
  slug: string          // also the id on /projects: /projects#<slug>
  title: string         // "true competency", "SSMU websites"
  dates: string
  blurb: string         // the card's one-liner (a few words; no summary paragraph anywhere)
  metrics?: { value: string; label: string }[]  // strongest first: the card shows 3, the rest go in its fold
  highlights?: string[] // the detail, one fact per bullet
  stack?: string[]      // vendor casing, main technologies first: the card shows `stackOnCard`, the rest go in its fold
  stackOnCard?: number  // how many stack items the card face shows (default 4; penknife 3)
  liveUrl?: string
  repoUrl?: string
  appStoreUrl?: string  // rendered as "App Store"
  caseStudyUrl?: string // for future case studies (/projects/[slug])
  award?: string        // a recognition, shown as metadata under the title: "codejam 16 honourable mention (brim fintech challenge, McGill ECSESS)"
}
```

Only include URLs that resolve publicly; omit a link rather than ship a 404 (MyMeetings' repo is private, so it has none). **Exception: Instagram and X** block automated requests (a login wall or an error for bots), so a failed fetch there isn't a dead link; the two handles are confirmed by Murad and stay even if a link checker flags them. `ProjectCard` renders every link present on the card face ("case study", "live", "App Store", "repo"). Absolute `http(s)` links open in a new tab; site-relative ones (`/penknife`) don't.

### Experience (`src/data/experience.ts`)
```ts
{
  role: string          // "founding developer"
  company: string       // "true competency", "SSMU"
  dates: string         // "sep 2025 — present" ("present" marks the current role)
  location?: string     // "montreal, canada"
  highlights?: string[] // 1–2 short bullets for /resume
  projectSlug?: string  // links the role to /projects#<slug>
}
```

### Resume extras (`src/data/resume.ts`)
`skills` (label + items, vendor casing), `education` (degree, school, dates) and `RESUME_PDF_URL`, which is `undefined`: /resume shows a "download pdf" link only when it's set to a real file in `public/`. Never point it at a file that doesn't exist.

MDX comes later when there's something rich to write.

## Voice

- First person, low ceremony.
- Specific over abstract.
- Numbers when they exist, prose when they don't.
- Never marketing voice (no "passionate", "leveraging", "synergy").
- Never humble-brag; just state facts.

Right voice:
> built a competency-tracking platform for interventional cardiology training as the sole engineer. live with a paying institutional client (APSC, hong kong).

Wrong voice:
> Passionate about leveraging modern web technologies to revolutionize healthcare education.

## Code conventions

- If you start a dev or preview server to test or screenshot, stop it before you finish and report that you did. Never leave a server running on port 4321.
- A long-running `astro dev` can serve a **stale component style module**: after a page's `<style>` block was rewritten, Vite's client swapped the old CSS back in and /projects collapsed to one column on the old dev server while a fresh one and the build were fine. If a layout looks wrong in dev, compare against a fresh `pnpm dev` or `pnpm build && pnpm preview` before changing code; restart the dev server to fix it.
- TypeScript strict. No `any` without an explanatory comment.
- Astro components for static structure. React only when interactivity is needed.
- Prefer `class:list` (Astro) and `clsx` (React) for conditional classes over template literals.
- File naming: kebab-case for files, PascalCase for component exports.
- Import order: external libs → Astro/React → local components → utils → types → styles.
- Co-locate component CSS in scoped `<style>` blocks (Header, Footer, ProjectCard, ExperienceRow and the pages do); shared document styles live in `global.css`. No Tailwind utilities (scanning is off; see Color system).
- Prefer `sticky` over `fixed` when possible.
- No `localStorage`/`sessionStorage` in islands without a clear reason.
- Motion code is vanilla JS in Astro `<script>` blocks, or CSS. If GSAP is ever adopted, it lives in React islands, not Astro components.

## Performance budgets

- Total JS shipped: ≤ 60 KB gzipped. Currently **553 B gzipped** (969 B raw), the homepage video script, inlined by Astro, plus /projects' 238 B card-opening script. Every other page ships no JS. No GSAP, React or Lenis is installed.
- Web fonts: Geist Mono 400 (9.7 KB) and 600 (9.8 KB); only the 600 is preloaded.
- CSS: one shared stylesheet, 12.2 KB raw / 3.3 KB gzipped (was 18.3 / 4.5 KB before utilities scanning was turned off and the compact rows were removed).
- Homepage transfer without media: ~26 KB gzipped (HTML 3.0 KB, CSS 3.3 KB, fonts 19.5 KB, favicon). Media adds roughly: photo a 40–150 KB at the served size, photo b similar (desktop only, lazy), poster ≤ 50 KB, loop ≤ 1 MB WebM after `load`.
- Social/meta, all in the new system and regenerated together: `public/og.png` (1200×630, ~52 KB) is a miniature of the home panels (the greeting and statement in the `--panel-dark` / `--panel-muted` pair, a `--panel-dark` → `--panel-muted` → `--panel-dark` gradient standing in for the video); **Favicon: a single "8"** in `--panel-muted` (#6A8BAF), Geist Mono SemiBold's glyph traced as a vector path (no `<text>`: favicons can't load web fonts), on a **transparent** background, no tile. `public/favicon.svg` uses a square viewBox the glyph's height plus ~1.6% padding top and bottom, so the 8 fills the full icon height (it's 12 of 16px wide at 16px). Keep its comment free of double hyphens: XML forbids them inside comments and an invalid SVG shows no icon. `public/favicon.ico` holds 16×16 and 32×32 PNG frames rendered from the SVG by headless Chromium on a transparent page. `public/apple-touch-icon.png` (180×180) is full-bleed `--panel-dark` with the muted-blue 8 centred at 65% of the height (iOS fills transparency with black). Contrast of the 8: 4.54:1 on a dark tab bar (#202124), 3.18:1 on a light one (#f1f3f4), 5.23:1 on the touch icon's navy. `Layout.astro` links all three: the .ico with `sizes="32x32"` (so SVG-capable browsers keep the SVG), the SVG, and the touch icon. **Per-page cards** in `public/og/` (`projects.png`, `resume.png`, `contact.png`, ~50–60 KB each) use the same frame: the header with the page's link highlighted, the page name large in `--panel-dark` on a `--panel-muted` panel (the statement's treatment), and that page's real content on an elevated panel (project titles and years; each role over its company; the contact line, email and handles), with `novruzoff.dev/<page>` at the bottom.
- **Social cards are generated, not drawn: `pnpm run og`** (`scripts/generate-og.mjs`) renders `public/og.png` and `public/og/{projects,resume,contact}.png`. **Re-run it after changing `projects.ts`, `experience.ts`, the homepage greeting/statement, the header links or the /contact copy, and commit the PNGs** (they're served from `public/`, not built). `pnpm run og -- --check` compares without writing and exits 1 if a card is out of date. Each run prints `unchanged` / `written` per card and never rewrites a byte-identical file.
  - **Automatic:** project titles and dates (`projects.ts`, shown as years: "sep 2025 — present" → "2025 — present", a range inside one year → that year) and roles and companies (`experience.ts`, the company cut at its parenthetical: "ARB (azerbaijan republic broadcaster)" → "ARB"). Node 24 imports the `.ts` files directly (type stripping); a small `registerHooks` resolve hook adds the `.ts` that the data files' extensionless imports leave out.
  - **Mirrored constants at the top of the script** (they live in `.astro` files Node can't import): the header links (`Header.astro`), the greeting and statement (`index.astro`), the contact line, email and handles (`contact.astro`), and the card byline. Change them alongside their source.
  - **No npm dependency.** It writes each card as HTML with the Geist Mono woff2 files inlined as data URIs and screenshots it by running Chromium directly (`--headless --screenshot`, 1200×630, scale 1). Browser lookup: `CHROME_PATH`, then the newest `chrome-headless-shell` in Playwright's cache, then a system Chrome/Chromium. Byte-identical output needs a Chromium build that renders these cards the same way as the one the committed cards came from: chrome-headless-shell 1248 made them, and 1255 (picked up automatically after a Playwright cache update) reproduced all of them byte for byte. A build that antialiases differently would make `--check` report every card as changed; the design would be the same.
  - The card design (markup and CSS) lives in the script; change it there and regenerate every card. `robots.txt` points at `/sitemap-index.xml` (generated by `@astrojs/sitemap`).
- Lighthouse performance: ≥ 92 mobile, ≥ 96 desktop. Measured (Lighthouse 12.6.1, headless Chromium, local preview): 100 / 100 / 100 / 100 on every page, mobile and desktop, homepage with placeholder media. Re-run once real photos and the loop land.
- LCP: ≤ 2.0s on 4G.
- Accessibility, Best Practices, SEO: 100 each, non-negotiable.
- Homepage media: see Information architecture → Homepage media for formats and sizes. The loop never loads before `window` `load`.

## Out of scope (don't build without asking)

- Light mode
- MDX, case study sub-pages, blog routes
- Command menu (⌘K)
- Custom cursor
- WebGL / Three.js / 3D
- Contact form (mailto link only)
- Analytics beyond Vercel Speed Insights

Future, in this order: case study pages → command menu → writing/blog.

## References

Reference, don't copy:
- jonahseguin.com (the panel structure: full-height panels side by side, mono, lowercase, sub-pages for substance)
- rauno.me (density, monospace metadata, restraint)
- emilkowal.ski (component motion done right)

## Skills available

This project has design-engineering skills installed for AI agents:
- emil-design-eng (motion, interaction philosophy)
- design-taste-frontend (anti-slop frontend generation)
- web-design-guidelines (Vercel Labs UI audit checklist)
- make-interfaces-feel-better (Jakub Krehel, optical polish)

When implementing UI, audit against these explicitly: invoke their principles by name in your reasoning (easing, frequency, optical alignment, anti-slop pre-flight check). Run design-taste-frontend pre-flight BEFORE writing UI code, not after.
