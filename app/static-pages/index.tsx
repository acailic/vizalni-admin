import dynamic from "next/dynamic";

const pages = [
  { path: "/sr/index", locale: "sr-Latn" },

  { path: "/en/index", locale: "en" },
  { path: "/en/imprint", locale: "en" },
  { path: "/en/legal-framework", locale: "en" },
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
