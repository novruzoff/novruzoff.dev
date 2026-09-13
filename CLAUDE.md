# novruzoff.dev

Personal portfolio for Murad Novruzov. CS student at McGill (expected May 2027), Founding Developer at True Competency, based in Montreal.

## Stack

- Astro 6.x (static site generation). View Transitions planned, not wired yet (no `<ClientRouter />`).
- TypeScript strict mode; `pnpm check` runs `astro check` (`@astrojs/check` needs TypeScript 5–6, so it's pinned to `^6` — TS 7 isn't supported yet)
- Tailwind CSS v4 (via Vite plugin)
- React and MDX: **not installed** (removed as unused). Add `@astrojs/react` if an interactive island is ever needed, `@astrojs/mdx` when case studies or writing land.
- GSAP: **removed** (never used). All motion is vanilla (WAAPI, IntersectionObserver, CSS scroll-driven animations); see Motion system.
- Lenis (smooth scroll)
- Deployed on Vercel
- Domain: novruzoff.dev

## Design direction

Creative-developer mode. Dense, interactive, motion-driven — anchored on the Luke Baffait / Apple-product-page / Wise neighborhood, with engineer substance underneath. Motion is a feature, not decoration. The portfolio should *feel alive* and reward exploration.

NOT editorial. NOT minimal text on background. NOT static.

### Color system

Dark-only. Near-black, not pure black.

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

--accent:         #F59E0B
--accent-light:   #FBBF54
--accent-bg:      rgba(245, 158, 11, 0.10)
--accent-border:  rgba(245, 158, 11, 0.25)
--accent-glow:    rgba(245, 158, 11, 0.22)
```

The background steps (page → elevated → hover) each add ~6-7 per channel and keep the same faint cool bias as `#0f0f10`. `theme-color` and the favicon use `#0f0f10` too.

`--text-tertiary` is the contrast floor for any text: 4.98:1 on `--bg-page` as shipped (the minifier rounds 0.48 to alpha 122/255), 4.93:1 on `--bg-elevated` hover rows and under the hero glow's peak (WCAG AA 4.5:1). Don't lower it — 0.35 failed at 3.19:1.

Wire as CSS custom properties in `global.css`, exposed to Tailwind v4 via `@theme`. Single source of truth, no duplication: color values live only in `:root`; an `@theme inline` block maps Tailwind names onto them (`--color-text-primary: var(--text-primary)`), and the font stacks are defined once in `@theme` under Tailwind's own names (`--font-sans`, `--font-mono`). Components prefer Tailwind utilities (`text-text-primary`) over inline `style="color: var(...)"`.

### Case (HARD RULE)

All rendered text is in sentence case as written in source.

- NEVER apply `text-transform: lowercase` anywhere.
- NEVER apply `text-transform: uppercase` to body content (acceptable only for short ≤5-char mono labels like tag pills, used sparingly).
- Section headers: "Selected work", "Experience", "Writing".
- Nav links: "Work", "Experience", "About", "Contact" ("Writing" joins when that section exists).
- Project link affordances: "Live", "Repo", "Case study", or arrow glyphs (`↗`).
- Proper nouns (Murad Novruzov, McGill, True Competency, MindVista, SSMU) ALWAYS sentence case.

**Exception:** the hero handle `novruzoff` is rendered lowercase because it is a handle (GitHub `@novruzoff`, domain `novruzoff.dev`, email prefix `murad@novruzoff.dev`), not styled text. This is the *only* lowercase rendering on the entire site. Proper nouns elsewhere stay sentence case.

If a previous build used CSS lowercase anywhere besides the hero handle, undo it. This has been a recurring failure mode — be explicit about checking.

### No decorative marks

- No logo marks, monograms, or graphic brand elements in the nav.
- No decorative dots, chevrons, or shapes next to the name.
- The name "Murad Novruzov" in sans is the nav element.
- Typography is the brand.

### Typography

System stack, plus exactly one web-font exception.

```
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
--font-display-serif: 'Playfair Display Subset', Georgia, 'Times New Roman', serif;
```

**The single permitted web font:** Playfair Display Medium Italic (weight 500), subset to the glyphs `[space N f n o r u v z]` (enough for the `Novruzov → novruzoff` morph), self-hosted at `public/fonts/playfair-display-italic-500-novruzov.woff2` (~2 KB). Declared in `global.css` as `"Playfair Display Subset"` with a matching `unicode-range` and `font-display: swap`, preloaded in `Layout.astro`, exposed as `--font-display-serif`. Used ONLY for the hero handle and the footer `novruzoff` bookend. Any other glyph means re-subsetting the file. No other web fonts.

Sans owns prose, the hero tagline, and headings; the handle is the serif exception. Mono is reserved for metadata, dates, technical labels, and code. Mono gives design-engineer character through *contrast*, not volume.

Hierarchy:
- **Hero handle (`novruzoff`):** `--font-display-serif` (Playfair Medium Italic 500), `clamp(64px, 18vw, 240px)`, tracking −0.022em, line-height 0.95, full-width and bottom-anchored in the hero. Footer bookend uses the same face and scale at watermark opacity.
- **Hero tagline:** 13px, sans, top-left, max-width 280px; first line secondary, second line tertiary.
- **Section headers:** 14-16px, sans, weight 500, sentence case ("Selected work").
- **Nav (left, the name):** 14-15px, sans, weight 500, sentence case ("Murad Novruzov").
- **Nav (right, links):** 13-14px, sans, weight 400-500, sentence case ("Work", "About").
- **Body:** 14-15px, sans, weight 400, line-height 1.6.
- **Metadata (dates, tertiary labels):** 11-12px, mono, color tertiary, `font-variant-numeric: tabular-nums`.

### Motion system (creative-developer mode)

Motion is a feature, not an afterthought. All of it is vanilla — WAAPI, IntersectionObserver, CSS scroll-driven animations — in Astro `<script>` blocks. No GSAP, no React: the entrance was moved off a React + GSAP bundle to vanilla WAAPI for ~98% less JS. Don't reintroduce GSAP for anything CSS or WAAPI can do.

What's implemented:

1. **Hero entrance (load-linked, once per session).** `src/components/Hero.astro`. Phase 1 (0–2.5s): "Murad" (sans) and "Novruzov" (serif, scaled down) fade in centered and hold so the name can be read. Phase 2 (2.5–4.2s): "Murad" exits left while "Novruzov" morphs per letter into `novruzoff` — N→n via a scaleY squash with the glyph swapped at the midpoint, the trailing v collapses, the two f's grow in — and travels to its bottom-anchored rest position. Phase 3 (4.2s): tagline, link bar, and glow settle in; at 5.0s inline transforms are cleared so the layout survives resizes. Plays once per session (`sessionStorage`); replays and restored-scroll loads get a 600ms settle instead. The choreography is approved — don't retime it without asking.
   - **Gate + failsafe.** Base CSS is the settled end state. Start states only apply under `html.js-hero` (set inline in `Layout.astro`) + `prefers-reduced-motion: no-preference`. The hero script claims the gate by adding `hero-live`; if it hasn't by `DOMContentLoaded` (script failed to load), or it throws, the gate is removed and the static page shows. `will-change` lives in the gated CSS and is cleared per element once its entrance finishes.

2. **Cursor-reactive amber gradient.** A 910px radial layer (`circle closest-side`, `--accent-glow` → transparent) inside `.hero-glow`, which is absolute within the hero and clipped to it; a 180px fade to `--bg-page` at the hero's bottom edge keeps it from ending in a hard line. It follows the cursor with a per-frame lerp (damping 0.08) via `transform: translate3d(...)` only — no repaint. Layer opacity animates to 0.22 on entrance. The rAF loop idles once the glow settles and stays off while the tab is hidden or the hero is out of view (IntersectionObserver). Hidden under `(hover: none)` and reduced motion. No `filter: blur()` on the moving element; the gradient itself is the soft form.

3. **Scroll reveals.** `[data-reveal]` elements fade up 14px (700ms ease-out-expo, 70ms stagger via `--reveal-i`) when an IntersectionObserver adds `.is-in`, fire-once. Gated by `html.js-reveal` with the same claim/failsafe pattern (`reveal-live`). CSS scroll-driven animations (`animation-timeline`, progressive enhancement) add the scroll-progress hairline, section rules drawing in, and the hero's bottom dimming as it exits. Not built yet: per-section choreography (mask/clip reveals on headings, scale-up on cards) so each section does something distinct on arrival.

4. **Page transitions.** Planned: Astro View Transitions via `<ClientRouter />` in Layout, subtle cross-fade. Not wired yet (single route).

**Deferred, not built: hero portrait.** The original plan was a portrait that scrubs from `blur(48px) scale(1.04)` to sharp over 0 to ~80% of viewport height, scroll-linked, never load-linked. No portrait asset exists and the hero has no slot for one. Don't add it without asking.

#### Motion principles (from emil-design-eng)

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for entrances. Linear for scrubbed scroll. NEVER `ease-in` for UI.
- Duration: 400-700ms for entrances. Scroll-linked durations are determined by scroll distance, not time.
- Stagger: 60-100ms between siblings is the sweet spot. >150ms reads as ceremonial.
- ALWAYS respect `prefers-reduced-motion: reduce` — collapse to static end-states.
- `will-change` sparingly, only on actively animating elements. Remove after animation.

### Smooth scroll

**Lenis**, initialised in a vanilla `<script>` in `src/pages/index.astro` (not a React island). Config: `duration: 1.15`, `easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (expo-out). Same-page `#` links are routed through `lenis.scrollTo`, which honours `html { scroll-padding-top: 32px }` and clamps to the page bounds — so anchor clicks land the same with or without Lenis, and the 52px sticky nav clears section headers via that padding plus each section's own top padding. Off under reduced motion. No ScrollTrigger sync is needed: GSAP isn't used, and Lenis drives native scroll, so the CSS scroll-driven animations stay in step. Move it into `Layout.astro` when a second route lands.

### Layout

- Density over whitespace, EXCEPT in the hero — the hero gets room to breathe (it's the entrance moment).
- 0.5px borders only. Background layering creates hierarchy.
- Hero composition: full viewport (`min-height: 100dvh`), no portrait. Tagline top-left. Bottom-anchored: a thin link bar (location in mono · GitHub / LinkedIn / Email · section links) above the massive full-width `novruzoff` handle. Cursor glow behind, clipped to the hero. Same composition on mobile; the location drops out of the link bar under 640px.
- Project list: three-column grid (132px date | 1fr content | 88px link affordance). Multiple links stack in the affordance column.
- Experience list: two-column grid (132px date | role + company + location).
- The 132px date column (`--date-col` on `.rows`) is shared by both lists so they hold one left edge; it fits "Jul 2025 — May 2026" on one line at 11px mono.
- Generous side padding on mobile; tighter on desktop for density.

## Information architecture

Single page (`/`). Sections stacked vertically with thin dividers:

1. **Hero** — name-morph entrance, two-line tagline top-left, link bar with the location in mono ("Montréal, Canada"), massive `novruzoff` handle at the bottom. Cursor-reactive amber glow behind, clipped to the hero. No portrait (deferred). The hero's link bar is the only nav while the hero is on screen.
2. **Site nav** (`src/components/SiteNav.astro`) — `Murad Novruzov` on the left (sans 14px/500, links to `#top` through Lenis, no decorative mark); "Work · Experience · About · Contact" on the right (sans 13px, secondary, anchors to `#work` / `#experience` / `#about` / `#contact`). It sits in the DOM right after the hero with `position: sticky; top: 0` (52px tall, negative bottom margin so it overlays `<main>` instead of pushing it), aligned to the `.wrap` column, over a 72% `--bg-page` + `backdrop-filter: blur(12px)` backdrop with a 0.5px `--border-subtle` hairline. Hidden while any of the hero is in view (IntersectionObserver on the hero, not a scroll listener); enters with `translateY(-8px) → 0` + fade over 300ms ease-out-expo, exits in 200ms. Hidden state uses `visibility: hidden` (flipped only after the exit fade), so its links leave the tab order and the accessibility tree. Reduced motion: appears/disappears without animating. Gated by `html.js-nav` / `nav-live` like the hero, so no-JS or a failed script leaves it visible. Phones: the dots drop out under 480px, "Experience" under 400px, so it stays on one line.
3. **Selected work** — section header with count, one row per project in `projects.ts`. Each row animates in on scroll.
4. **Experience** — section header, one row per role in `experience.ts`.
5. **About** — two or three first-person sentences.
6. **Contact** — one line plus the amber `mailto:` link.
7. **Footer** — © year · Montreal, GitHub, LinkedIn, and a ghost `novruzoff` bookend (serif, watermark opacity) linking back to top.

No separate pages yet. Case study pages may come later under `/work/[slug]`.

## Content schema

### Project
```ts
{
  slug: string
  title: string
  dates: string         // "2025 — now", "2025 — 2026", "2024"
  blurb: string         // 1-3 short sentences of concrete facts and numbers. Don't drop facts to hit a length.
  liveUrl?: string
  repoUrl?: string
  caseStudyUrl?: string // for future tier-1 case studies
}
```

Only include URLs that resolve publicly; omit a link rather than ship a 404. `ProjectRow` renders every link present (Case study, Live, Repo); the title links to the first.

### Experience
```ts
{
  role: string          // "Founding Developer"
  company: string       // "True Competency"
  dates: string         // "Sep 2025 — present"
  location?: string
}
```

Content lives in TypeScript files under `src/data/`: `projects.ts`, `experience.ts`. MDX comes later when there's something rich to write.

## Voice

- First person, low ceremony.
- Specific over abstract.
- Numbers when they exist, prose when they don't.
- Never marketing voice (no "passionate", "leveraging", "synergy").
- Never humble-brag; just state facts.

Right voice:
> Built a competency-tracking platform for interventional cardiology training as the sole engineer. Live with paying institutional client (APSC, Hong Kong).

Wrong voice:
> Passionate about leveraging modern web technologies to revolutionize healthcare education.

## Code conventions

- TypeScript strict. No `any` without an explanatory comment.
- Astro components for static structure. React only when interactivity is needed.
- Prefer `class:list` (Astro) and `clsx` (React) for conditional classes over template literals.
- File naming: kebab-case for files, PascalCase for component exports.
- Import order: external libs → Astro/React → local components → utils → types → styles.
- Co-locate component CSS in `<style>` blocks for Astro components when scoped styles are needed. Use Tailwind utilities for the common case.
- Prefer `sticky` over `fixed` when possible.
- No `localStorage`/`sessionStorage` in islands without a clear reason.
- Motion code is currently vanilla JS in Astro `<script>` blocks. If GSAP is ever adopted, it lives in React islands, not Astro components.

## Performance budgets (creative-developer mode)

- Total JS shipped: ≤ 60 KB gzipped. Currently ~7.6 KB: hero ~1.9 KB and Lenis + scroll reveals ~5.5 KB (module files), site nav ~0.2 KB (small enough that Astro inlines it). No GSAP or React is installed.
- Web font: the single Playfair subset, ~2 KB, preloaded.
- Social/meta: `public/og.png` (1200×630, ~24 KB) is the OG + Twitter `summary_large_image` card; `public/apple-touch-icon.png` (180×180) is the amber italic "n". Both are rasterized from vector outlines of the Playfair subset (plus the system SF for the small line on the card), so they match the site's type exactly. Regenerate them if the handle or tagline changes. `robots.txt` points at `/sitemap-index.xml` (generated by `@astrojs/sitemap`).
- Lighthouse performance: ≥ 92 mobile, ≥ 96 desktop.
- LCP: ≤ 2.0s on 4G.
- Accessibility, Best Practices, SEO: 100 each, non-negotiable.
- Hero portrait (deferred; applies if it's ever added): optimized AVIF/WebP, max 200 KB, `loading="eager"`, `fetchpriority="high"`, explicit `width`/`height` to prevent CLS.

## Out of scope (don't build without asking)

- Light mode
- MDX, case study sub-pages, blog routes (placeholder anchor only)
- Command menu (⌘K)
- Custom cursor (the gradient IS the signature; don't add a custom cursor on top)
- WebGL / Three.js / 3D
- Contact form (mailto link only)
- Analytics beyond Vercel Speed Insights

Future, in this order: case study pages → command menu → writing/blog.

## References

The portfolio should feel at home in this neighborhood. Reference, don't copy:
- lukebaffait.fr (creative-developer aesthetic, smooth scroll, hero photo, scroll choreography)
- Apple product pages (scroll-driven storytelling, restraint)
- docs.wise.design (typography confidence, dense visual content, inline motion)
- rauno.me (density, monospace metadata, restraint)
- emilkowal.ski (component motion done right)

## Skills available

This project has design-engineering skills installed for AI agents:
- emil-design-eng (motion, interaction philosophy)
- design-taste-frontend (anti-slop frontend generation)
- web-design-guidelines (Vercel Labs UI audit checklist)
- make-interfaces-feel-better (Jakub Krehel, optical polish)

When implementing UI, audit against these explicitly: invoke their principles by name in your reasoning (easing, frequency, optical alignment, anti-slop pre-flight check). Run design-taste-frontend pre-flight BEFORE writing UI code, not after.