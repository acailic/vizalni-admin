import { setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
} from "@testing-library/react";
import * as React from "react";

// Setup I18n for tests - Trans is mocked in vitest.setup.ts
const testI18n = setupI18n({
  locale: "sr-Latn",
  messages: {
    en: {},
    "sr-Latn": {},
    "sr-Cyrl": {},
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <I18nProvider i18n={testI18n}>{children}</I18nProvider>;
};

export const render = (ui: React.ReactElement, options?: any) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

export const renderHook = (hook: () => any, options?: any) =>
  rtlRenderHook(hook, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
