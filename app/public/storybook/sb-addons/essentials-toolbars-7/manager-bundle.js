try {
  (() => {
    var n = __REACT__,
      {
        Children: se,
        Component: ie,
        Fragment: ue,
        Profiler: ce,
        PureComponent: pe,
        StrictMode: me,
        Suspense: de,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: be,
        cloneElement: Se,
        createContext: _e,
        createElement: Te,
        createFactory: ye,
        createRef: Oe,
        forwardRef: ve,
        isValidElement: Ce,
        lazy: Ie,
        memo: Ee,
        startTransition: fe,
        unstable_act: xe,
        useCallback: v,
        useContext: ge,
        useDebugValue: Re,
        useDeferredValue: he,
        useEffect: g,
        useId: ke,
        useImperativeHandle: Ae,
        useInsertionEffect: Le,
        useLayoutEffect: Be,
        useMemo: Pe,
        useReducer: Ne,
        useRef: L,
        useState: B,
        useSyncExternalStore: Me,
        useTransition: De,
        version: Ve,
      } = __REACT__;
    var We = __STORYBOOK_API__,
      {
        ActiveTabs: Fe,
        Consumer: Ke,
        ManagerContext: Ye,
        Provider: $e,
        RequestResponseError: ze,
        addons: R,
        combineParameters: qe,
        controlOrMetaKey: Xe,
        controlOrMetaSymbol: je,
        eventMatchesShortcut: Ze,
        eventToShortcut: Je,
        experimental_MockUniversalStore: Qe,
        experimental_UniversalStore: et,
        experimental_requestResponse: tt,
        experimental_useUniversalStore: rt,
        isMacLike: ot,
        isShortcutTaken: at,
        keyToSymbol: nt,
        merge: lt,
        mockChannel: st,
        optionOrAltSymbol: it,
        shortcutMatchesShortcut: ut,
        shortcutToHumanString: ct,
        types: P,
        useAddonState: pt,
        useArgTypes: mt,
        useArgs: dt,
        useChannel: bt,
        useGlobalTypes: N,
        useGlobals: h,
        useParameter: St,
        useSharedState: _t,
        useStoryPrepared: Tt,
        useStorybookApi: M,
        useStorybookState: yt,
      } = __STORYBOOK_API__;
    var Et = __STORYBOOK_COMPONENTS__,
      {
        A: ft,
        ActionBar: xt,
        AddonPanel: gt,
        Badge: Rt,
        Bar: ht,
        Blockquote: kt,
        Button: At,
        ClipboardCode: Lt,
        Code: Bt,
        DL: Pt,
        Div: Nt,
        DocumentWrapper: Mt,
        EmptyTabContent: Dt,
        ErrorFormatter: Vt,
        FlexBar: Ht,
        Form: wt,
        H1: Ut,
        H2: Gt,
        H3: Wt,
        H4: Ft,
        H5: Kt,
        H6: Yt,
        HR: $t,
        IconButton: D,
        IconButtonSkeleton: zt,
        Icons: k,
        Img: qt,
        LI: Xt,
        Link: jt,
        ListItem: Zt,
        Loader: Jt,
        Modal: Qt,
        OL: er,
        P: tr,
        Placeholder: rr,
        Pre: or,
        ProgressSpinner: ar,
        ResetWrapper: nr,
        ScrollArea: lr,
        Separator: V,
        Spaced: sr,
        Span: ir,
        StorybookIcon: ur,
        StorybookLogo: cr,
        Symbols: pr,
        SyntaxHighlighter: mr,
        TT: dr,
        TabBar: br,
        TabButton: Sr,
        TabWrapper: _r,
        Table: Tr,
        Tabs: yr,
        TabsState: Or,
        TooltipLinkList: H,
        TooltipMessage: vr,
        TooltipNote: Cr,
        UL: Ir,
        WithTooltip: w,
        WithTooltipPure: Er,
        Zoom: fr,
        codeCommon: xr,
        components: gr,
        createCopyToClipboardFunction: Rr,
        getStoryHref: hr,
        icons: kr,
        interleaveSeparators: Ar,
        nameSpaceClassNames: Lr,
        resetComponents: Br,
        withReset: Pr,
      } = __STORYBOOK_COMPONENTS__;
    var F = { type: "item", value: "" },
      K = (r, t) => ({
        ...t,
        name: t.name || r,
        description: t.description || r,
        toolbar: {
          ...t.toolbar,
          items: t.toolbar.items.map((e) => {
            let o = typeof e == "string" ? { value: e, title: e } : e;
            return (
              o.type === "reset" &&
                t.toolbar.icon &&
                ((o.icon = t.toolbar.icon), (o.hideIcon = !0)),
              { ...F, ...o }
            );
          }),
        },
      }),
      Y = ["reset"],
      $ = (r) => r.filter((t) => !Y.includes(t.type)).map((t) => t.value),
      S = "addon-toolbars",
      z = async (r, t, e) => {
        e &&
          e.next &&
          (await r.setAddonShortcut(S, {
            label: e.next.label,
            defaultShortcut: e.next.keys,
            actionName: `${t}:next`,
            action: e.next.action,
          })),
          e &&
            e.previous &&
            (await r.setAddonShortcut(S, {
              label: e.previous.label,
              defaultShortcut: e.previous.keys,
              actionName: `${t}:previous`,
              action: e.previous.action,
            })),
          e &&
            e.reset &&
            (await r.setAddonShortcut(S, {
              label: e.reset.label,
              defaultShortcut: e.reset.keys,
              actionName: `${t}:reset`,
              action: e.reset.action,
            }));
      },
      q = (r) => (t) => {
        let {
            id: e,
            toolbar: { items: o, shortcuts: a },
          } = t,
          c = M(),
          [_, i] = h(),
          l = L([]),
          u = _[e],
          C = v(() => {
            i({ [e]: "" });
          }, [i]),
          I = v(() => {
            let s = l.current,
              m = s.indexOf(u),
              d = m === s.length - 1 ? 0 : m + 1,
              p = l.current[d];
            i({ [e]: p });
          }, [l, u, i]),
          E = v(() => {
            let s = l.current,
              m = s.indexOf(u),
              d = m > -1 ? m : 0,
              p = d === 0 ? s.length - 1 : d - 1,
              b = l.current[p];
            i({ [e]: b });
          }, [l, u, i]);
        return (
          g(() => {
            a &&
              z(c, e, {
                next: { ...a.next, action: I },
                previous: { ...a.previous, action: E },
                reset: { ...a.reset, action: C },
              });
          }, [c, e, a, I, E, C]),
          g(() => {
            l.current = $(o);
          }, []),
          n.createElement(r, { cycleValues: l.current, ...t })
        );
      },
      U = ({ currentValue: r, items: t }) =>
        r != null && t.find((e) => e.value === r && e.type !== "reset"),
      X = ({ currentValue: r, items: t }) => {
        let e = U({ currentValue: r, items: t });
        if (e) return e.icon;
      },
      j = ({ currentValue: r, items: t }) => {
        let e = U({ currentValue: r, items: t });
        if (e) return e.title;
      },
      Z = ({
        active: r,
        disabled: t,
        title: e,
        icon: o,
        description: a,
        onClick: c,
      }) =>
        n.createElement(
          D,
          { active: r, title: a, disabled: t, onClick: t ? () => {} : c },
          o &&
            n.createElement(k, { icon: o, __suppressDeprecationWarning: !0 }),
          e ? `\xA0${e}` : null
        ),
      J = ({
        right: r,
        title: t,
        value: e,
        icon: o,
        hideIcon: a,
        onClick: c,
        disabled: _,
        currentValue: i,
      }) => {
        let l =
            o &&
            n.createElement(k, {
              style: { opacity: 1 },
              icon: o,
              __suppressDeprecationWarning: !0,
            }),
          u = {
            id: e ?? "_reset",
            active: i === e,
            right: r,
            title: t,
            disabled: _,
            onClick: c,
          };
        return o && !a && (u.icon = l), u;
      },
      Q = q(
        ({
          id: r,
          name: t,
          description: e,
          toolbar: {
            icon: o,
            items: a,
            title: c,
            preventDynamicIcon: _,
            dynamicTitle: i,
          },
        }) => {
          let [l, u, C] = h(),
            [I, E] = B(!1),
            s = l[r],
            m = !!s,
            d = r in C,
            p = o,
            b = c;
          _ || (p = X({ currentValue: s, items: a }) || p),
            i && (b = j({ currentValue: s, items: a }) || b),
            !b && !p && console.warn(`Toolbar '${t}' has no title or icon`);
          let G = v(
            (x) => {
              u({ [r]: x });
            },
            [r, u]
          );
          return n.createElement(
            w,
            {
              placement: "top",
              tooltip: ({ onHide: x }) => {
                let W = a
                  .filter(({ type: f }) => {
                    let A = !0;
                    return f === "reset" && !s && (A = !1), A;
                  })
                  .map((f) =>
                    J({
                      ...f,
                      currentValue: s,
                      disabled: d,
                      onClick: () => {
                        G(f.value), x();
                      },
                    })
                  );
                return n.createElement(H, { links: W });
              },
              closeOnOutsideClick: !0,
              onVisibleChange: E,
            },
            n.createElement(Z, {
              active: I || m,
              disabled: d,
              description: e || "",
              icon: p,
              title: b || "",
            })
          );
        }
      ),
      ee = () => {
        let r = N(),
          t = Object.keys(r).filter((e) => !!r[e].toolbar);
        return t.length
          ? n.createElement(
              n.Fragment,
              null,
              n.createElement(V, null),
              t.map((e) => {
                let o = K(e, r[e]);
                return n.createElement(Q, { key: e, id: e, ...o });
              })
            )
          : null;
      };
    R.register(S, () =>
      R.add(S, {
        title: S,
        type: P.TOOL,
        match: ({ tabId: r }) => !r,
        render: () => n.createElement(ee, null),
      })
    );
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e
  );
}
