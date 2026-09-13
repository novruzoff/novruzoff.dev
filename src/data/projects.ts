export type Project = {
  slug: string;
  title: string;
  dates: string;
  blurb: string;
  liveUrl?: string;
  repoUrl?: string;
  caseStudyUrl?: string;
};

// Links are only listed when they resolve publicly. MyMeetings has no public
// repo, so it ships without one rather than with a 404.
export const projects: Project[] = [
  {
    slug: "true-competency",
    title: "True Competency",
    dates: "2025 — now",
    blurb:
      "Production competency-tracking platform for interventional cardiology training. Sole developer. 50 clinician profiles, a 300-question assessment bank, 99.9% uptime, and database-level RLS with a Delphi voting and approval workflow. Five-figure institutional contract with APSC (Hong Kong), backed by Vitruvius Venture Studio.",
    liveUrl: "https://truecompetency.com",
  },
  {
    slug: "mindvista",
    title: "MindVista",
    dates: "2024 — now",
    blurb:
      "Student wellness platform for McGill, rebuilt off legacy WordPress. I lead a 3-person team. Lighthouse SEO 54→92, LCP 7.9s→3.2s, infrastructure cost down 97%.",
    liveUrl: "https://mindvista.ca",
    repoUrl: "https://github.com/MindVista/website",
  },
  {
    slug: "ssmu-websites",
    title: "SSMU websites",
    dates: "2025 — 2026",
    blurb:
      "Built 20 production websites from scratch for McGill student clubs and maintained 250+ across the org, working with SSMU's sysadmin on DNS, release pipelines, and infrastructure.",
  },
  {
    slug: "mymeetings",
    title: "MyMeetings",
    dates: "2025",
    blurb:
      "Office-hours and meeting booking platform for the McGill SCS competition. JWT auth in httpOnly cookies, McGill-domain validation, RBAC, recurring slots, group polls, and iCal export reconciling legacy and interval schemas.",
  },
  {
    slug: "openrobotics",
    title: "OpenRobotics",
    dates: "2026",
    blurb:
      "Multi-robot warehouse simulation built with a 7-person Agile team. Owned the entire JavaFX frontend: four screens, five dialogs, and a token-based CSS architecture that eliminated inline styles.",
    repoUrl: "https://github.com/novruzoff/OpenRobotics",
  },
];
