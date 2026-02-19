import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { cleanup, render as rtlRender } from "@testing-library/react";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import clownface, { AnyPointer } from "clownface";
import { configureAxe, toHaveNoViolations } from "jest-axe";
import rdf from "rdf-ext";
import DatasetExt from "rdf-ext/lib/Dataset";
import DefaultGraphExt from "rdf-ext/lib/DefaultGraph";
import { NamedNode, Term } from "rdf-js";
import * as React from "react";
import { afterEach, vi, expect } from "vitest";

import { GRAPHQL_ENDPOINT } from "@/domain/env";
import * as ns from "@/rdf/namespace";
import { __resetQueryCacheForTests } from "@/utils/use-fetch-data";

// Since it's a macro, it's not defined at runtime, maybe in the future
// we should add a transformer so that test files are transformed the same
// way as app files so that the macro is defined inside files that are ran by vitest.
vi.mock("@lingui/macro", () => {
  const resolveMessage = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const maybeMessage = value as { message?: string; id?: string };
      return maybeMessage.message || maybeMessage.id || "";
    }
    return "";
  };

  return {
    defineMessage: (d: unknown) => d,
    t: resolveMessage,
    Trans: ({ children }: { children: React.ReactNode }) => children,
    Plural: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: number;
    }) => (typeof children === "function" ? children(value) : children),
    Select: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => (typeof children === "function" ? children(value) : children),
    SelectOrdinal: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: number;
    }) => (typeof children === "function" ? children(value) : children),
  };
});

// Mock Trans component to return children directly
vi.mock("@lingui/react", async () => {
  const actual = await vi.importActual("@lingui/react");
  return {
    ...actual,
    Trans: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock("@/graphql/client", () => {
  return {
    client: createClient({
      url: GRAPHQL_ENDPOINT,
      exchanges: [cacheExchange, fetchExchange],
    }),
  };
});

vi.mock("rdf-cube-view-query", () => ({
  Node: class {
    constructor() {}
  },
  Source: class {
    constructor() {}
  },
  Cube: class {
    constructor() {}
  },
  CubeDimension: class {
    ptr: AnyPointer;

    constructor({
      term = rdf.blankNode(),
      dataset = rdf.dataset(),
      graph = rdf.defaultGraph(),
    }: {
      term?: Term;
      dataset?: DatasetExt;
      graph?: DefaultGraphExt;
    } = {}) {
      this.ptr = clownface({ term, dataset, graph });
    }

    get path() {
      return this.ptr.out(ns.sh.path).term;
    }

    get optional() {
      const optionalDatatype = this.ptr
        .out(ns.sh.or)
        .out(ns.sh.datatype)
        .filter((d) => ns.cube.Undefined.equals(d.term)).term;
      const optionalValue = this.in.some((v) => ns.cube.Undefined.equals(v));

      return Boolean(optionalDatatype || optionalValue);
    }

    get datatype() {
      const nonOptional = this.ptr.out(ns.sh.datatype).term;
      const withOptional = this.ptr
        .out(ns.sh.or)
        .out(ns.sh.datatype)
        .filter((d) => !ns.cube.Undefined.equals(d.term)).term;

      return nonOptional || withOptional;
    }

    get minExclusive() {
      return this.ptr.out(ns.sh.minExclusive).term;
    }

    get minInclusive() {
      return this.ptr.out(ns.sh.minInclusive).term;
    }

    get maxExclusive() {
      return this.ptr.out(ns.sh.maxExclusive).term;
    }

    get maxInclusive() {
      return this.ptr.out(ns.sh.maxInclusive).term;
    }

    get in() {
      return [...(this.ptr.out(ns.sh.in).list() ?? [])].map(
        (item) => item.term
      );
    }

    out(...args: NamedNode[]) {
      return this.ptr.out(...args);
    }
  },
}));

vi.mock("next/router", () => {
  const router = {
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    isReady: true,
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    ready: (cb: () => void) => setTimeout(cb, 0),
  };

  return {
    __esModule: true,
    default: router,
    useRouter: () => router,
  };
});

// Mock deck.gl to avoid version conflicts in tests
vi.mock("@deck.gl/core", () => ({
  WebMercatorViewport: class {
    constructor() {}
  },
}));

vi.mock("@deck.gl/mapbox", () => ({
  MapboxOverlay: class {
    constructor() {}
  },
}));

afterEach(() => {
  cleanup();
  if (typeof __resetQueryCacheForTests === "function") {
    __resetQueryCacheForTests();
  }
});

// Accessibility testing setup

// Configure axe with recommended rules
const axe = configureAxe({
  rules: {
    // Enable WCAG 2.1 AA compliance
    "color-contrast": { enabled: true },
    "keyboard-navigation": { enabled: true },
    "aria-labels": { enabled: true },
    "heading-order": { enabled: true },
    "alt-text": { enabled: true },
    "form-field-multiple-labels": { enabled: true },
    "focus-order-semantics": { enabled: true },
  },
});

// Extend Vitest's matchers
expect.extend(toHaveNoViolations);

// Make axe available globally for tests
vi.stubGlobal("axe", axe);

// Mock DOM methods that are not available in jsdom
if (typeof SVGElement !== "undefined") {
  Object.defineProperty(SVGElement.prototype, "getTotalLength", {
    writable: true,
    value: function () {
      return 100;
    },
  });
}

if (typeof SVGPathElement !== "undefined") {
  Object.defineProperty(SVGPathElement.prototype, "getTotalLength", {
    writable: true,
    value: function () {
      return 100;
    },
  });
}

if (typeof ResizeObserver === "undefined") {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
}

if (typeof IntersectionObserver === "undefined") {
  class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
}

// Mock requestIdleCallback for jsdom environment
if (typeof requestIdleCallback === "undefined") {
  vi.stubGlobal("requestIdleCallback", (cb: () => void) => setTimeout(cb, 0));
  vi.stubGlobal("cancelIdleCallback", (id: number) => clearTimeout(id));
}

// Setup I18n for tests
i18n.load("en", {});
i18n.activate("en");

// Setup I18nProvider wrapper for all RTL renders
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(I18nProvider, { i18n }, children);
};

// Override RTL render with providers
const customRender = (ui: React.ReactElement, options?: any) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

import "@testing-library/jest-dom/vitest";
