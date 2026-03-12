import * as React from "react";

import type { SVGProps } from "react";
const SvgIcArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M19 7.999 12 4 5 7.999l.373.639 6.254-3.573V20h.746V5.065l6.254 3.573z"
    />
  </svg>
);
export default SvgIcArrowUp;
