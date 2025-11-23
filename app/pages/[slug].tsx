import { GetStaticPaths, GetStaticProps } from "next";

import { ContentMDXProvider } from "@/components/content-mdx-provider";
import localesConfig from "@/locales/locales.json";
import { staticPages } from "@/static-pages";

const { defaultLocale } = localesConfig;

/**
 * TODO: this page can be combined with index.tsx into [[...slug]].tsx,
 * once these issues are resolved:
 *
 * - https://github.com/vercel/next.js/issues/19934
 * - https://github.com/vercel/next.js/issues/19950
 *
 */

interface ContentPageProps {
  staticPage: string;
}

export default function ContentPage({ staticPage }: ContentPageProps) {
  const Component = staticPages[staticPage]?.component;

  return (
    <ContentMDXProvider>
      {Component ? <Component /> : "NOT FOUND"}
    </ContentMDXProvider>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
  const paths = Object.keys(staticPages)
    .filter((path) => !path.endsWith("/index"))
    .filter((path) => {
      if (!isGitHubPages) {
        return true;
      }
      // For GitHub Pages (static export), we only generate pages for the default locale
      // because i18n routing is disabled.
      const [, locale] = path.split("/");
      return locale === defaultLocale;
    })
    .map((path) => {
      const [, locale, slug] = path.split("/");
      // When i18n is disabled (GitHub Pages), don't include locale in paths
      if (isGitHubPages) {
        return {
          params: { slug },
        };
      }
      return {
        params: { slug },
        locale,
      };
    });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ContentPageProps> = async ({
  params,
  locale,
}) => {
  // In static export (GitHub Pages), locale is undefined because i18n is disabled.
  // We fallback to defaultLocale.
  const effectiveLocale = locale || defaultLocale;
  const path = `/${effectiveLocale}/${params!.slug as string}`;

  // FIXME: this check should not be needed when fallback: false can be used
  const pageExists = !!staticPages[path];

  if (!pageExists) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      staticPage: path,
    },
  };
};
