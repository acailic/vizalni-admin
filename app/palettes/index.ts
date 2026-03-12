import { SequentialPaletteType, DivergingPaletteType } from "../config-types";

export interface Palette {
  name: string;
  type: "sequential" | "diverging" | "categorical";
  colors: string[];
  domain?: number[];
}

export const createSequentialInterpolator = (
  palette: SequentialPaletteType
) => {
  const palettes: Record<SequentialPaletteType, string[]> = {
    blues: [
      "#f7fbff",
      "#deebf7",
      "#c6dbef",
      "#9ecae1",
      "#6baed6",
      "#4292c6",
      "#2171b5",
      "#08519c",
      "#08306b",
    ],
    reds: [
      "#fff5f0",
      "#fee0d2",
      "#fcbba1",
      "#fc9272",
      "#fb6a4a",
      "#ef3b2c",
      "#cb181d",
      "#a50f15",
      "#67000d",
    ],
    greens: [
      "#f7fcf5",
      "#e5f5e0",
      "#c7e9c0",
      "#a1d99b",
      "#74c476",
      "#41ab5d",
      "#238b45",
      "#006d2c",
      "#00441b",
    ],
    purples: [
      "#fcfbfd",
      "#efedf5",
      "#dadaeb",
      "#bcbddc",
      "#9e9ac8",
      "#807dba",
      "#6a51a3",
      "#54278f",
      "#3f007d",
    ],
    oranges: [
      "#fff5eb",
      "#fee6ce",
      "#fdd0a2",
      "#fdae6b",
      "#fd8d3c",
      "#f16913",
      "#d94801",
      "#a63603",
      "#7f2704",
    ],
    greys: [
      "#ffffff",
      "#f0f0f0",
      "#d9d9d9",
      "#bdbdbd",
      "#969696",
      "#737373",
      "#525252",
      "#252525",
      "#000000",
    ],
  };

  const colors = palettes[palette] || palettes.blues;

  return (t: number): string => {
    const index = Math.floor(t * (colors.length - 1));
    return colors[Math.min(index, colors.length - 1)];
  };
};

export const createDivergingInterpolator = (palette: DivergingPaletteType) => {
  const palettes: Record<string, string[]> = {
    RdBu: [
      "#67001f",
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#f7f7f7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac",
      "#053061",
    ],
    RdYlGn: [
      "#a50026",
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee08b",
      "#ffffbf",
      "#d9ef8b",
      "#a6d96a",
      "#66bd63",
      "#1a9850",
      "#006837",
    ],
    RdYlBu: [
      "#a50026",
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee08b",
      "#ffffbf",
      "#e6f598",
      "#abdda4",
      "#66c2a5",
      "#3288bd",
      "#5e4fa2",
    ],
    BrBG: ["#a6611d", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
    PiYG: ["#e04234", "#e88369", "#f7f7f7", "#83b492", "#2c7fb8"],
    PRGn: ["#40004b", "#949494", "#f7f7f7", "#74add1", "#08589e"],
    PuOr: ["#b35806", "#f1a340", "#f7f7f7", "#998ec3", "#542788"],
  } as any;

  const colors = palettes[palette] || palettes.rdbu;

  return (t: number): string => {
    const index = Math.floor(t * (colors.length - 1));
    return colors[Math.min(index, colors.length - 1)];
  };
};

export const Palette = {
  Sequential: createSequentialInterpolator,
  Diverging: createDivergingInterpolator,
  getColors: (
    palette: SequentialPaletteType | DivergingPaletteType,
    count: number
  ): string[] => {
    const interpolator =
      palette.includes("rdbu") ||
      palette.includes("rdyl") ||
      palette.includes("spectral")
        ? createDivergingInterpolator(palette as DivergingPaletteType)
        : createSequentialInterpolator(palette as SequentialPaletteType);

    return Array.from({ length: count }, (_, i) =>
      interpolator(i / (count - 1))
    );
  },
};
