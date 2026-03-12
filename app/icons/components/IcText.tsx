import * as React from "react";

import type { SVGProps } from "react";
const SvgIcText = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12.465 5H19v1.75h-.875v-.875h-5.66v12.25h1.285V19h-3.5v-.875h1.281V5.875H5.876v.875h-.872v-.875H5V5z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcText;
