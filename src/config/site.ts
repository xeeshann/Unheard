export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Unheard",
  description: "Where average voices echo loudest.",
  url: "https://unheardd.netlify.app",
  ogImage: "https://unheardd.netlify.app/unheard-social-preview.jpg",
  metaTags: {
    keywords: "confessions, anonymous sharing, community, social platform, anonymous stories, personal experiences",
    author: "Unheard Team",
    themeColor: "#4f46e5",
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Support",
      href: "/support",
    },
    {
      label: "Guidelines",
      href: "/guidelines",
    }
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Support",
      href: "/support",
    },
    {
      label: "Guidelines",
      href: "/guidelines",
    },
    {
      label: "Privacy Policy",
      href: "/privacy",
    },
    {
      label: "Terms of Use",
      href: "/terms",
    }
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/unheard_app",
    support: "mailto:support@unheardd.netlify.app",
  },
};
