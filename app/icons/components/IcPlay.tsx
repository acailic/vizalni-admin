import * as React from "react";

import type { SVGProps } from "react";
const SvgIcPlay = (props: SVGProps<SVGSVGElement>) => (
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
      d="m5 20 14-8L5 4zm1-1.723L16.984 12 6 5.723z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcPlay;
