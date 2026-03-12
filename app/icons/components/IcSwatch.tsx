import * as React from "react";

import type { SVGProps } from "react";
const SvgIcSwatch = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.886 9.367 16 15l1.818-8 1.8 1.185c.373.246.494.775.268 1.182m-3.392-5.882L15 3v12l1.98-10.459c.089-.467-.13-.94-.486-1.056M14 16v5.25c0 .415-.373.75-.833.75H4.833c-.46 0-.833-.335-.833-.75V16zm-1 1H5v4h8zm1-13.143V15H4V3.857C4 3.383 4.372 3 4.833 3h8.334c.46 0 .833.383.833.857M13 4H5v10h8zM8 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0"
    />
  </svg>
);
export default SvgIcSwatch;
