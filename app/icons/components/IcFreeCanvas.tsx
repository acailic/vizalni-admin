import * as React from "react";

import type { SVGProps } from "react";
const SvgIcFreeCanvas = (props: SVGProps<SVGSVGElement>) => (
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
      d="m12 11 10 2.727-3.423 1.711 2.743 2.743-2.139 2.14-2.742-2.744L14.727 21zm1.41 1.41L15 18.241l1.168-2.334 3.013 3.014.74-.74-3.014-3.014L19.241 14zM4 4.778V3h1.778v.941H4.94v.837zM11.111 3H7.556v.941h3.555zm1.778 0v.941h3.555V3zm5.333 0v.941h.837v.837H20V3zM20 6.556h-.941v3.555H20zM11.111 19v-.941H7.556V19zm-5.333 0v-.941H4.94v-.837H4V19zM4 15.444h.941V11.89H4zm0-5.333h.941V6.556H4z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcFreeCanvas;
