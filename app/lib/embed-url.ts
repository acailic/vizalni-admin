export type EmbedTheme = "light" | "dark";
export type EmbedLang = "en" | "sr";

interface EmbedUrlOptions {
  theme?: EmbedTheme;
  lang?: EmbedLang;
}

export function buildEmbedUrl(base: string, options: EmbedUrlOptions = {}): string {
  const params = new URLSearchParams();
  const theme = options.theme ?? "light";
  const lang = options.lang ?? "en";

  params.set("theme", theme);
  params.set("lang", lang);

  return `${base}?${params.toString()}`;
}
