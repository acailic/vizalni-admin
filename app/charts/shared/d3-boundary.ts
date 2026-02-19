import { select, Selection } from "d3-selection";
import { RefObject, useEffect } from "react";

import { RenderOptions } from "@/charts/shared/rendering-utils";

export type D3Selection = Selection<SVGGElement, unknown, null, undefined>;

/**
 * The contract every chart's render function must satisfy.
 * A pure TypeScript function — no React, no hooks.
 * Testable with jsdom and no React wrapper.
 */
export type D3RenderFn<TData> = (
  g: D3Selection,
  data: TData,
  opts: RenderOptions
) => void;

/**
 * Manages the useEffect lifecycle at the React/D3 boundary.
 * Every chart that renders with D3 calls this hook exactly once.
 */
export function useD3Render<TData>(
  ref: RefObject<SVGGElement>,
  renderFn: D3RenderFn<TData>,
  data: TData,
  opts: RenderOptions
): void {
  useEffect(() => {
    if (!ref.current) return;
    renderFn(select(ref.current) as D3Selection, data, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, opts, renderFn]);
}
