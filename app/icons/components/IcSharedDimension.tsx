import * as React from "react";

import type { SVGProps } from "react";
const SvgIcSharedDimension = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10 5h10v10H10v-3h1v2h8V6h-8v2h-1zm4 11h-1v2H5v-8h8v2h1V9H4v10h10z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcSharedDimension;
