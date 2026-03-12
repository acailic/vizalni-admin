import * as React from "react";

import type { SVGProps } from "react";
const SvgIcAreasChart = (props: SVGProps<SVGSVGElement>) => (
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
      d="M3 4h.687v15.22H21V20H3z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M14.546 16.25 9.773 15 5 17.25V18h15v-4zm4.798-1.229-4.755 1.961-4.756-1.245L6.517 17.3h12.827z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m9.773 13.897 4.773 1.724L20 12.517V7l-5.454 5.172-4.773-1.379L5 15.621V17zM6.122 15.45l3.57-2.322 4.795 1.732 4.857-2.764V8.56l-4.628 4.388-4.76-1.375z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcAreasChart;
