import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
} from "@testing-library/react";
import * as React from "react";

// Reuse a real Lingui i18n instance so provider internals behave correctly.
i18n.load("en", {});
i18n.activate("en");
const providerI18n = i18n as unknown as React.ComponentProps<
  typeof I18nProvider
>["i18n"];

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <I18nProvider i18n={providerI18n}>{children}</I18nProvider>;
};

export const render = (ui: React.ReactElement, options?: any) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

export const renderHook = (hook: () => any, options?: any) =>
  rtlRenderHook(hook, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
