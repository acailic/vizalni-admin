import { GetStaticProps } from "next";
import dynamic from "next/dynamic";

import { ContentMDXProvider } from "@/components/content-mdx-provider";
import { useLocale } from "@/locales/use-locale";
import { staticPages } from "@/static-pages";

interface ContentPageProps {
  staticPage: string;
}

const localeToPath = (locale: string): string => {
  if (locale === "sr-Cyrl") return "/sr-Cyrl/index";
  if (locale.startsWith("sr")) return "/sr/index";
  return "/en/index";
};

function ContentPage({ staticPage }: ContentPageProps) {
  const locale = useLocale();
  const path = localeToPath(locale);
  // Use runtime locale path if available, fall back to SSR-resolved path
  const Component =
    staticPages[path]?.component ?? staticPages[staticPage]?.component;

  return (
    <ContentMDXProvider>
      {Component ? <Component /> : "NOT FOUND"}
    </ContentMDXProvider>
  );
}

export const getStaticProps: GetStaticProps<ContentPageProps> = async ({
  locale,
}) => {
  const normalizedLocale = locale && locale.startsWith("en") ? "en" : "sr";
  const path = normalizedLocale === "sr" ? "/sr/index" : "/en/index";
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

// Dynamic export with SSR disabled to avoid MUI errors during build
export default dynamic(() => Promise.resolve(ContentPage), {
  ssr: false,
});
