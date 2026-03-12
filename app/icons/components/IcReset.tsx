import * as React from "react";

import type { SVGProps } from "react";
const SvgIcReset = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14 2h1v7h7v1h-8zm-4 12H2v1h7v7h1zm-1-4V2H8v7H2v1zm5 4v8h1v-7h7v-1z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcReset;
