import * as React from "react";

import type { SVGProps } from "react";
const SvgIcLayoutVertical = (props: SVGProps<SVGSVGElement>) => (
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
      d="M3 3h18v5H3zm1 1v3h16V4zM3 9h18v6H3zm1 1v4h16v-4zm-1 6h18v5H3zm1 1v3h16v-3z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcLayoutVertical;
