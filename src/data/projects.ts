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
  /** One sentence: what it is. */
  blurb: string;
  metrics?: Metric[];
  /** The detail, one fact per bullet. Shown on /projects. */
  highlights?: string[];
  stack?: string[];
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
// Order is deliberate (most significant first), not by date.
export const projects: Project[] = [
  {
    slug: "true-competency",
    title: "true competency",
    dates: "sep 2025 — present",
    blurb:
      "production competency-tracking platform for interventional cardiology training, built solo.",
    metrics: [
      { value: "50", label: "clinician profiles" },
      { value: "300", label: "assessment questions" },
      { value: "99.9%", label: "uptime" },
      { value: "five-figure", label: "APSC contract" },
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
      "Tailwind",
      "Vercel",
      "Sentry",
      "Resend",
    ],
    liveUrl: "https://truecompetency.com",
  },
  {
    slug: "mindvista",
    title: "mindvista",
    dates: "nov 2024 — present",
    blurb: "student wellness platform for McGill, migrated off legacy WordPress.",
    metrics: [
      { value: "54→92", label: "Lighthouse SEO" },
      { value: "7.9s→3.2s", label: "LCP" },
      { value: "4.9s→1.6s", label: "speed index" },
      { value: "−97%", label: "infrastructure cost" },
    ],
    highlights: [
      "lead a 3-person team.",
      "migrated the platform off legacy WordPress.",
    ],
    stack: [
      "Next.js",
      "Payload CMS",
      "Tailwind",
      "Neon (PostgreSQL)",
      "AWS S3",
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
      "free, privacy-first native iOS utility toolkit: 10 on-device tools in Swift 6 / SwiftUI for iOS 26+.",
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
    liveUrl: "/penknife",
    appStoreUrl: PENKNIFE_APP_STORE_URL,
  },
  {
    slug: "brim-ap-automation",
    title: "brim AP automation",
    dates: "2026",
    award: "codejam 16 honourable mention (brim fintech challenge, McGill ECSESS)",
    blurb:
      "accounts-payable platform that takes invoices from email or PDF through LLM extraction, fraud/tax controls, approvals, and simulated payment.",
    metrics: [
      { value: "426", label: "invoices replayed" },
      { value: "$16.8k", label: "duplicate payments found" },
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
    stack: ["Python", "FastAPI", "SQLAlchemy", "Alembic", "React", "TypeScript", "Claude API"],
    // No link yet: the brief's link was still a placeholder.
  },
  {
    slug: "ssmu-websites",
    title: "SSMU websites",
    dates: "jul 2025 — may 2026",
    blurb: "production websites for McGill student clubs, on SSMU's servers.",
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
    blurb: "JavaFX multi-robot warehouse simulator (RTA*, bug, greedy), built in an 8-person team.",
    metrics: [
      { value: "8", label: "person team" },
      { value: "1,800", label: "line CSS split" },
      { value: "10", label: "stylesheets" },
      { value: "10x", label: "playback" },
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
    blurb: "office-hours and meeting booking platform for the McGill SCS competition.",
    highlights: [
      "JWT auth in httpOnly cookies, McGill-domain validation and RBAC.",
      "recurring slots, group polls, and iCal export reconciling legacy and interval schemas.",
    ],
    stack: ["React", "Vite", "Tailwind", "Express 5", "Node.js", "MongoDB"],
  },
];
