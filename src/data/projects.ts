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
      "Competency-tracking platform for interventional cardiology training. Sole engineer. Live with a paying institutional client (APSC, Hong Kong).",
    liveUrl: "https://truecompetency.com",
  },
  {
    slug: "mindvista",
    title: "MindVista",
    dates: "2024 — now",
    blurb:
      "Student wellness platform for McGill: resource directory, events, and crisis navigation used across campus.",
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
      "Calendar-aware meeting assistant that drafts pre-reads and follow-ups from your week.",
    repoUrl: "https://github.com/novruzoff/mymeetings",
  },
];
