// /resume content beyond experience.ts. Source of truth: Murad's CV.
// Technology names keep their own casing (CLAUDE.md, Case).

export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    label: "languages",
    items: ["TypeScript/JavaScript", "Python", "Java", "Swift", "C", "SQL", "Bash"],
  },
  {
    label: "frameworks",
    items: [
      "Next.js",
      "React",
      "SwiftUI",
      "Node.js",
      "Express",
      "Payload CMS",
      "Tailwind CSS",
      "Vitest",
      "Playwright",
    ],
  },
  {
    label: "infrastructure & security",
    items: [
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "Docker",
      "AWS S3",
      "Vercel",
      "Git",
      "CI/CD",
      "Unix",
      "RLS",
      "JWT",
      "OAuth 2.0",
      "Sentry",
    ],
  },
];

export const education = {
  degree: "BSc computer science",
  school: "McGill university",
  dates: "expected may 2027",
};

// Site-relative path to a PDF résumé (e.g. "/murad-novruzov-resume.pdf" in
// public/). /resume shows a download link only when this is set. There is
// no PDF yet; don't point this at a file that doesn't exist.
export const RESUME_PDF_URL: string | undefined = undefined;
