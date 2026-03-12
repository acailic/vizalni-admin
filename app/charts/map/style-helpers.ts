import mapValues from "lodash/mapValues";

import type { StyleSpecification } from "maplibre-gl";

type MapboxStyle = StyleSpecification;
type AnySourceData = any;

type AnyLayer = MapboxStyle["layers"][number];

// Note: These type guards could be made generic for better type safety
type HasUrl<T> = T extends { url?: string | undefined } ? T : never;
function hasUrl(obj: AnySourceData): obj is HasUrl<AnySourceData> {
  return Object.prototype.hasOwnProperty.call(obj, "url");
}

export function hasLayout(obj: AnyLayer): boolean {
  return Object.prototype.hasOwnProperty.call(obj, "layout");
}

const replaceStringTokens = (
  s: string | undefined,
  tokens: Record<string, string>
) => {
  if (!s) {
    return s;
  }
  let cur = s;
  for (const [src, dest] of Object.entries(tokens)) {
    cur = cur.replace(src, dest!);
  }
  return cur;
};

export const replaceStyleTokens = (
  style: MapboxStyle,
  tokens: Record<string, string>
) => {
  return {
    ...style,
    sources: mapValues(style.sources, (v) => {
      return {
        ...v,
        // @ts-ignore
        url: hasUrl(v) ? replaceStringTokens(v.url, tokens) : undefined,
      };
    }),
    glyphs: replaceStringTokens(style.glyphs, tokens),
    sprite: (style.sprite as any)
      ? replaceStringTokens(style.sprite as any, tokens)
      : undefined,
  };
};

export const mapLayers = (
  style: MapboxStyle,
  layerIterator: (layer: AnyLayer) => AnyLayer | undefined
) => {
  return {
    ...style,
    layers: style.layers.map((x) => (x ? layerIterator(x) : undefined)),
  };
};
