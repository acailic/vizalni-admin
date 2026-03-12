import * as React from "react";

import type { SVGProps } from "react";
const SvgIcSegments = (props: SVGProps<SVGSVGElement>) => (
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
      fillRule="evenodd"
      d="M8 17c1.27 0 2.43-.474 3.312-1.255A5.98 5.98 0 0 1 10 12c0-1.417.491-2.719 1.312-3.745A5 5 0 1 0 8 17m0 1a5.98 5.98 0 0 0 4-1.528 6 6 0 1 0 0-8.944A6 6 0 1 0 8 18m8-11c-1.27 0-2.43.474-3.312 1.255A5.98 5.98 0 0 1 14 12a5.98 5.98 0 0 1-1.312 3.746A5 5 0 1 0 16 7"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcSegments;
