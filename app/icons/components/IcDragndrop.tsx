import * as React from "react";

import type { SVGProps } from "react";
const SvgIcDragndrop = (props: SVGProps<SVGSVGElement>) => (
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
      d="M8 6h2v2H8zm5 2h2V6h-2zm-5 5h2v-2H8zm5 0h2v-2h-2zm-5 5h2v-2H8zm5 0h2v-2h-2z"
    />
  </svg>
);
export default SvgIcDragndrop;
