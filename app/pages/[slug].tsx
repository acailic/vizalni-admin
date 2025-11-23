import { GetStaticPaths, GetStaticProps } from "next";

import { ContentMDXProvider } from "@/components/content-mdx-provider";
import localesConfig from "@/locales/locales.json";
import { staticPages } from "@/static-pages";

const { defaultLocale, locales } = localesConfig;

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
  const reservedSlugs = new Set(["tutorials"]);
  const paths = Object.keys(staticPages)
    .filter((path) => !path.endsWith("/index"))
    .map((path) => {
      const [, rawLocale, ...slugParts] = path.split("/");
      const normalizedLocale = rawLocale === "sr" ? defaultLocale : rawLocale;
      const slug = slugParts.join("/");

      // Avoid conflicts with dedicated routes (e.g., /tutorials folder)
      if (reservedSlugs.has(slug)) {
        return null;
      }

      if (!normalizedLocale || !locales.includes(normalizedLocale)) {
        return null;
      }

      if (isGitHubPages) {
        // In static export mode we only build the default locale and omit locale
        if (normalizedLocale !== defaultLocale) {
          return null;
        }

        return {
          params: { slug },
        };
      }

      return {
        params: { slug },
        locale: normalizedLocale === defaultLocale ? undefined : normalizedLocale,
      };
    })
    .filter(
      (value): value is { params: { slug: string }; locale?: string } =>
        value !== null
    );

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
  const candidates = [
    `/${effectiveLocale}/${params!.slug as string}`,
    // Legacy Serbian content lives under /sr even though the configured locale is sr-Latn
    `/sr/${params!.slug as string}`,
  ];
  const path = candidates.find((p) => staticPages[p]);

  // FIXME: this check should not be needed when fallback: false can be used
  const pageExists = !!path && !!staticPages[path];

  if (!pageExists) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      staticPage: path!,
    },
  };
};
