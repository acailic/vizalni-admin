import * as React from "react";

import type { SVGProps } from "react";
const SvgIcCopy = (props: SVGProps<SVGSVGElement>) => (
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
      d="M20 9H9v11h11zM8 8v13h13V8z"
      clipRule="evenodd"
    />
    <path fill="currentColor" d="M6 17H4V4h13v2h-1V5H5v11h1z" />
  </svg>
);
export default SvgIcCopy;
