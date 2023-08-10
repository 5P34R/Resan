export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Resan",
  description:
    "A solution for college students to analyse their results and get insights about their performance.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Students",
      href: "/students",
    },
    {
      title: "Result Upload",
      href: "/upload",
    },
    {
      title: "Semesters",
      href: "/semester",
    }
  ],
}

