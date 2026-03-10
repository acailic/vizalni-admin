try {
  (() => {
    var h = __STORYBOOK_API__,
      {
        ActiveTabs: y,
        Consumer: g,
        ManagerContext: v,
        Provider: P,
        RequestResponseError: f,
        addons: n,
        combineParameters: A,
        controlOrMetaKey: x,
        controlOrMetaSymbol: R,
        eventMatchesShortcut: E,
        eventToShortcut: I,
        experimental_MockUniversalStore: U,
        experimental_UniversalStore: k,
        experimental_requestResponse: B,
        experimental_useUniversalStore: C,
        isMacLike: M,
        isShortcutTaken: N,
        keyToSymbol: L,
        merge: w,
        mockChannel: G,
        optionOrAltSymbol: K,
        shortcutMatchesShortcut: H,
        shortcutToHumanString: Y,
        types: q,
        useAddonState: D,
        useArgTypes: F,
        useArgs: V,
        useChannel: X,
        useGlobalTypes: j,
        useGlobals: z,
        useParameter: J,
        useSharedState: Q,
        useStoryPrepared: W,
        useStorybookApi: Z,
        useStorybookState: $,
      } = __STORYBOOK_API__;
    var c = (() => {
        let e;
        return (
          typeof window < "u"
            ? (e = window)
            : typeof globalThis < "u"
            ? (e = globalThis)
            : typeof window < "u"
            ? (e = window)
            : typeof self < "u"
            ? (e = self)
            : (e = {}),
          e
        );
      })(),
      S = "tag-filters",
      p = "static-filter";
    n.register(S, (e) => {
      let i = Object.entries(c.TAGS_OPTIONS ?? {}).reduce((t, r) => {
        let [o, u] = r;
        return u.excludeFromSidebar && (t[o] = !0), t;
      }, {});
      e.experimental_setFilter(p, (t) => {
        let r = t.tags ?? [];
        return (
          (r.includes("dev") || t.type === "docs") &&
          r.filter((o) => i[o]).length === 0
        );
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e
  );
}
