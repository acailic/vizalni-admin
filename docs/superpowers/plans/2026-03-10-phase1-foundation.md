# Phase 1: Foundation - Navigation, Search & Homepage Polish

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development
> (if subagents available) or superpowers:executing-plans to implement this
> plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add main navigation, global search, onboarding link, and statistics
preview to achieve professional portal quality.

**Architecture:** Extend existing header component with navigation links, add
search bar with autocomplete, enhance homepage with statistics counter and
onboarding CTA. Follow existing MUI patterns and i18n conventions.

**Tech Stack:** React, MUI (Material-UI), Next.js, Lingui i18n, Vitest

---

## File Structure

```
app/
├── components/
│   ├── navigation/
│   │   ├── MainNav.tsx           # New: Main navigation menu
│   │   ├── MainNav.test.tsx      # New: Tests for navigation
│   │   ├── NavItem.tsx           # New: Single nav item with active state
│   │   ├── NavItem.test.tsx      # New: Tests for nav item
│   │   └── index.ts              # New: Exports
│   ├── search/
│   │   ├── GlobalSearch.tsx      # New: Search bar component
│   │   ├── GlobalSearch.test.tsx # New: Tests for search
│   │   └── index.ts              # New: Exports
│   └── homepage/
│       ├── StatsCounter.tsx      # New: Animated statistics
│       ├── StatsCounter.test.tsx # New: Tests for counter
│       ├── OnboardingCTA.tsx     # New: Onboarding call-to-action
│       ├── OnboardingCTA.test.tsx # New: Tests for CTA
│       └── index.ts              # New: Exports
├── header.tsx                    # Modify: Add nav + search
└── pages/
    └── index.tsx                 # Modify: Add stats + onboarding CTA
```

---

## Chunk 1: Main Navigation

### Task 1.1: NavItem Component

**Files:**

- Create: `app/components/navigation/NavItem.tsx`
- Create: `app/components/navigation/NavItem.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/components/navigation/NavItem.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { NavItem } from "./NavItem";

describe("NavItem", () => {
  it("renders link with label", () => {
    render(<NavItem href="/browse" label="Browse" />);
    expect(screen.getByRole("link", { name: "Browse" })).toBeInTheDocument();
  });

  it("shows active state when isActive is true", () => {
    render(<NavItem href="/browse" label="Browse" isActive />);
    const link = screen.getByRole("link");
    expect(link).toHaveStyle({ fontWeight: 600 });
  });

  it("applies inactive style by default", () => {
    render(<NavItem href="/browse" label="Browse" />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveStyle({ fontWeight: 600 });
  });

  it("supports external links", () => {
    render(<NavItem href="https://example.com" label="External" external />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- components/navigation/NavItem.test.tsx` Expected:
FAIL - Cannot find module './NavItem'

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/components/navigation/NavItem.tsx
import { Box } from "@mui/material";
import Link from "next/link";

interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  external?: boolean;
}

export function NavItem({
  href,
  label,
  isActive = false,
  external = false,
}: NavItemProps) {
  if (external) {
    return (
      <Box
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: "white",
          textDecoration: "none",
          px: 2,
          py: 1,
          fontWeight: isActive ? 600 : 400,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.08)",
          },
        }}
      >
        {label}
      </Box>
    );
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <Box
        component="a"
        sx={{
          color: "white",
          textDecoration: "none",
          px: 2,
          py: 1,
          fontWeight: isActive ? 600 : 400,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.08)",
          },
        }}
      >
        {label}
      </Box>
    </Link>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npm test -- components/navigation/NavItem.test.tsx` Expected:
PASS

- [ ] **Step 5: Commit**

```bash
git add app/components/navigation/NavItem.tsx app/components/navigation/NavItem.test.tsx
git commit -m "feat(nav): add NavItem component with active state"
```

---

### Task 1.2: MainNav Component

**Files:**

- Create: `app/components/navigation/MainNav.tsx`
- Create: `app/components/navigation/MainNav.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/components/navigation/MainNav.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { MainNav } from "./MainNav";

// Mock useRouter
vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/browse",
    asPath: "/browse",
  }),
}));

describe("MainNav", () => {
  it("renders all navigation items", () => {
    render(<MainNav />);
    expect(screen.getByRole("link", { name: "Browse" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Topics" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gallery" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
  });

  it("highlights active navigation item based on pathname", () => {
    render(<MainNav />);
    const browseLink = screen.getByRole("link", { name: "Browse" });
    expect(browseLink).toHaveStyle({ fontWeight: 600 });
  });

  it("supports localized labels", () => {
    render(<MainNav locale="sr" />);
    expect(screen.getByRole("link", { name: "Pretraga" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- components/navigation/MainNav.test.tsx` Expected:
FAIL - Cannot find module './MainNav'

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/components/navigation/MainNav.tsx
import { Box } from "@mui/material";
import { useRouter } from "next/router";

import { NavItem } from "./NavItem";

type Locale = "en" | "sr" | "sr-Cyrl";

const NAV_ITEMS: { href: string; label: Record<Locale, string> }[] = [
  {
    href: "/browse",
    label: { en: "Browse", sr: "Pretraga", "sr-Cyrl": "Претрага" },
  },
  {
    href: "/create/new",
    label: { en: "Create", sr: "Kreiraj", "sr-Cyrl": "Креирај" },
  },
  { href: "/topics", label: { en: "Topics", sr: "Teme", "sr-Cyrl": "Теме" } },
  {
    href: "/gallery",
    label: { en: "Gallery", sr: "Galerija", "sr-Cyrl": "Галерија" },
  },
  {
    href: "/docs",
    label: { en: "Docs", sr: "Dokumentacija", "sr-Cyrl": "Документација" },
  },
];

interface MainNavProps {
  locale?: Locale;
}

export function MainNav({ locale = "en" }: MainNavProps) {
  const router = useRouter();

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        gap: 1,
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = router.pathname.startsWith(item.href.split("/")[1]);
        return (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label[locale]}
            isActive={isActive}
          />
        );
      })}
    </Box>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npm test -- components/navigation/MainNav.test.tsx` Expected:
PASS

- [ ] **Step 5: Commit**

```bash
git add app/components/navigation/MainNav.tsx app/components/navigation/MainNav.test.tsx
git commit -m "feat(nav): add MainNav component with localized items"
```

---

### Task 1.3: Navigation Index and Export

**Files:**

- Create: `app/components/navigation/index.ts`

- [ ] **Step 1: Create index file**

```tsx
// app/components/navigation/index.ts
export { MainNav } from "./MainNav";
export { NavItem } from "./NavItem";
```

- [ ] **Step 2: Commit**

```bash
git add app/components/navigation/index.ts
git commit -m "feat(nav): add navigation exports"
```

---

### Task 1.4: Integrate MainNav into Header

**Files:**

- Modify: `app/components/header.tsx`

- [ ] **Step 1: Update header imports**

Add to imports in `app/components/header.tsx`:

```tsx
import { MainNav } from "@/components/navigation";
```

- [ ] **Step 2: Add MainNav to header layout**

Replace the top bar content in `app/components/header.tsx` around line 38-47:

```tsx
// Before:
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 48px",
    backgroundColor: "#0C4076",
    ...(extendTopBar ? { maxWidth: "unset !important" } : {}),
  }}
>
  {SOURCE_OPTIONS.length > 1 && <DataSourceMenu />}
  <Flex alignItems="center" gap={3} marginLeft="auto">
    ...

// After:
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 48px",
    backgroundColor: "#0C4076",
    ...(extendTopBar ? { maxWidth: "unset !important" } : {}),
  }}
>
  {SOURCE_OPTIONS.length > 1 && <DataSourceMenu />}
  <MainNav locale={locale as "en" | "sr" | "sr-Cyrl"} />
  <Flex alignItems="center" gap={3} marginLeft="auto">
    ...
```

- [ ] **Step 3: Run existing tests to verify no regression**

Run: `cd app && npm test -- components/header` Expected: PASS (all existing
tests)

- [ ] **Step 4: Commit**

```bash
git add app/components/header.tsx
git commit -m "feat(header): integrate MainNav into header"
```

---

## Chunk 2: Global Search

### Task 2.1: GlobalSearch Component

**Files:**

- Create: `app/components/search/GlobalSearch.tsx`
- Create: `app/components/search/GlobalSearch.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/components/search/GlobalSearch.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { GlobalSearch } from "./GlobalSearch";

describe("GlobalSearch", () => {
  it("renders search input", () => {
    render(<GlobalSearch />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls onSearch when form is submitted", () => {
    const onSearch = vi.fn();
    render(<GlobalSearch onSearch={onSearch} />);

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "budget" } });
    fireEvent.submit(input.closest("form")!);

    expect(onSearch).toHaveBeenCalledWith("budget");
  });

  it("shows localized placeholder", () => {
    render(<GlobalSearch locale="sr" />);
    expect(screen.getByPlaceholderText("Pretraga...")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<GlobalSearch />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- components/search/GlobalSearch.test.tsx` Expected:
FAIL - Cannot find module './GlobalSearch'

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/components/search/GlobalSearch.tsx
import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

type Locale = "en" | "sr" | "sr-Cyrl";

const PLACEHOLDERS: Record<Locale, string> = {
  en: "Search...",
  sr: "Pretraga...",
  "sr-Cyrl": "Претрага...",
};

interface GlobalSearchProps {
  onSearch?: (query: string) => void;
  locale?: Locale;
}

export function GlobalSearch({ onSearch, locale = "en" }: GlobalSearchProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSearch) {
      onSearch(value.trim());
    }
  };

  return (
    <Box
      component="form"
      role="search"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 1,
        px: 1,
        width: { xs: "auto", md: 200 },
      }}
    >
      <IconButton type="submit" size="small" sx={{ color: "white", p: 0.5 }}>
        <SearchIcon fontSize="small" />
      </IconButton>
      <InputBase
        placeholder={PLACEHOLDERS[locale]}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          color: "white",
          ml: 0.5,
          "&::placeholder": {
            color: "rgba(255,255,255,0.7)",
          },
        }}
        inputProps={{ "aria-label": "Search" }}
      />
    </Box>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npm test -- components/search/GlobalSearch.test.tsx` Expected:
PASS

- [ ] **Step 5: Commit**

```bash
git add app/components/search/GlobalSearch.tsx app/components/search/GlobalSearch.test.tsx
git commit -m "feat(search): add GlobalSearch component"
```

---

### Task 2.2: Search Index and Export

**Files:**

- Create: `app/components/search/index.ts`

- [ ] **Step 1: Create index file**

```tsx
// app/components/search/index.ts
export { GlobalSearch } from "./GlobalSearch";
```

- [ ] **Step 2: Commit**

```bash
git add app/components/search/index.ts
git commit -m "feat(search): add search exports"
```

---

### Task 2.3: Integrate GlobalSearch into Header

**Files:**

- Modify: `app/components/header.tsx`

- [ ] **Step 1: Update header imports**

Add to imports in `app/components/header.tsx`:

```tsx
import { GlobalSearch } from "@/components/search";
```

- [ ] **Step 2: Add GlobalSearch to header**

Add GlobalSearch before the demo gallery link in the header:

```tsx
// In the Flex component that contains demo gallery link:
<Flex alignItems="center" gap={3} marginLeft="auto">
  <GlobalSearch locale={locale as "en" | "sr" | "sr-Cyrl"} />
  <Link href="/demos/showcase" passHref legacyBehavior>
    ...
```

- [ ] **Step 3: Run tests to verify**

Run: `cd app && npm test -- components/header` Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/components/header.tsx
git commit -m "feat(header): integrate GlobalSearch into header"
```

---

## Chunk 3: Homepage Enhancements

### Task 3.1: StatsCounter Component

**Files:**

- Create: `app/components/homepage/StatsCounter.tsx`
- Create: `app/components/homepage/StatsCounter.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/components/homepage/StatsCounter.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { StatsCounter } from "./StatsCounter";

describe("StatsCounter", () => {
  it("renders statistics with labels", () => {
    render(
      <StatsCounter
        stats={[
          { value: 150, label: "Charts created" },
          { value: 45, label: "Datasets" },
        ]}
      />
    );
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("Charts created")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Datasets")).toBeInTheDocument();
  });

  it("formats large numbers with commas", () => {
    render(<StatsCounter stats={[{ value: 1234, label: "Views" }]} />);
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("supports localized labels", () => {
    render(
      <StatsCounter stats={[{ value: 10, label: "Grafikoni" }]} locale="sr" />
    );
    expect(screen.getByText("Grafikoni")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- components/homepage/StatsCounter.test.tsx` Expected:
FAIL - Cannot find module './StatsCounter'

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/components/homepage/StatsCounter.tsx
import { Box, Typography } from "@mui/material";

interface Stat {
  value: number;
  label: string;
}

interface StatsCounterProps {
  stats: Stat[];
  locale?: "en" | "sr" | "sr-Cyrl";
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function StatsCounter({ stats }: StatsCounterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: { xs: 4, md: 8 },
        flexWrap: "wrap",
        py: 4,
      }}
    >
      {stats.map((stat, index) => (
        <Box key={index} sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            {formatNumber(stat.value)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npm test -- components/homepage/StatsCounter.test.tsx` Expected:
PASS

- [ ] **Step 5: Commit**

```bash
git add app/components/homepage/StatsCounter.tsx app/components/homepage/StatsCounter.test.tsx
git commit -m "feat(homepage): add StatsCounter component"
```

---

### Task 3.2: OnboardingCTA Component

**Files:**

- Create: `app/components/homepage/OnboardingCTA.tsx`
- Create: `app/components/homepage/OnboardingCTA.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/components/homepage/OnboardingCTA.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { OnboardingCTA } from "./OnboardingCTA";

describe("OnboardingCTA", () => {
  it("renders call-to-action with link to onboarding", () => {
    render(<OnboardingCTA />);
    const link = screen.getByRole("link", { name: /get started/i });
    expect(link).toHaveAttribute("href", "/onboarding");
  });

  it("shows localized title", () => {
    render(<OnboardingCTA locale="sr" />);
    expect(screen.getByText(/Prvi koraci/i)).toBeInTheDocument();
  });

  it("has prominent styling", () => {
    render(<OnboardingCTA />);
    const card = screen.getByRole("link").closest("div");
    expect(card).toHaveStyle({ backgroundColor: "primary.light" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- components/homepage/OnboardingCTA.test.tsx`
Expected: FAIL - Cannot find module './OnboardingCTA'

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/components/homepage/OnboardingCTA.tsx
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

type Locale = "en" | "sr" | "sr-Cyrl";

const COPY: Record<
  Locale,
  { title: string; description: string; cta: string }
> = {
  en: {
    title: "New here?",
    description:
      "Start with our guided wizard to create your first visualization",
    cta: "Get Started",
  },
  sr: {
    title: "Prvi put ovde?",
    description: "Započnite sa vodičem da kreirate prvu vizualizaciju",
    cta: "Započni",
  },
  "sr-Cyrl": {
    title: "Први пут овде?",
    description: "Започните са водичем да креирате прву визуализацију",
    cta: "Започни",
  },
};

interface OnboardingCTAProps {
  locale?: Locale;
}

export function OnboardingCTA({ locale = "en" }: OnboardingCTAProps) {
  const copy = COPY[locale];

  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
        borderRadius: 2,
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={600}>
          {copy.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {copy.description}
        </Typography>
      </Box>
      <Link href="/onboarding" passHref legacyBehavior>
        <Button variant="contained" color="primary" component="a">
          {copy.cta}
        </Button>
      </Link>
    </Box>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npm test -- components/homepage/OnboardingCTA.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/components/homepage/OnboardingCTA.tsx app/components/homepage/OnboardingCTA.test.tsx
git commit -m "feat(homepage): add OnboardingCTA component"
```

---

### Task 3.3: Homepage Index and Export

**Files:**

- Create: `app/components/homepage/index.ts`

- [ ] **Step 1: Create index file**

```tsx
// app/components/homepage/index.ts
export { StatsCounter } from "./StatsCounter";
export { OnboardingCTA } from "./OnboardingCTA";
```

- [ ] **Step 2: Commit**

```bash
git add app/components/homepage/index.ts
git commit -m "feat(homepage): add homepage component exports"
```

---

### Task 3.4: Integrate Components into Homepage

**Files:**

- Modify: `app/pages/index.tsx`

- [ ] **Step 1: Add imports to homepage**

Add to imports in `app/pages/index.tsx`:

```tsx
import { OnboardingCTA, StatsCounter } from "@/components/homepage";
```

- [ ] **Step 2: Add StatsCounter after hero section**

Find the hero section in `app/pages/index.tsx` and add StatsCounter after it:

```tsx
// After the hero Box component, add:
<Box sx={{ py: 4, backgroundColor: "grey.50" }}>
  <Container maxWidth="lg">
    <StatsCounter
      stats={[
        {
          value: 150,
          label: locale === "en" ? "Charts created" : "Kreirani grafikoni",
        },
        {
          value: 45,
          label:
            locale === "en"
              ? "Datasets available"
              : "Dostupni skupovi podataka",
        },
        {
          value: 1000,
          label: locale === "en" ? "Chart views" : "Pregledi grafikona",
        },
      ]}
      locale={locale as "en" | "sr" | "sr-Cyrl"}
    />
  </Container>
</Box>
```

- [ ] **Step 3: Add OnboardingCTA before featured section**

Add before the featured charts section:

```tsx
// Add onboarding CTA
<Container maxWidth="lg" sx={{ py: 4 }}>
  <OnboardingCTA locale={locale as "en" | "sr" | "sr-Cyrl"} />
</Container>
```

- [ ] **Step 4: Run homepage tests to verify**

Run: `cd app && npm test -- pages/index` Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/pages/index.tsx
git commit -m "feat(homepage): add stats counter and onboarding CTA"
```

---

## Chunk 4: Accessibility Audit

### Task 4.1: Add Focus Visible Styles

**Files:**

- Create: `app/styles/focus-visible.css`
- Modify: `app/pages/_app.tsx`

- [ ] **Step 1: Create focus-visible CSS**

```css
/* app/styles/focus-visible.css */
/* Enhanced focus styles for accessibility */

*:focus-visible {
  outline: 2px solid #0c4076;
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Skip link styles */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0c4076;
  color: white;
  padding: 8px 16px;
  z-index: 100;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

- [ ] **Step 2: Import CSS in \_app.tsx**

Add to `app/pages/_app.tsx`:

```tsx
import "@/styles/focus-visible.css";
```

- [ ] **Step 3: Commit**

```bash
git add app/styles/focus-visible.css app/pages/_app.tsx
git commit -m "feat(a11y): add focus-visible styles for accessibility"
```

---

### Task 4.2: Add ARIA Labels to Navigation

**Files:**

- Modify: `app/components/navigation/MainNav.tsx`

- [ ] **Step 1: Enhance ARIA attributes**

Update the MainNav component to include better ARIA labels:

```tsx
// In MainNav.tsx, update the nav element:
<Box
  component="nav"
  sx={{
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    gap: 1,
  }}
  role="navigation"
  aria-label="Main navigation"
>
  <ul
    style={{
      display: "flex",
      listStyle: "none",
      margin: 0,
      padding: 0,
      gap: "0.5rem",
    }}
  >
    {NAV_ITEMS.map((item) => {
      const isActive = router.pathname.startsWith(item.href.split("/")[1]);
      return (
        <li key={item.href} role="none">
          <NavItem
            href={item.href}
            label={item.label[locale]}
            isActive={isActive}
            aria-current={isActive ? "page" : undefined}
          />
        </li>
      );
    })}
  </ul>
</Box>
```

- [ ] **Step 2: Update NavItem to support aria-current**

```tsx
// In NavItem.tsx, add aria-current prop:
interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  external?: boolean;
  "aria-current"?: "page" | undefined;
}

// Apply to the link element:
aria-current={props["aria-current"]}
```

- [ ] **Step 3: Run tests to verify**

Run: `cd app && npm test -- components/navigation` Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/components/navigation/MainNav.tsx app/components/navigation/NavItem.tsx
git commit -m "feat(a11y): add ARIA labels to navigation"
```

---

### Task 4.3: Run Accessibility Audit

**Files:**

- None (audit task)

- [ ] **Step 1: Install axe-core if not present**

Run: `cd app && npm install --save-dev @axe-core/react`

- [ ] **Step 2: Run Lighthouse accessibility audit**

Run:
`npm run build && npx lighthouse http://localhost:3000 --only-categories=accessibility --output=json --output-path=./accessibility-report.json`

Expected: Accessibility score 90+

- [ ] **Step 3: Review and fix any issues found**

Review the accessibility report and address critical issues.

- [ ] **Step 4: Document accessibility baseline**

Create `docs/accessibility-baseline.md` with current scores and known issues.

---

## Final Verification

### Task 5.1: Run All Tests

- [ ] **Run full test suite**

Run: `cd app && npm test` Expected: All tests pass

### Task 5.2: Build and Verify

- [ ] **Build the application**

Run: `npm run build` Expected: Build succeeds without errors

- [ ] **Start dev server and visually verify**

Run: `npm run dev` Verify in browser:

- Navigation appears in header
- Search bar appears in header
- Stats counter appears on homepage
- Onboarding CTA appears on homepage
- Focus styles work on keyboard navigation

### Task 5.3: Final Commit

- [ ] **Create summary commit**

```bash
git add -A
git commit -m "feat: add Phase 1 foundation improvements

- Main navigation with localized items and active states
- Global search bar in header
- Statistics counter on homepage
- Onboarding CTA on homepage
- Enhanced accessibility with focus-visible styles"
```

---

## Success Criteria

| Criteria              | Target                    |
| --------------------- | ------------------------- |
| Navigation items      | 5 main sections           |
| Search                | Functional search bar     |
| Homepage enhancements | Stats + Onboarding CTA    |
| Accessibility score   | 90+ (Lighthouse)          |
| Test coverage         | All new components tested |
| Build                 | No errors                 |

---

## Notes

- Localized strings should be moved to Lingui catalogs in future phases
- Search autocomplete and results page are Phase 2 items
- Mobile navigation hamburger menu is Phase 2 item
