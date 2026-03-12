export type EmbedTheme = "light" | "dark";
export type EmbedLang = "en" | "sr";

interface EmbedUrlOptions {
  theme?: EmbedTheme;
  lang?: EmbedLang;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export function buildEmbedUrl(
  base: string,
  options: EmbedUrlOptions = {}
): string {
  const params = new URLSearchParams();
  const theme = options.theme ?? "light";
  const lang = options.lang ?? "en";

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
  }

  params.set("theme", theme);
  params.set("lang", lang);

  return `${base}?${params.toString()}`;
}
