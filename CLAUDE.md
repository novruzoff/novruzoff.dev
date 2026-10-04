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
--mesh-amber:     rgba(245, 158, 11, 0.07)   /* hero mesh washes */
--mesh-light:     rgba(251, 191, 84, 0.04)
--mesh-ember:     rgba(142, 94, 13, 0.09)    /* --accent 55% into --bg-page */
```

The background steps (page → elevated → hover) each add ~6-7 per channel and keep the same faint cool bias as `#0f0f10`. `theme-color` and the favicon use `#0f0f10` too.

`--text-tertiary` is the contrast floor for any text: 4.98:1 on `--bg-page` as shipped (the minifier rounds 0.48 to alpha 122/255), 4.93:1 on `--bg-elevated` hover rows, and ~4.6:1 at the hero background's brightest realistic overlap (mesh + cursor glow; WCAG AA 4.5:1). Don't lower it — 0.35 failed at 3.19:1.

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
--font-display-serif: 'Cormorant Subset', Georgia, 'Times New Roman', serif;
```

**The single permitted web font:** Cormorant Italic, weight 600 (SemiBold Italic; OFL), subset to the glyphs `[N f n o r u v z]` — "novruzoff" plus the capital N the entrance shows as "Novruzov" before the morph. Self-hosted at `public/fonts/cormorant-italic-600-novruzov.woff2` (~2.2 KB), fetched from Google Fonts CSS2 (`family=Cormorant:ital,wght@1,600&text=Nnovruzf`). Declared in `global.css` as `"Cormorant Subset"` with a matching `unicode-range` and `font-display: swap`, preloaded in `Layout.astro`, exposed as `--font-display-serif`. Used ONLY for the hero handle and the footer `novruzoff` bookend. 600 rather than 500: Cormorant's hairlines are very fine, and at 500 they nearly vanish at the 64px mobile size on the dark background. Any other glyph means re-subsetting the file. No other web fonts. (Replaced Playfair Display Italic 500.)

Sans owns prose, the hero tagline, and headings; the handle is the serif exception. Mono is reserved for metadata, dates, technical labels, and code. Mono gives design-engineer character through *contrast*, not volume.

Hierarchy:
- **Hero handle (`novruzoff`):** `--font-display-serif` (Cormorant Italic 600), `clamp(64px, 18vw, 240px)`, tracking −0.022em, line-height 0.95, bottom-anchored in the hero. Bottom padding is `max(clamp(24px, 3.5vw, 48px), 0.22em)` so the italic f's 0.275em descender always fits under macOS and Windows metrics. Cormorant sets smaller than Playfair did at the same size (x-height 0.40em vs 0.53em; "novruzoff" 3.4em wide vs 4.2em). Footer bookend uses the same face and scale at watermark opacity.
- **Never put `overflow` other than `visible` on the handle's letter spans.** It clips the italic f's tail (0.12em left), terminal (0.14em right) and descender, and it moves an inline-block's baseline to its bottom edge, which lifts the letter off the baseline. The morph clips with `clip-path` instead (see Motion system).
- **Hero tagline:** 13px, sans, top-left, max-width 280px; first line secondary, second line tertiary.
- **Section headers:** 14-16px, sans, weight 500, sentence case ("Selected work").
- **Nav (left, the name):** 14-15px, sans, weight 500, sentence case ("Murad Novruzov").
- **Nav (right, links):** 13-14px, sans, weight 400-500, sentence case ("Work", "About").
- **Body:** 14-15px, sans, weight 400, line-height 1.6.
- **Metadata (dates, tertiary labels):** 11-12px, mono, color tertiary, `font-variant-numeric: tabular-nums`.

### Motion system (creative-developer mode)

Motion is a feature, not an afterthought. All of it is vanilla — WAAPI, IntersectionObserver, CSS scroll-driven animations — in Astro `<script>` blocks. No GSAP, no React: the entrance was moved off a React + GSAP bundle to vanilla WAAPI for ~98% less JS. Don't reintroduce GSAP for anything CSS or WAAPI can do.

What's implemented:

1. **Hero entrance (load-linked, once per session, ~2.5s total).** `src/components/Hero.astro`. Phase 1 (0–1.25s): "Murad" (sans) and "Novruzov" (serif, scaled down) fade in over 200ms and hold so the name can be read. Phase 2 (1.25–2.1s): "Murad" exits left (350ms) while "Novruzov" morphs per letter into `novruzoff` — N→n via a scaleY squash with the glyph swapped at the midpoint, the trailing v collapses, the two f's grow in on a 30ms stagger — and travels to its bottom-anchored rest position (750ms). Phase 3 (2.1s): tagline, link bar, and glow settle in (250–300ms); at 2.5s inline transforms are cleared so the layout survives resizes. Every phase is half its original length (the entrance was ~5s); the ratios between them are unchanged. Plays once per session (`sessionStorage`); replays and restored-scroll loads get a 600ms settle instead. The choreography is approved — don't retime it without asking.
   - **Skip on scroll.** Any sign the visitor wants to move down the page — `scroll`, `wheel`, `touchmove` (all passive) or a `keydown` of PageUp/PageDown/Arrow Up/Arrow Down/Home/End/Space — fast-forwards the entrance to its settled end state over 100ms, then runs the normal cleanup. Lenis drives native scroll, so its scrolls arrive as `scroll` events. The resolve freezes the current computed values, settles the DOM, and animates from the frozen values into the settled ones, so an interrupted entrance reads as a fast finish rather than a cut. "Murad" is `position: fixed` while the entrance plays, so it must end on its base `display: none` — out of flow entirely, never a fixed invisible box that could overlap scrolled content. Fires once (flag-guarded), clears pending timers and removes its own listeners; a normally finished entrance removes them too.
   - **Letter clipping.** The trailing v's collapse and the f's reveal clip horizontally only, via `clip-path` animated alongside width: `CLIP_TO_BOX` (`inset(-0.5em 0 -0.5em 0)`, the letter's box) ↔ `CLIP_TO_INK` (`inset(-0.5em -0.2em -0.5em -0.2em)`, room for the italic overhangs). Top/bottom stay open so descenders are never cut, and the f's end fully revealed. The `.hero` itself clips only on x (`overflow-x: clip`), so the handle's descenders and its scroll-out drift can cross the hero's bottom edge.
   - **Gate + failsafe.** Base CSS is the settled end state. Start states only apply under `html.js-hero` (set inline in `Layout.astro`) + `prefers-reduced-motion: no-preference`. The hero script claims the gate by adding `hero-live`; if it hasn't by `DOMContentLoaded` (script failed to load), or it throws, the gate is removed and the static page shows. `will-change` lives in the gated CSS and is cleared per element once its entrance finishes.

2. **Hero background: ambient mesh + cursor glow.** Both live inside `.hero-glow`, which is absolute within the hero, `overflow: hidden` (so nothing bleeds into Experience below) and `pointer-events: none`, with a 180px fade to `--bg-page` at the bottom edge so neither ends in a hard line.
   - **Mesh (CSS only, no JS).** Three radial washes in `.hero-mesh`: `.mesh-a` (`--mesh-amber`, top-left, 22s), `.mesh-b` (`--mesh-light`, top-right, 29s), `.mesh-c` (`--mesh-ember`, low-center under the handle, 36s). Those tokens are written as rgba, not `color-mix()`: the minifier emits a full-opacity fallback for a `color-mix()` it can't resolve, which would turn a 7% wash into a solid amber disc on older browsers. Each is wider than the viewport, so only the soft middle of the gradient shows, never a circle's edge. They drift with `translate3d` + `scale` on `ease-in-out ... infinite alternate` at three different durations, so the composition never visibly loops; transform-only, so they stay on the compositor. Reduced motion holds them at their resting composition (`animation: none`) rather than hiding them.
   - **Cursor glow.** A 910px radial layer (`circle closest-side`, `--accent-glow` → transparent) that follows the cursor with a per-frame lerp (damping 0.08) via `transform: translate3d(...)` only — no repaint. Layer opacity animates to 0.22 on entrance. The rAF loop idles once the glow settles and stays off while the tab is hidden or the hero is out of view (IntersectionObserver). Hidden under `(hover: none)` and reduced motion — it's pointer-driven, so no pointer means no layer; the mesh carries the hero on touch.
   - **Alpha budget.** Amber over `--bg-page` may not exceed ~0.168 alpha or 11px tertiary text drops below 4.5:1. The mesh is budgeted to ~0.10 combined at its brightest overlap and the cursor glow adds 0.048 (0.22 × 0.22), leaving headroom. Raising any of those alphas means re-checking the hero tagline and link bar.
   - No `filter: blur()` on any of it; the gradients themselves are the soft form.

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
- Content column: `.wrap`, `max-width: 828px` including `clamp(20px, 4vw, 40px)` side padding (748px of content at desktop). Shared by `<main>`, the site nav, and the footer meta row, so they align. The hero is deliberately full-bleed and doesn't use it.
- Project list: three-column grid (144px date | 1fr content | 88px link affordance). Multiple links stack in the affordance column.
- Experience list: a vertical timeline (`<ol class="timeline">` of `.xp-node` items, most recent first). Each node is a 28px gutter (20px under 480px) holding a 9px dot, then the same two columns as before: `minmax(0, 1fr)` role over company | `auto` metadata, where the metadata column hugs its content and stacks the date over the location, both mono, tertiary and right-aligned. `align-items: baseline` puts the date's baseline on the role's. The dot is filled `--accent` when the role's `dates` contain "present" (`data-current`), otherwise a hollow 1px `--text-tertiary` ring on a `--bg-page` fill so the line doesn't show through it. The 0.5px `--border` connector is drawn per node and trimmed to the dot on the first and last, so the line starts and ends on a node rather than dangling. Same structure at every width — no per-row or per-breakpoint variation.
- The 144px date column (`--date-col` on `.rows`) belongs to the project list; experience nodes carry their date on the right instead, so the two lists no longer share a left date edge. It fits the longest date ("September 2025 — now", 20 chars = 136px in SF Mono at 11px) on one line. Re-check it if a longer date lands.
- Generous side padding on mobile; tighter on desktop for density.

## Information architecture

Single page (`/`). Sections stacked vertically with thin dividers:

1. **Hero** — name-morph entrance, two-line tagline top-left, link bar with the location in mono ("Montréal, Canada"), massive `novruzoff` handle at the bottom. Cursor-reactive amber glow behind, clipped to the hero. No portrait (deferred). The hero's link bar is the only nav while the hero is on screen.
2. **Site nav** (`src/components/SiteNav.astro`) — `Murad Novruzov` on the left (sans 14px/500, links to `#top` through Lenis, no decorative mark); "Experience · Work · About · Contact" on the right (sans 13px, secondary, anchors to `#experience` / `#work` / `#about` / `#contact`, matching the page order). It sits in the DOM right after the hero with `position: sticky; top: 0` (52px tall, negative bottom margin so it overlays `<main>` instead of pushing it), aligned to the `.wrap` column, over a 72% `--bg-page` + `backdrop-filter: blur(12px)` backdrop with a 0.5px `--border-subtle` hairline. Hidden while any of the hero is in view (IntersectionObserver on the hero, not a scroll listener); enters with `translateY(-8px) → 0` + fade over 300ms ease-out-expo, exits in 200ms. Hidden state uses `visibility: hidden` (flipped only after the exit fade), so its links leave the tab order and the accessibility tree. Reduced motion: appears/disappears without animating. Gated by `html.js-nav` / `nav-live` like the hero, so no-JS or a failed script leaves it visible. Phones: the dots drop out under 480px, "Experience" under 400px, so it stays on one line.
3. **Experience** — section header, one timeline node per role in `experience.ts`, most recent first. Comes before Selected work: the roles lead. Nodes reveal on scroll with the standard 70ms stagger.
4. **Selected work** — section header with count, one row per project in `projects.ts`. Each row animates in on scroll.
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
- Web font: the single Cormorant subset, ~2.2 KB, preloaded.
- Social/meta: `public/og.png` (1200×630, ~24 KB) is the OG + Twitter `summary_large_image` card; `public/apple-touch-icon.png` (180×180) is the amber italic "n". Both are rasterized from vector outlines of the Cormorant subset (plus the system SF for the small line on the card), so they match the site's type exactly. Regenerate them if the handle or tagline changes. `robots.txt` points at `/sitemap-index.xml` (generated by `@astrojs/sitemap`).
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