import * as React from "react";

import type { SVGProps } from "react";
const SvgIcSize = (props: SVGProps<SVGSVGElement>) => (
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
      d="m18.156 12.001-3.102 4.154-.916-.409 2.478-3.314h-9.23l2.475 3.313-.915.407L5.844 12l3.102-4.154.916.409-2.482 3.32h9.238l-2.48-3.319.916-.407zM4 18V6H3v12zm17 0V6h-1v12z"
    />
  </svg>
);
export default SvgIcSize;
