# novruzoff.dev

Personal portfolio for Murad Novruzov. CS student at McGill (expected May 2027), Founding Developer at True Competency, based in Montreal.

> **Redesign in progress (branch `redesign`).** The site is moving to a new design: a panel-layout homepage, Geist Mono only, lowercase copy, Barça blue. Design direction, Color system, Case and Typography below already describe the new system and are binding. Sections marked **LEGACY** or **CHANGING** still describe the old home page (hero, scroll sections, Lenis) until the step that replaces them rewrites them. Don't extend legacy code; don't "fix" new-system code back toward the legacy rules.

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
- Lenis (smooth scroll) — LEGACY, home page only; removed with the home page rewrite.
- Deployed on Vercel
- Domain: novruzoff.dev

## Design direction

The homepage is a full-viewport row of vertical, full-height panels side by side: photos, one looping abstract video, and two text panels (a greeting, a one-line identity statement), under a minimal header and over a social footer. It's the vibe page: no metrics, no experience timeline, no project list. The substance lives on sub-pages: `/projects`, `/resume`, `/contact`. The structural reference is jonahseguin.com — study the pattern, don't clone it. Our own type (Geist Mono), color (Barça blue on near-black) and media are what make it ours.

Everything is monospace and lowercase (see Case and Typography). Dark-only.

**Retired: the "creative-developer, motion is a feature" direction.** The name-morph hero entrance, the cursor glow, the dot-grid mesh, Lenis smooth scroll and the scroll choreography (reveals, progress hairline, drawing section rules) belong to the old home page and leave with it. Don't add them back, port them to new pages, or build new work on them. Motion in the new design is small and specific: a short load-in of the panels and hover states, documented in Motion system when it's built.

### Color system

Dark-only. Near-black, not pure black. Barça blue is the only accent.

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

--accent-fill:    #004D98                     /* deep Barça blue: solid fills only */
--accent:         #5D95DA                     /* blue text on dark backgrounds */
--accent-light:   #9BC1F1                     /* brighter link tint */
--accent-bg:      rgba(93, 149, 218, 0.20)    /* selection background */
--accent-border:  rgba(93, 149, 218, 0.35)    /* link underlines */
--accent-glow:    rgba(93, 149, 218, 0.22)    /* LEGACY: hero cursor glow */
--hero-dot:       rgba(255, 255, 255, 0.12)   /* LEGACY: hero dot grid */
--hero-drift:     rgba(0, 77, 152, 0.30)      /* LEGACY: hero glow (fill blue) */
```

**The two blues have fixed roles. Never swap them.**
- `--accent-fill` (`#004D98`) is for **fills**: a panel background, a solid block. As text on `--bg-page` it measures 2.29:1 and fails WCAG AA. Text on a fill is white (8.35:1) or `--text-primary` (7.70:1). Don't put `--text-secondary` on it (3.64:1); secondary text on the fill needs at least 0.70 white (4.93:1).
- `--accent` (`#5D95DA`) is for **blue text** on the dark backgrounds: 6.16:1 on `--bg-page`, 5.81:1 on `--bg-elevated`, 5.47:1 on `--bg-hover` (AA is 4.5:1). It's `#004D98`'s own hue (OKLCH 254.8°) lifted to lightness 0.66, so the two read as one color. `--accent-light` (L 0.80) is 10.28:1 on `--bg-page`. Any new blue used as text must be measured against the background it sits on and clear 4.5:1.

The alpha tokens are `--accent` at fixed opacities, written as rgba, not `color-mix()`: the minifier emits a full-opacity fallback for a `color-mix()` it can't resolve, which would turn a 20% tint into a solid block. Focus rings use `--accent` (6.16:1, over the 3:1 a focus indicator needs).

The background steps (page → elevated → hover) each add ~6-7 per channel and keep the same faint cool bias as `#0f0f10`. `theme-color` uses `#0f0f10` too.

`--text-tertiary` is the contrast floor for any text: 4.98:1 on `--bg-page` as shipped (the minifier rounds 0.48 to alpha 122/255) and 4.93:1 on `--bg-elevated`. Don't lower it — 0.35 failed at 3.19:1.

**Tailwind source scan.** Tailwind v4 reads every source file for class-like words, comments included, and ships a utility for each one it recognizes. `global.css` excludes three sources: `@source not "../pages/penknife"` (prose on those pages once generated a stray utility), `@source not "../../CLAUDE.md"` (this file's rules name CSS keywords, which used to ship two unused text utilities) and `@source not "../data"` (project and resume prose; data files never hold class names). Everything else is still scanned, so don't quote utility-like words in `.astro`/`.ts` comments or the README. Known leak: no component actually uses a utility class, yet CSS property names in component `<style>` blocks and words in comments still generate a few dozen unused utilities (`.border`, `.text-wrap`, `.fixed`, `.blur`…). The clean fix is to stop automatic scanning (`@import "tailwindcss" source(none)`) unless utilities start being used; it's queued for the polish step. The Penknife pages are styled by `src/styles/penknife.css`, so don't use Tailwind utilities in them; if a new prose-heavy route lands, exclude it the same way.

Wire as CSS custom properties in `global.css`, exposed to Tailwind v4 via `@theme`. Single source of truth, no duplication: color values live only in `:root`; an `@theme inline` block maps Tailwind names onto them (`--color-text-primary: var(--text-primary)`). The font stack is defined once in `@theme` as `--font-mono`; `--font-*: initial` removes Tailwind's default sans and serif stacks and `--default-font-family` points preflight at the mono stack. Components prefer Tailwind utilities (`text-text-primary`) over inline `style="color: var(...)"`.

### Case (HARD RULE)

**All rendered text is lowercase, written lowercase in the source.**

- Write the lowercase letters in the markup and data. Don't produce it with `text-transform` — the source is the truth (what's read aloud, copied, indexed and grepped is what's shown).
- Proper nouns and names are lowercase too: people, places, organizations and my own projects — "murad novruzov", "novruzoff", "true competency", "mindvista", "openrobotics", "vitruvius venture studio", "montreal", "hong kong", "azerbaijan republic broadcaster". Months too: "sep 2025 — present".
- Section headers, nav labels and link labels are lowercase: "projects", "resume", "contact", "experience", "live", "repo".

**Exceptions — these keep their own casing, written exactly as here:**
- Acronyms and initialisms: APSC, RLS, JWT, SEO, LCP, SSMU, ARB, SCS, RBAC, MCQ, IVUS, OCT, CSS, PDF, JSON (and any other acronym — never "apsc" or "rls"). So the project is "SSMU websites" and the company is "ARB (azerbaijan republic broadcaster)". "BSc" keeps its casing.
- Brand and product casing: McGill (the one organization that keeps its casing), and third-party product and technology names — iOS, iPhone, iCal, GitHub, LinkedIn, WordPress, Lighthouse, PageSpeed, App Store, Next.js, TypeScript, PostgreSQL, Swift, SwiftUI, App Intents, JavaFX, and every name in a stack or skills list, exactly as the vendor writes it. Generic terms built from them are lowercase ("speed index", "agile").
- **Not rendered copy, so normally cased:** JSON-LD structured data, image `alt` text, `aria-label`s.
- **One deliberate exception to the brand rule:** the footer's bracket links are `[github]` `[linkedin]` `[email]`, lowercase, because they read as handles, not brand names. Brand casing applies everywhere else, prose included ("my code is on GitHub").

Page `<title>`s and meta descriptions are normally cased on purpose: they're search and social snippets, not page copy ("Projects — Murad Novruzov").

Not converted yet (each converts in the step that rewrites it, so don't mass-lowercase them now): the legacy hero and home sections (though the data they render is already lowercase); the Penknife pages' body copy (sentence case, US English; the header and footer on those pages are already lowercase).

`text-transform: uppercase` is still not allowed on body content.

### No decorative marks

- No logo marks, monograms, or graphic brand elements in the header.
- No decorative dots, chevrons, or shapes next to the name.
- The handle `novruzoff`, in Geist Mono 600, is the header's name element.
- Typographic punctuation is fine and is part of the system: the `/` before header links and the `[ ]` around footer links. Both are drawn in CSS with empty alt text (`content: "/" / ""`), so they're never announced.
- Typography is the brand.

### Typography

**One family: Geist Mono (OFL), weights 400 and 600.** No sans, no serif, no other web fonts. (Cormorant Italic survives only inside the legacy hero and is deleted with it; nothing new may use it or `--font-display-serif`.)

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
- **Long-form prose** (Penknife pages): 15px, line-height 1.7, max ~62–64ch.
- **Metadata (dates, tertiary labels):** 11–12px, 400, `--text-tertiary`.
- **Header:** name `novruzoff` 14px/600 `--text-primary`; links 13px/400 `--text-secondary` (12px under 400px).
- **Footer:** 12px.
- **Section headers:** 14px/600, `--text-secondary`.
- **Page titles** (Penknife `h1`): `clamp(28px, 5vw, 36px)`/600, −0.01em.
- **Panel display text** (homepage, not built yet): 600; sizes are set in the panel step and documented here then.

### Motion system — LEGACY

> Everything in this section describes the old home page and is deleted when `index.astro` is rewritten as panels. Don't extend it, retime it, or reuse it on other pages. The new design's motion (panel load-in, hover states, video behavior) gets documented here when it's built.

All of it is vanilla — WAAPI, IntersectionObserver, CSS scroll-driven animations — in Astro `<script>` blocks. No GSAP, no React.

1. **Hero entrance (load-linked, once per session, ~2.5s total).** `src/components/Hero.astro`. Phase 1 (0–1.25s): "Murad" and "Novruzov" (serif, scaled down) fade in over 200ms and hold. Phase 2 (1.25–2.1s): "Murad" exits left (350ms) while "Novruzov" morphs per letter into `novruzoff` — N→n via a scaleY squash with the glyph swapped at the midpoint, the trailing v collapses, the two f's grow in on a 30ms stagger — and travels to its bottom-anchored rest position (750ms). Phase 3 (2.1s): tagline, link bar, and glow settle in (250–300ms); at 2.5s inline transforms are cleared so the layout survives resizes. Plays once per session (`sessionStorage`); replays and restored-scroll loads get a 600ms settle instead. ("Murad" now renders in Geist Mono since the body font changed; that's expected until the hero is removed.)
   - **Skip on scroll.** `scroll`, `wheel`, `touchmove` (passive) or a PageUp/PageDown/Arrow Up/Arrow Down/Home/End/Space `keydown` fast-forwards the entrance to its settled end state over 100ms, then runs the normal cleanup. "Murad" is `position: fixed` while the entrance plays, so it must end on its base `display: none`.
   - **Letter clipping.** The trailing v's collapse and the f's reveal clip horizontally only, via `clip-path` (`CLIP_TO_BOX` ↔ `CLIP_TO_INK`), so descenders are never cut. **Never put `overflow` other than `visible` on the handle's letter spans**: it clips the italic f and lifts inline-blocks off the baseline. The `.hero` clips only on x.
   - **Gate + failsafe.** Base CSS is the settled end state. Start states only apply under `html.js-hero` + `prefers-reduced-motion: no-preference`. The gate is set by an inline script at the top of `index.astro` (moved out of `Layout.astro`, since only this page uses it). The hero script claims it by adding `hero-live`; if it hasn't by `DOMContentLoaded`, or it throws, the gate is removed and the static hero shows.
   - The Cormorant subset (`public/fonts/cormorant-italic-600-novruzov.woff2`, `"Cormorant Subset"`, `--font-display-serif`) is used only by the hero handle and is no longer preloaded; the entrance waits for `document.fonts.ready` (up to 900ms) before measuring. Delete the file, the `@font-face` and the token together with `Hero.astro`.

2. **Hero background.** Inside `.hero-glow` (absolute, `overflow: hidden`, `pointer-events: none`, 180px fade at the bottom): a white 24px dot grid drifting one tile per 18s under a fixed radial mask; one drifting glow in the fill blue (`--hero-drift`, 0.30); and a cursor glow (910px, `--accent-glow`, layer opacity 0.22, per-frame lerp at damping 0.08, transform only, idle when settled, hidden tab or out of view; hidden under `(hover: none)` and reduced motion). Worst case — tertiary text on the drift glow's peak with the cursor glow on top — measures 4.55:1; no text sits there anyway.

3. **Scroll reveals.** `[data-reveal]` elements fade up 14px (700ms ease-out-expo, 70ms stagger via `--reveal-i`) when an IntersectionObserver adds `.is-in`, fire-once. Gated by `html.js-reveal` with the same claim/failsafe pattern (`reveal-live`), set by the same inline script in `index.astro`. CSS scroll-driven animations add the scroll-progress hairline, section rules drawing in, and the hero's bottom dimming as it exits.

#### Motion principles (from emil-design-eng) — still apply to new work

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo, `--ease-out-expo`) for entrances. Linear for scrubbed scroll. NEVER `ease-in` for UI.
- Duration: 400-700ms for entrances.
- Stagger: 60-100ms between siblings is the sweet spot. >150ms reads as ceremonial.
- ALWAYS respect `prefers-reduced-motion: reduce` — collapse to static end-states.
- `will-change` sparingly, only on actively animating elements. Remove after animation.

### Smooth scroll — LEGACY

**Lenis**, initialised in a vanilla `<script>` in `src/pages/index.astro`. Config: `duration: 1.15`, expo-out easing. Same-page `#` links are routed through `lenis.scrollTo`, which honours `html { scroll-padding-top: 32px }`. Off under reduced motion. Home-only, and removed with the home page rewrite (the panel homepage fits the viewport on desktop, and the sub-pages are short documents). Don't add it to other pages.

### Layout — CHANGING

> The homepage panel grid (columns per breakpoint, height guard, mobile stacking) is defined in the panel step and documented here then. What follows still holds for the sub-pages and the Penknife pages, except where marked legacy.

- 0.5px borders only. Background layering creates hierarchy.
- Content column: `.wrap`, `max-width: 828px` including `clamp(20px, 4vw, 40px)` side padding (748px of content at desktop). Shared by `<main>`, the header and the footer, so they align.
- Header (`src/components/Header.astro`): sticky, 52px, 72% `--bg-page` + `backdrop-filter: blur(12px)` with a 0.5px `--border-subtle` hairline. Stays on one line down to 320px: 13px links with 16px gaps; 12px with 12px gaps under 400px; the `/` prefixes drop under 360px (the widest set, the three Penknife links, measures 270px there against a 280px row).
- Document pages (`/projects`, `/resume`, `/contact`, Penknife): `Header` + `<main class="wrap doc">` + `Footer`. `.doc`, `.doc-head` (h1, `.lead`, `.meta`) and `.prose` live in `global.css`. `.doc [id]` has a 76px `scroll-margin-top`, so `/projects#mindvista` lands below the 52px sticky header. No JS, no reveals: the section rule is static under `.doc`.
- **Project entries** (`ProjectRow variant="detail"`, /projects): title | dates on one line, a one-line summary, metric tiles (`repeat(auto-fill, minmax(150px, 1fr))`: two per row at 375px, four at desktop; value 17px/600 in `--accent` on `--bg-elevated`, 5.81:1; label 11px tertiary), detail bullets with a hanging decorative "-", the stack, then links in `--accent`. Entries are separated by a hairline; no cards, no hover lift.
- **Compact project rows** (`ProjectRow`, default variant, legacy home page only): three-column grid (144px date | 1fr content | 88px link affordance). The 144px `--date-col` fits the longest date ("nov 2024 — present", 18 chars = 119px in Geist Mono at 11px); re-check if a longer date lands.
- Experience list: a vertical timeline (`<ol class="timeline">` of `.xp-node` items, most recent first): a 28px gutter (20px under 480px) holding a 9px dot, then role over company | date over location (right-aligned, tertiary). The dot is filled `--accent` when the role's `dates` contain "present" (`data-current`), otherwise a hollow 1px `--text-tertiary` ring. The 0.5px connector is trimmed to the dot on the first and last node. `ExperienceRow detail` (/resume) adds the bullets and the `→ /projects#<slug>` link under both columns, and under 480px moves date and location onto a line below the company (otherwise long company names break over four lines).
- Inline lists with "·" separators (stack, skills) draw the dot **after** each item but the last, so a wrapped line never starts with a separator.
- LEGACY hero composition: full viewport, tagline top-left, link bar above the massive `novruzoff` handle at the bottom.

## Information architecture — CHANGING

> The sub-pages are built and hold all the substance. The next step replaces the home page with the panel layout; until then the legacy home page below still renders the same data in compact form.

Routes:

| URL | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | The portfolio (below; legacy, being replaced) |
| `/projects` | `src/pages/projects.astro` | Full depth on every project, in `projects.ts` order; each entry is `/projects#<slug>` |
| `/resume` | `src/pages/resume.astro` | Lean: about, timeline with 1–2 bullets per role (linking to `/projects#<slug>`), skills, education |
| `/contact` | `src/pages/contact.astro` | One line, the `mailto:` link, GitHub and LinkedIn |
| `/penknife` | `src/pages/penknife/index.astro` | Penknife (iOS app) landing: one line, ten tools, links |
| `/penknife/privacy` | `src/pages/penknife/privacy.astro` | App Store Privacy Policy URL. `EFFECTIVE_DATE` constant at the top |
| `/penknife/support` | `src/pages/penknife/support.astro` | App Store Support URL. Contact + FAQ |

**/projects carries the depth; /resume does not repeat it.** A resume bullet is one line with at most a couple of numbers, then the link to the project entry. Put new detail on the project, not the role. The sub-pages ship no JS and pass `personSchema={false}` (the Person JSON-LD stays on `/`).

The home page (`/`) currently has sections stacked vertically with thin dividers:

1. **Hero** (legacy) — name-morph entrance, tagline, link bar, massive `novruzoff` handle.
2. **Header** — `<Header overlay />`, placed right after the hero (see below).
3. **Experience** — one timeline node per role in `experience.ts`.
4. **Selected work** — one row per project in `projects.ts`.
5. **About** — two first-person paragraphs.
6. **Contact** — one line plus the `mailto:` link.
7. **Footer**.

### Shared chrome

- **Header** (`src/components/Header.astro`, every page; replaces the old `SiteNav` and `PageHeader`). `novruzoff` on the left, linking to `/`; a link list on the right from the `links` prop (default: projects, resume, contact; the Penknife pages pass `PENKNIFE_NAV` from `src/data/penknife.ts`). `aria-current="page"` goes on whichever link's `href` equals the page's served URL (the name link included, on `/`). `label` names the `<nav>` landmark (default "Primary"; Penknife passes "Penknife"). `overlay` adds a negative bottom margin so it overlays `<main>`; only the legacy home page uses it (the header sits after the full-height hero there, so it scrolls up and then sticks). No script, no hide-on-hero logic: plain links, native keyboard behavior. Links have 6px block padding so each target is ~33px tall (WCAG 2.5.8).
- **Footer** (`src/components/Footer.astro`, every page): "© {year} murad novruzov · montreal" on the left; `[github]` `[linkedin]` `[email]` on the right (`mailto:murad@novruzoff.dev`), wrapping below the line on phones. The brackets are CSS with empty alt text, so each link's accessible name is the visible word (WCAG 2.5.3). No props. The old Cormorant `novruzoff` bookend is gone.
- Keep link labels on the same line as their `<a>` tag in both components: whitespace inside the link renders as a gap after the CSS `/` or inside the brackets.

Case study pages may come later under `/projects/[slug]`.

### Layout props

`src/layouts/Layout.astro` takes, with defaults that produce the home page:

- `title`, `description` — per page; also used for `og:title` / `og:description`.
- `ogImage` (`"/og.png"`), `ogImageAlt` — social card. Site-relative path; made absolute against `site`. The default alt describes the current `og.png` (the old italic handle); change both together when the card is regenerated.
- `personSchema` (`true`) — Person JSON-LD for Murad.
- `appStoreId` (unset) — adds `<meta name="apple-itunes-app">` (Safari's Smart App Banner). The Penknife pages pass `PENKNIFE_APP_ID`.

Layout always preloads Geist Mono 600. It no longer has `preloadHandleFont` or `motionGates`: the motion gates moved into `index.astro`, the only page with the scripts they gate. The Penknife pages pass `false` for `personSchema`.

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
  blurb: string         // one sentence: what it is (the legacy home page shows only this)
  metrics?: { value: string; label: string }[]  // scannable tiles: { value: "99.9%", label: "uptime" }
  highlights?: string[] // the detail, one fact per bullet
  stack?: string[]      // vendor casing: "Next.js", "Supabase (PostgreSQL + RLS)"
  liveUrl?: string
  repoUrl?: string
  appStoreUrl?: string  // rendered as "App Store"
  caseStudyUrl?: string // for future case studies (/projects/[slug])
}
```

Only include URLs that resolve publicly; omit a link rather than ship a 404 (MyMeetings' repo is private, so it has none). `ProjectRow` renders every link present ("case study", "live", "App Store", "repo"). Absolute `http(s)` links open in a new tab; site-relative ones (`/penknife`) don't.

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

- TypeScript strict. No `any` without an explanatory comment.
- Astro components for static structure. React only when interactivity is needed.
- Prefer `class:list` (Astro) and `clsx` (React) for conditional classes over template literals.
- File naming: kebab-case for files, PascalCase for component exports.
- Import order: external libs → Astro/React → local components → utils → types → styles.
- Co-locate component CSS in `<style>` blocks for Astro components when scoped styles are needed (Header and Footer do). Use Tailwind utilities for the common case.
- Prefer `sticky` over `fixed` when possible.
- No `localStorage`/`sessionStorage` in islands without a clear reason.
- Motion code is vanilla JS in Astro `<script>` blocks, or CSS. If GSAP is ever adopted, it lives in React islands, not Astro components.

## Performance budgets

- Total JS shipped: ≤ 60 KB gzipped. Currently ~7.4 KB, all of it legacy home-page code: hero ~1.9 KB and Lenis + scroll reveals ~5.5 KB (module files). The header and footer ship no JS. No GSAP or React is installed. The Penknife pages ship no JS.
- Web fonts: Geist Mono 400 (9.7 KB) and 600 (9.8 KB); only the 600 is preloaded. The legacy Cormorant subset (~2.2 KB) still loads on the home page for the hero handle, unpreloaded, until the hero is removed.
- Social/meta: `public/og.png` (1200×630, ~24 KB) is the OG + Twitter `summary_large_image` card; `public/apple-touch-icon.png` (180×180) and `public/favicon.svg` are an italic "n" in the old amber. **All three still show the old design** (Cormorant / Georgia italic, amber) and need regenerating in Geist Mono and Barça blue. `robots.txt` points at `/sitemap-index.xml` (generated by `@astrojs/sitemap`).
- Lighthouse performance: ≥ 92 mobile, ≥ 96 desktop.
- LCP: ≤ 2.0s on 4G.
- Accessibility, Best Practices, SEO: 100 each, non-negotiable.
- Homepage media (photos, video): budgets and formats are set in the panel step.

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
