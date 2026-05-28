export type Project = {
  slug: string;
  title: string;
  dates: string;
  blurb: string;
  liveUrl?: string;
  repoUrl?: string;
  caseStudyUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "true-competency",
    title: "True Competency",
    dates: "2024 — now",
    blurb:
      "Competency-tracking platform for interventional cardiology training. Sole engineer, live with a paying institutional client.",
    liveUrl: "https://truecompetency.com",
  },
  {
    slug: "mindvista",
    title: "MindVista",
    dates: "2024 — now",
    blurb:
      "Mental health resource directory for McGill students. Search, filter, and triage across 200+ campus and city services.",
    liveUrl: "https://mindvista.ca",
  },
  {
    slug: "ssmu",
    title: "SSMU internal tooling",
    dates: "2024",
    blurb:
      "Internal dashboards and member-services tooling for the Students' Society of McGill University.",
  },
  {
    slug: "mymeetings",
    title: "MyMeetings",
    dates: "2023",
    blurb:
      "Calendar-aware meeting summarizer that drafts pre-reads and follow-ups from your week.",
    repoUrl: "https://github.com/novruzoff/mymeetings",
  },
];
