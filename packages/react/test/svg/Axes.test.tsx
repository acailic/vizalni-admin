import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { XAxis } from "../../src/svg/Axes";
import { scaleLinear } from "d3-scale";

describe("XAxis", () => {
  it("should render a g element with class", () => {
    const scale = scaleLinear().domain([0, 100]).range([0, 500]);

    render(
      <svg>
        <XAxis scale={scale} height={400} />
      </svg>
    );

    const g = document.querySelector("g.x-axis");
    expect(g).toBeTruthy();
  });
});
