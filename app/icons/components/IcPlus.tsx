import * as React from "react";

import type { SVGProps } from "react";
const SvgIcPlus = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.266 11.758h-6.789V5h-.75v6.758H5v.75h6.727v6.758h.75v-6.758h6.789z"
    />
  </svg>
);
export default SvgIcPlus;
