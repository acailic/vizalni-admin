import * as React from "react";

import type { SVGProps } from "react";
const SvgIcArea = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17 9v6H7v-3.5l3.182-2 3.182 1.25z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcArea;
