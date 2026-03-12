// Note: In static export mode (GitHub Pages), these routes won't be pre-rendered.
// The DatasetBrowser component handles routing client-side.

export const getStaticPaths = async () => {
  const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
  return {
    paths: [],
    fallback: isGitHubPages ? false : "blocking",
  };
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

import { DatasetBrowser } from "@/pages/browse";

export default DatasetBrowser;
