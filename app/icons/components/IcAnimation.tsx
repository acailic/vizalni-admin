import * as React from "react";

import type { SVGProps } from "react";
const SvgIcAnimation = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="currentColor" d="M16 14H8v-1h8zM16 17H8v-1h8z" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4 6.891 19.799 3 20 4.109 4.201 8z"
      clipRule="evenodd"
    />
    <path fill="currentColor" d="M20 21H4V9h16zM5 20h14V10H5z" />
  </svg>
);
export default SvgIcAnimation;
