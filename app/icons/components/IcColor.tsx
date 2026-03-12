import * as React from "react";

import type { SVGProps } from "react";
const SvgIcColor = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="currentColor" d="M19 19H5V5h14zM6 18h12V6H6z" />
  </svg>
);
export default SvgIcColor;
