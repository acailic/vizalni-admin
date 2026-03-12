import * as React from "react";

import type { SVGProps } from "react";
const SvgIcPie = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12.121 7v4.5L16 13.75c-.765 1.402-2.174 2.25-3.703 2.25a4.2 4.2 0 0 1-1.993-.505c-1.014-.56-1.761-1.506-2.105-2.651a4.67 4.67 0 0 1 .292-3.436c.682-1.36 1.974-2.262 3.415-2.4z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcPie;
