import * as React from "react";

import type { SVGProps } from "react";
const SvgIcDescription = (props: SVGProps<SVGSVGElement>) => (
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
      d="M4 6h11v1H4zm0 4h16V9H4zm0 3h16v-1H4zm0 6h16v-1H4zm0-3h16v-1H4z"
    />
  </svg>
);
export default SvgIcDescription;
