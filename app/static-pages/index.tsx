import dynamic from "next/dynamic";

const pages = [
  { path: "/sr/index", locale: "sr-Latn" },
  { path: "/sr-Cyrl/index", locale: "sr-Cyrl" },

  { path: "/en/index", locale: "en" },
  { path: "/en/imprint", locale: "en" },
  { path: "/en/legal-framework", locale: "en" },

  { path: "/sr-Cyrl/imprint", locale: "sr-Cyrl" },
  { path: "/sr-Cyrl/legal-framework", locale: "sr-Cyrl" },
];

export const staticPages = Object.fromEntries(
  pages.map(({ path, locale }) => {
    return [
      path,
      {
        locale,
        component: dynamic(() => import(`.${path}.mdx`)),
      },
    ];
  })
);
