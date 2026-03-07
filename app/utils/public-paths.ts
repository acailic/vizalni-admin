import { BASE_PATH, PUBLIC_URL } from "@/domain/env";

const normalizePath = (path: string) => {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
};

export const isStaticExportMode = Boolean(BASE_PATH);

export const buildPublicPath = (path: string) => {
  const normalizedPath = normalizePath(path);
  if (!PUBLIC_URL) {
    return normalizedPath;
  }

  return `${PUBLIC_URL}${normalizedPath}`;
};

export const buildAbsolutePublicUrl = (origin: string, path: string) => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${origin}${buildPublicPath(path)}`;
};

export const getDatasetBrowserPath = () =>
  isStaticExportMode ? "/demos/showcase" : "/browse";
