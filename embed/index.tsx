import iframeResize from "iframe-resizer/js/iframeResizer.js";

// Type definitions for iframe-resizer
interface IFrameResizeOptions {
  log?: boolean;
  [key: string]: unknown;
}

Array.from(document.querySelectorAll("[data-visualize-iframe]")).forEach((el: HTMLElement) => {
    (iframeResize as (options: IFrameResizeOptions, element: HTMLElement) => void)({ log: false }, el);
});
