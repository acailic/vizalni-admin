import * as React from "react";

import type { SVGProps } from "react";
const SvgIcZoomIn = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.86 11v3h1v-3h3v-1h-3V7h-1v3h-3v1z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M15.743 10.485c0 3.03-2.41 5.486-5.382 5.486-2.973 0-5.382-2.456-5.382-5.486s2.41-5.487 5.382-5.487 5.382 2.456 5.382 5.487m-1.092 4.787a6.27 6.27 0 0 1-4.29 1.697C6.848 16.969 4 14.066 4 10.484 4 6.905 6.848 4 10.36 4c3.514 0 6.361 2.903 6.361 6.485a6.54 6.54 0 0 1-1.4 4.059L19 18.294l-.692.706z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcZoomIn;
