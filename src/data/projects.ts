import { PENKNIFE_APP_STORE_URL } from "./penknife";

/** A headline number, shown as a scannable value + label pair. */
export type Metric = {
  value: string; // "99.9%", "54→92"
  label: string; // "uptime", "Lighthouse SEO"
};

export type Project = {
  /** Also the element id on /projects, so /projects#<slug> deep-links. */
  slug: string;
  title: string;
  dates: string;
  /** A recognition (e.g. a hackathon placing), shown as metadata under the title. */
  award?: string;
  /** The card's one-liner: what it is, in a few words. */
  blurb: string;
  /** Strongest first: the card shows the first three, the rest sit in its details fold. */
  metrics?: Metric[];
  /** The detail, one fact per bullet. Shown inside the card's details fold. */
  highlights?: string[];
  /** Main technologies first: the card shows the first `stackOnCard`, the rest sit in the fold. */
  stack?: string[];
  /** How many stack items the card face shows (default 4). */
  stackOnCard?: number;
  liveUrl?: string;
  appStoreUrl?: string;
  repoUrl?: string;
  caseStudyUrl?: string;
};

// Source of truth: Murad's CV. Don't add facts that aren't on it.
//
// Copy is lowercase (CLAUDE.md, Case): names, places and organizations are
// lowercase; acronyms (APSC, RLS, SSMU…), McGill, and third-party product
// and technology names (Next.js, WordPress, Lighthouse, App Intents…) keep
// their own casing.
//
// Links are only listed when they resolve publicly. MyMeetings' repo is
// private (github.com/novruzoff/MyMeetings returns 404), so it ships
// without one rather than with a 404.
//
// Order is deliberate (most significant first), not by date. Within each
// project, metrics and stack are ordered strongest / most central first,
// because the /projects card shows only the first few (see ProjectCard.astro).
export const projects: Project[] = [
  {
    slug: "true-competency",
    title: "true competency",
    dates: "sep 2025 — present",
    blurb:
      "cardiology training platform, built solo",
    metrics: [
      { value: "99.9%", label: "uptime" },
      { value: "five-figure", label: "APSC contract" },
      { value: "50", label: "clinician profiles" },
      { value: "300", label: "assessment questions" },
    ],
    highlights: [
      "role-based dashboards for trainees, instructors and committees, with authorization at the database layer via PostgreSQL RLS.",
      "staged content workflow: expert-consensus (Delphi) voting and an approval lifecycle drive the MCQ pipeline.",
      "multi-modality architecture: IVUS module shipped, OCT in development, native iOS/Android in scoping.",
      "full production delivery: Vercel, Sentry, Resend and a Tailwind design system.",
      "five-figure institutional contract with APSC (hong kong), with additional medical societies in negotiation. backed by vitruvius venture studio.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase (PostgreSQL + RLS)",
      "Vercel",
      "Tailwind",
      "Sentry",
      "Resend",
    ],
    liveUrl: "https://truecompetency.com",
  },
  {
    slug: "mindvista",
    title: "mindvista",
    dates: "nov 2024 — present",
    blurb: "McGill wellness platform, rebuilt off WordPress",
    metrics: [
      { value: "−97%", label: "infrastructure cost" },
      { value: "54→92", label: "Lighthouse SEO" },
      { value: "7.9s→3.2s", label: "LCP" },
      { value: "4.9s→1.6s", label: "speed index" },
    ],
    highlights: [
      "lead a 3-person team.",
      "migrated the platform off legacy WordPress.",
    ],
    stack: [
      "Next.js",
      "Payload CMS",
      "Neon (PostgreSQL)",
      "AWS S3",
      "Tailwind",
      "Docker",
      "Vercel",
    ],
    liveUrl: "https://mindvista.ca",
    repoUrl: "https://github.com/MindVista/website",
  },
  {
    slug: "penknife",
    title: "penknife",
    dates: "2026",
    blurb:
      "native iOS toolkit, 10 on-device tools",
    metrics: [
      { value: "10", label: "on-device tools" },
      { value: "12", label: "App Intents actions" },
      { value: "180+", label: "unit/UI tests" },
    ],
    highlights: [
      "structured as a local Swift package: a UI-free core and one module per tool behind a shared registry.",
      "every tool exposed through App Intents (12 actions, 10 shortcuts) and a share extension kept under its 120 MB memory limit.",
      "all processing on-device with no third-party dependencies. network tools block local-network targets (incl. NAT64/6to4). adaptive iPhone layouts.",
      "keeps a “Data Not Collected” App Store privacy label.",
      "180+ unit/UI tests (Swift Testing, XCTest) under Swift 6 strict concurrency.",
    ],
    stack: ["Swift 6", "SwiftUI", "App Intents", "Swift Testing", "XCTest"],
    stackOnCard: 3,
    liveUrl: "/penknife",
    appStoreUrl: PENKNIFE_APP_STORE_URL,
  },
  {
    slug: "brim-ap-automation",
    title: "brim AP automation",
    dates: "2026",
    award: "codejam 16 honourable mention (brim fintech challenge, McGill ECSESS)",
    blurb:
      "accounts-payable platform, led a 4-person team",
    metrics: [
      { value: "$16.8k", label: "duplicate payments found" },
      { value: "426", label: "invoices replayed" },
      { value: "1,800+", label: "tests" },
      { value: "4", label: "person team" },
    ],
    highlights: [
      "led a 4-person team.",
      "replaying 426 past invoices found $16.8k paid twice.",
      "owned the data layer: an Alembic-versioned SQLAlchemy schema and a hash-chained audit log that detects any edit, insertion, or deletion.",
      "built most of the React/TypeScript UI.",
      "team test suite of 1,800+ tests.",
    ],
    stack: ["Python", "FastAPI", "React", "Claude API", "SQLAlchemy", "Alembic", "TypeScript"],
    // No link yet: the brief's link was still a placeholder.
  },
  {
    slug: "ssmu-websites",
    title: "SSMU websites",
    dates: "jul 2025 — may 2026",
    blurb: "club websites for McGill's student society",
    metrics: [
      { value: "20", label: "sites built" },
      { value: "250+", label: "sites maintained" },
    ],
    highlights: [
      "built 20 production websites from scratch for McGill student clubs: custom branding, responsive, live under clubname.ssmu.ca on SSMU's servers.",
      "maintained 250+ websites across the org.",
      "worked with SSMU's sysadmin on DNS, release pipelines and infrastructure.",
    ],
  },
  {
    slug: "openrobotics",
    title: "openrobotics",
    dates: "jan 2026 — may 2026",
    blurb: "JavaFX warehouse robot simulator",
    metrics: [
      { value: "1,800", label: "line CSS split" },
      { value: "10x", label: "playback" },
      { value: "8", label: "person team" },
      { value: "10", label: "stylesheets" },
    ],
    highlights: [
      "built the entire frontend of the simulator.",
      "split a 1,800-line theme.css into 10 base and per-screen stylesheets, moving inline FXML styles into reusable classes.",
      "built editor features: drag, copy/paste and undo/redo for intersections, JSON results export, 10x playback.",
    ],
    stack: ["Java 21", "JavaFX", "FXML", "CSS", "Maven", "Jackson", "PostgreSQL", "Supabase"],
    repoUrl: "https://github.com/novruzoff/OpenRobotics",
  },
  {
    slug: "mymeetings",
    title: "mymeetings",
    dates: "mar 2026 — may 2026",
    blurb: "office-hours booking platform, McGill SCS competition",
    highlights: [
      "JWT auth in httpOnly cookies, McGill-domain validation and RBAC.",
      "recurring slots, group polls, and iCal export reconciling legacy and interval schemas.",
    ],
    stack: ["React", "Express 5", "Node.js", "MongoDB", "Vite", "Tailwind"],
  },
];
