// /resume content beyond experience.ts. Source of truth: Murad's CV.
// Technology names keep their own casing (CLAUDE.md, Case).

export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    label: "languages",
    items: ["TypeScript/JavaScript", "Python", "Swift", "Java", "SQL", "C"],
  },
  {
    label: "frameworks & testing",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "FastAPI",
      "Tailwind CSS",
      "SwiftUI",
      "Vitest",
      "Playwright",
      "pytest",
    ],
  },
  {
    label: "data & devops",
    items: [
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "Docker",
      "AWS (S3)",
      "Vercel",
      "GitHub Actions (CI/CD)",
      "Git",
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
