import type { HeaderLink } from "../components/Header.astro";

// Penknife's App Store listing. One source for the badge on /penknife, the
// Smart App Banner on the three Penknife pages, and the projects list.
export const PENKNIFE_APP_ID = "6828233319";
export const PENKNIFE_APP_STORE_URL = `https://apps.apple.com/app/id${PENKNIFE_APP_ID}`;

// The header links on the three Penknife pages. These URLs are in App Store
// Connect (Privacy Policy URL and Support URL), so don't change them.
export const PENKNIFE_NAV: HeaderLink[] = [
  { label: "penknife", href: "/penknife" },
  { label: "privacy", href: "/penknife/privacy" },
  { label: "support", href: "/penknife/support" },
];
