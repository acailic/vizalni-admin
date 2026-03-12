import * as React from "react";

import type { SVGProps } from "react";
const SvgIcColumn = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15.313 5H20v14h-4.687zm-.948-1H21v16H3V4zm-4.74 1h4.74v14h-4.74zm-.947 0H4v14h4.678z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcColumn;
