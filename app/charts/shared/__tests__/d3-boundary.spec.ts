import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { describe, it, expect, vi } from "vitest";

import { useD3Render } from "@/charts/shared/d3-boundary";

describe("useD3Render", () => {
  it("calls renderFn with a d3 selection when ref is attached", () => {
    const renderFn = vi.fn();
    const data = [{ key: "a", value: 1 }];
    const opts = { transition: { enable: false, duration: 0 } };

    const { result } = renderHook(() => {
      const ref = useRef<SVGGElement>(null);
      // Attach a real element so the ref is not null
      Object.defineProperty(ref, "current", {
        value: document.createElementNS("http://www.w3.org/2000/svg", "g"),
        writable: true,
      });
      useD3Render(ref, renderFn, data, opts);
      return ref;
    });

    expect(renderFn).toHaveBeenCalledOnce();
    expect(renderFn.mock.calls[0][1]).toBe(data);
    expect(renderFn.mock.calls[0][2]).toBe(opts);
  });

  it("does not call renderFn when ref is null", () => {
    const renderFn = vi.fn();
    const data: unknown[] = [];
    const opts = { transition: { enable: false, duration: 0 } };

    renderHook(() => {
      const ref = useRef<SVGGElement>(null);
      // ref.current stays null (not attached to DOM)
      useD3Render(ref, renderFn, data, opts);
    });

    expect(renderFn).not.toHaveBeenCalled();
  });
});
