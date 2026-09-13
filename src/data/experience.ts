export type Experience = {
  role: string;
  company: string;
  dates: string;
  location?: string;
};

export const experience: Experience[] = [
  {
    role: "CTO · Software engineer",
    company: "True Competency",
    dates: "2024 — now",
    location: "Montreal / remote",
  },
  {
    role: "Engineering lead",
    company: "MindVista",
    dates: "2024 — now",
    location: "Montreal",
  },
  {
    role: "Software developer",
    company: "SSMU",
    dates: "2024",
    location: "McGill University",
  },
  {
    role: "Research assistant",
    company: "ARB",
    dates: "2023 — 2024",
    location: "McGill University",
  },
];
