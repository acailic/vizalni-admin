import * as React from "react";

import type { SVGProps } from "react";
const SvgIcMap = (props: SVGProps<SVGSVGElement>) => (
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
      d="m8.767 3.24 5.552 2.914L20 3v14.62l-5.67 3.148-5.555-2.917L3 21V6.384zm5.131 3.66L9.192 4.43v12.673l4.706 2.47zM3.845 6.893l4.5-2.455v12.665l-4.5 2.455zM14.741 19.56l4.405-2.447V4.453L14.741 6.9z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcMap;
