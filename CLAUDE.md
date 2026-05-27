# novruzoff.dev

Personal portfolio for Murad Novruzov. CS student at McGill, CTO at True Competency, based in Montreal.

## Stack

- Astro 5 (static site generation)
- TypeScript strict mode
- Tailwind CSS v4 (via Vite plugin)
- React 19 (interactive islands only)
- MDX (for any rich content)
- Deployed on Vercel
- Domain: novruzoff.dev

## Design direction

Product-forward, dense, interactive. Anchored on the Rauno Freiberg / Mariana Castilho / Linear neighborhood. **Not** editorial, not minimal-text-on-white.

### Color system

Dark-only. Warm dark, not pure black.

```
--bg-page:       #0a0a0a   /* page background */
--bg-elevated:   #141414   /* cards, surfaces */
--bg-hover:      #1a1a1a   /* hover state */

--border-subtle: rgba(255, 255, 255, 0.06)
--border:        rgba(255, 255, 255, 0.10)
--border-strong: rgba(255, 255, 255, 0.15)

--text-primary:   rgba(255, 255, 255, 0.95)
--text-secondary: rgba(255, 255, 255, 0.55)
--text-tertiary:  rgba(255, 255, 255, 0.35)

--accent:         #F59E0B   /* amber base */
--accent-light:   #FBBF54   /* text on dark */
--accent-bg:      rgba(245, 158, 11, 0.10)   /* badge fills */
--accent-border:  rgba(245, 158, 11, 0.25)
```

Wire these as CSS custom properties in `global.css`, exposed to Tailwind v4 via `@theme` directive.

### Accent discipline

Amber is rare on purpose. Use only for:
- Interactive elements (links, buttons, hover states)
- Emphasized text (project names in the hero, contact email)
- The 6px nav dot (recurring brand mark)

Never use amber for:
- Body text
- Decorative shapes
- Full backgrounds
- Multiple elements on the same row

### Typography

Use the system stack. No web fonts.

```
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
```

Pair sans (default body, headings) with mono (dates, metadata, labels, codes). Mono is what gives the site its design-engineering character.

Hierarchy:
- Hero statement: 26-32px, weight 500, line-height 1.3
- Section headers: 13px, weight 500, mono, often paired with a count or label
- Body: 14-15px, weight 400, line-height 1.6
- Metadata (dates, role, tertiary): 11-12px, mono, color tertiary

Sentence case everywhere. Never Title Case, never ALL CAPS.

### Layout

- Density over whitespace. Fill the screen with intent.
- 0.5px borders, never 1px+
- Background layering creates hierarchy, not heavy borders
- Generous side padding on mobile, tighter on desktop (counter-intuitive but correct for dense layouts)
- Project list = three-column grid: `100px date | 1fr content | 80px link`

## Information architecture

Single page. Sections stacked vertically with thin dividers:

1. **Top nav** — name (with amber dot), simple links: work, writing (placeholder), about
2. **Hero** — small metadata line, statement (~2 sentences), context line with 2 amber-underlined emphases
3. **Selected work** — section header with count, 4 project rows
4. **Experience** — section header, 3-4 role rows
5. **Footer** — copyright, email (amber), github, linkedin

No separate pages yet. Everything on `/`. Case study pages may come later under `/work/[slug]`.

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

Content lives in TypeScript files under `src/data/` for now: `projects.ts`, `experience.ts`. MDX comes later when there's something rich to write.

## Voice

When writing copy in this codebase:
- First person, low ceremony
- Specific over abstract
- Numbers when they exist, prose when they don't
- Never marketing voice (no "passionate", no "leveraging", no "synergy")
- Never humble-brag; just state facts

Example of right voice:
> Built a competency-tracking platform for interventional cardiology training as the sole engineer. Live with paying institutional client (APSC, Hong Kong).

Example of wrong voice:
> Passionate about leveraging modern web technologies to revolutionize healthcare education.

## Code conventions

- TypeScript strict. No `any` without a comment explaining why.
- Astro components for static structure. React only when interactivity is needed.
- Prefer `class:list` (Astro) and `clsx` (React) over template literals for conditional classes.
- File naming: kebab-case for files, PascalCase for components.
- Import order: external libs → Astro/React → local components → utils → types → styles.
- Co-locate component CSS in `<style>` blocks for Astro components when scoped styles are needed. Use Tailwind utilities for the common case.
- Never use `position: fixed` unless absolutely necessary; prefer sticky.
- No `localStorage`/`sessionStorage` in artifacts/islands without a clear reason.

## Animation

Restraint. Motion only earns its place when it:
- Provides feedback for interaction (hover, click, focus)
- Indicates state change (page transition, disclosure)
- Reveals hierarchy (subtle stagger on first load)

Defaults:
- Duration: 150-250ms for micro-interactions, 300-400ms for transitions
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo, the Linear/Vercel default) for entering, `cubic-bezier(0.4, 0, 1, 1)` for exiting
- Never use CSS `ease-in` for UI feedback — it feels sluggish
- Respect `prefers-reduced-motion: reduce` — disable all non-essential motion

The signature interaction (TBD) gets its own treatment. Everything else stays subtle.

## Performance budgets

- Total JS shipped: <30 KB (Astro static + 1-2 small React islands)
- LCP: <1.5s on 4G
- Lighthouse: 100/100/100/100 on all four metrics; non-negotiable
- No web fonts (system stack), no large images without `loading="lazy"` and WebP

## Out of scope (don't build these without asking)

- Light mode
- Blog/MDX content (placeholder route only for now)
- Case study sub-pages
- Command menu (⌘K)
- Custom cursor
- Page transitions / View Transitions API
- Contact form (use a `mailto:` link)
- Analytics beyond Vercel Speed Insights

These may come later, in this order. Don't preemptively scaffold them.

## References

The portfolio should feel at home in this neighborhood. Reference, don't copy:
- rauno.me (density, monospace metadata, restraint)
- mariana.computer (cards, hover treatments)
- linear.app (dark warmth, accent discipline)
- emilkowal.ski/sonner demo pages (component motion done right)
- fey.com (financial app, but the dark+mono+data aesthetic is on-brief)

## Skills available

This project has design-engineering skills installed for AI agents working in it:
- emil-design-eng (motion, interaction philosophy)
- design-taste-frontend (anti-slop frontend generation)
- web-design-guidelines (Vercel Labs UI audit checklist)
- make-interfaces-feel-better (Jakub Krehel, optical polish)

When implementing UI, audit against these explicitly: invoke their principles by name in your reasoning (easing, frequency, optical alignment, anti-slop pre-flight check).