import * as React from "react";

import type { SVGProps } from "react";
const SvgIcLayoutSingle = (props: SVGProps<SVGSVGElement>) => (
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
      d="M3 9h14v11H3zm1 1v9h12v-9zm0-2h14v11h1V7H4zm2-2h14v11h1V5H6z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcLayoutSingle;
