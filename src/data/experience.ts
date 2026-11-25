export type Experience = {
  role: string;
  company: string;
  /** "sep 2025 — present". A role whose dates contain "present" is current. */
  dates: string;
  location?: string;
  /** One or two short, high-impact bullets for /resume. The detail lives on /projects. */
  highlights?: string[];
  /** Slug of the matching entry in projects.ts; /resume links to /projects#<slug>. */
  projectSlug?: string;
};

// Source of truth: Murad's CV. Lowercase per CLAUDE.md (acronyms and
// product names keep their casing). Dates: three-letter month, em dash.
// The bullets are deliberately short; don't copy the project detail here.
export const experience: Experience[] = [
  {
    role: "founding developer",
    company: "true competency",
    dates: "sep 2025 — present",
    location: "montreal, canada",
    highlights: [
      "sole developer of a production cardiology-training platform (100 clinician profiles, 99.9% uptime).",
      "five-figure APSC contract; backed by vitruvius venture studio.",
    ],
    projectSlug: "true-competency",
  },
  {
    role: "full stack developer & team lead",
    company: "mindvista",
    dates: "nov 2024 — present",
    location: "montreal, canada",
    highlights: [
      "leading a 3-person team.",
      "migrated off WordPress (Lighthouse SEO 54→92, infrastructure cost −97%).",
    ],
    projectSlug: "mindvista",
  },
  {
    role: "web developer",
    company: "SSMU",
    dates: "jul 2025 — may 2026",
    location: "montreal, canada",
    highlights: ["built 20 club websites and maintained 250+ across the org."],
    projectSlug: "ssmu-websites",
  },
  {
    role: "web development intern",
    company: "ARB (azerbaijan republic broadcaster)",
    dates: "jun 2023 — aug 2023",
    location: "baku, azerbaijan",
    highlights: [
      "resolved 30+ backlogged bugs (~40% fewer user-facing errors).",
      "improved page load by 15%; PageSpeed 61→74.",
    ],
  },
];
