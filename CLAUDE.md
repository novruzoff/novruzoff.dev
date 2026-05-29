# novruzoff.dev

Personal portfolio for Murad Novruzov. CS student at McGill, CTO at True Competency, based in Montreal.

## Stack

- Astro 5 (static site generation, View Transitions enabled)
- TypeScript strict mode
- Tailwind CSS v4 (via Vite plugin)
- React 19 (interactive islands only)
- MDX (for any rich content)
- GSAP + ScrollTrigger (scroll-driven motion)
- Lenis (smooth scroll)
- Deployed on Vercel
- Domain: novruzoff.dev

## Design direction

Creative-developer mode. Dense, interactive, motion-driven — anchored on the Luke Baffait / Apple-product-page / Wise neighborhood, with engineer substance underneath. Motion is a feature, not decoration. The portfolio should *feel alive* and reward exploration.

NOT editorial. NOT minimal text on background. NOT static.

### Color system

Dark-only. Warm dark, not pure black.

```
--bg-page:       #0a0a0a
--bg-elevated:   #141414
--bg-hover:      #1a1a1a

--border-subtle: rgba(255, 255, 255, 0.06)
--border:        rgba(255, 255, 255, 0.10)
--border-strong: rgba(255, 255, 255, 0.15)

--text-primary:   rgba(255, 255, 255, 0.95)
--text-secondary: rgba(255, 255, 255, 0.55)
--text-tertiary:  rgba(255, 255, 255, 0.35)

--accent:         #F59E0B
--accent-light:   #FBBF54
--accent-bg:      rgba(245, 158, 11, 0.10)
--accent-border:  rgba(245, 158, 11, 0.25)
--accent-glow:    rgba(245, 158, 11, 0.18)
```

Wire as CSS custom properties in `global.css`, exposed to Tailwind v4 via `@theme`. Single source of truth, no duplication. Components prefer Tailwind utilities (`text-text-primary`) over inline `style="color: var(...)"`.

### Case (HARD RULE)

All rendered text is in sentence case as written in source.

- NEVER apply `text-transform: lowercase` anywhere.
- NEVER apply `text-transform: uppercase` to body content (acceptable only for short ≤5-char mono labels like tag pills, used sparingly).
- Section headers: "Selected Work", "Experience", "Writing".
- Nav links: "Work", "Writing", "About".
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

System stack. No web fonts.

```
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
```

Sans owns prose, hero, and headings. Mono is reserved for metadata, dates, technical labels, and code. Mono gives design-engineer character through *contrast*, not volume.

Hierarchy:
- **Hero handle (`novruzoff`):** display size (clamp 80px → 160px responsive), sans, weight 600-700, tight tracking (−0.04em), line-height 0.95.
- **Hero statement:** 22-32px, weight 400-500, line-height 1.35.
- **Section headers:** 14-16px, sans, weight 500, sentence case ("Selected Work").
- **Nav (left, the name):** 14-15px, sans, weight 500, sentence case ("Murad Novruzov").
- **Nav (right, links):** 13-14px, sans, weight 400-500, sentence case ("Work", "About").
- **Body:** 14-15px, sans, weight 400, line-height 1.6.
- **Metadata (dates, tertiary labels):** 11-12px, mono, color tertiary, `font-variant-numeric: tabular-nums`.

### Motion system (creative-developer mode)

Motion is a feature, not an afterthought. Four signature behaviors:

1. **Hero portrait blur-to-sharp on scroll.** Portrait starts at `filter: blur(48px)` and `scale(1.04)`. As user scrolls past hero (range: 0 to ~80% of viewport height), blur scrubs to `blur(0)` and scale to `scale(1)`. Scroll-linked via GSAP ScrollTrigger with `scrub: true`. Never load-linked.

2. **Cursor-reactive amber gradient.** Large soft radial gradient (~600-800px radius) follows the cursor with eased spring lag (not instant). Lives behind the hero on a fixed/absolute layer with `pointer-events: none`. Low opacity (~0.15-0.25), uses `--accent-glow`. Hidden on touch devices via `@media (hover: none)` and when `prefers-reduced-motion: reduce`. GPU-only via `transform: translate3d(...)`. No `filter: blur()` on the moving element (expensive); the gradient itself is the soft form.

3. **Scroll-driven section reveals.** Sections *transform* into place as they enter the viewport — not just fade. Each section earns the screen with motion: stagger child elements with translateY + opacity, mask/clip reveal on headings, scale-up on cards. Use ScrollTrigger with fire-once for entrance moments, or `scrub: 1` for tied motion. Each section does *something* on arrival.

4. **Page transitions.** Astro's built-in View Transitions via `<ClientRouter />` in Layout. Subtle cross-fade on navigation. Light-touch since there's only one route initially.

#### Motion principles (from emil-design-eng)

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for entrances. Linear for scrubbed scroll. NEVER `ease-in` for UI.
- Duration: 400-700ms for entrances. Scroll-linked durations are determined by scroll distance, not time.
- Stagger: 60-100ms between siblings is the sweet spot. >150ms reads as ceremonial.
- ALWAYS respect `prefers-reduced-motion: reduce` — collapse to static end-states.
- `will-change` sparingly, only on actively animating elements. Remove after animation.

### Smooth scroll

Use **Lenis** for smooth scroll. Single React island mounted in `Layout.astro`. Standard config: `duration: 1.2`, `easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (expo-out). Pair with GSAP's `ScrollTrigger.scrollerProxy` so ScrollTrigger animations stay synced to Lenis's virtual scroll position. Wire `ScrollTrigger.update` to Lenis's `scroll` callback.

### Layout

- Density over whitespace, EXCEPT in the hero — the hero gets room to breathe (it's the entrance moment).
- 0.5px borders only. Background layering creates hierarchy.
- Hero composition: massive `novruzoff` handle on the left, portrait on the right (desktop). Statement below the handle. Stack on mobile (handle, statement, portrait, in that order).
- Project list: three-column grid (100px date | 1fr content | 80-100px link affordance).
- Experience list: two-column grid (100px date | role + company).
- Generous side padding on mobile; tighter on desktop for density.

## Information architecture

Single page (`/`). Sections stacked vertically with thin dividers:

1. **Top nav** — `Murad Novruzov` on the left (sans, sentence case, no decorative mark). Nav links on the right in sans: "Work", "Writing", "About".
2. **Hero** — small mono metadata line (location, status), massive `novruzoff` handle, 1-2 sentence statement, context line with up to 2 amber-emphasized phrases. Portrait beside the text (desktop). Cursor-reactive amber gradient behind everything.
3. **Selected Work** — section header with count, 4 project rows. Each row animates in on scroll.
4. **Experience** — section header, 3-4 role rows.
5. **Footer** — copyright, email (amber), github, linkedin.

No separate pages yet. Case study pages may come later under `/work/[slug]`.

## Content schema

### Project
```ts
{
  slug: string
  title: string
  dates: string         // "2024 — now", "2025", "2024"
  blurb: string         // ~80-120 chars, one line
  liveUrl?: string
  repoUrl?: string
  caseStudyUrl?: string // for future tier-1 case studies
}
```

### Experience
```ts
{
  role: string          // "CTO · Software Engineer"
  company: string       // "True Competency"
  dates: string
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
- GSAP code lives in React islands, not Astro components.

## Performance budgets (creative-developer mode)

- Total JS shipped: ≤ 60 KB gzipped. Approximate breakdown: Lenis ~6 KB, GSAP + ScrollTrigger ~30 KB, React island shell ~12 KB, headroom ~12 KB.
- Lighthouse performance: ≥ 92 mobile, ≥ 96 desktop.
- LCP: ≤ 2.0s on 4G.
- Accessibility, Best Practices, SEO: 100 each, non-negotiable.
- Hero portrait: optimized AVIF/WebP, max 200 KB, `loading="eager"`, `fetchpriority="high"`, explicit `width`/`height` to prevent CLS.

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