# Professionalize Public Pages Implementation Plan

**Goal:** Enhance public pages to match visualize.admin.ch's professional level
**Architecture:** Add new footer component, version display utility, integrate
into homepage **Tech Stack:** React, Next.js, TypeScript, MUI, Lingui

---

## Task 1: Create Professional Footer Component

**Files:**

- Create: `app/components/homepage/HomepageFooter.tsx`
- Create: `app/utils/version-info.ts`
- Test: `app/components/homepage/HomepageFooter.test.tsx`

- [ ] **Step 1: Write failing test for HomepageFooter**

```typescript
// app/components/homepage/HomepageFooter.test.tsx
import { render, screen } from "@testing-library/react";
import { HomepageFooter } from "./HomepageFooter";

jest.mock("@/utils/version-info", () => ({
  version: "0.1.0-beta.1",
  gitCommitHash: "abc123def456",
}));

describe("HomepageFooter", () => {
  it("renders footer sections", () => {
    render(<HomepageFooter />);

    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Stay Informed")).toBeInTheDocument();
    expect(screen.getByText("Further Information")).toBeInTheDocument();
  });

  it("renders version link", () => {
    render(<HomepageFooter />);
    expect(screen.getByText(/v0\.1\.0-beta\.1/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="HomepageFooter.test.tsx"` Expected: FAIL
with "Cannot find module"

- [ ] **Step 3: Create version-info utility**

```typescript
// app/utils/version-info.ts
// This file is generated at build time with commit hash
export const version = process.env.npm_package_version || "0.1.0-beta.1";
export const gitCommitHash =
  process.env.GIT_COMMIT_HASH ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  "development";
```

- [ ] **Step 4: Create HomepageFooter component**

```typescript
// app/components/homepage/HomepageFooter.tsx
import { Box, IconButton, Link, Typography } from "@mui/material";
import { ContentWrapper } from "@/components/content-wrapper";
import { Icon } from "@/icons";
import { version, gitCommitHash } from "@/utils/version-info";

const GITHUB_REPO_URL = "https://github.com/acailic/vizualni-admin";

export const HomepageFooter = () => {
  const commitUrl = `${GITHUB_REPO_URL}/commit/${gitCommitHash}`;
  const shortHash = gitCommitHash?.slice(0, 7) || "dev";

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: 6,
        backgroundColor: "background.paper",
      }}
    >
      <ContentWrapper>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 6,
            mb: 4,
          }}
        >
          {/* About Us Section */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vizualni Admin allows you to visualize Serbia's Open Government
              Data. Browse datasets, create interactive charts, and embed
              visualizations.
            </Typography>
          </Box>

          {/* Stay Informed Section */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Stay Informed
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                component="a"
                href="https://youtube.com/@vizualni"
                target="_blank"
                size="small"
                aria-label="YouTube"
              >
                <Icon name="youtube" />
              </IconButton>
              <IconButton
                component="a"
                href="mailto:info@vizualni.rs"
                size="small"
                aria-label="Email"
              >
                <Icon name="mail" />
              </IconButton>
            </Box>
          </Box>

          {/* Further Information Section */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Further Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="https://data.gov.rs" target="_blank" variant="body2">
                Data Portal
              </Link>
              <Link href="/tutorials" variant="body2">
                Tutorials
              </Link>
              <Link href="/statistics" variant="body2">
                Statistics
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom Links */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            pt: 4,
            borderTop: "1px solid",
            borderColor: "divider",
            flexWrap: "wrap",
          }}
        >
          <Link href={commitUrl} target="_blank" variant="body2">
            v{version} ({shortHash})
          </Link>
          <Link href="/imprint" variant="body2">
            Imprint
          </Link>
          <Link href="/legal-framework" variant="body2">
            Legal Framework
          </Link>
        </Box>
      </ContentWrapper>
    </Box>
  );
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- --testPathPattern="HomepageFooter.test.tsx"` Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/components/homepage/HomepageFooter.tsx app/components/homepage/HomepageFooter.test.tsx app/utils/version-info.ts
git commit -m "$(cat <<'EOF'
feat: add professional footer with version display

- 3-column footer with About Us, Stay Informed, Further Information
- Version display linked to GitHub commit
- Follows visualize.admin.ch design pattern

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Integrate Footer into Homepage

**Files:**

- Modify: `app/pages/index.tsx`
- Modify: `app/homepage/index.ts`

- [ ] **Step 1: Update homepage index.ts to export footer**

```typescript
// app/homepage/index.ts - add export
export { HomepageFooter } from "./HomepageFooter";
```

- [ ] **Step 2: Update pages/index.tsx to include footer**

```typescript
// app/pages/index.tsx - add footer import and render
import { HomepageFooter } from "@/homepage";

// Add after the ContentMDXProvider closing tag
```

- [ ] **Step 3: Verify homepage renders correctly**

Run: `npm run dev` Navigate to http://localhost:3000 Expected: Footer visible at
bottom of page

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.tsx app/homepage/index.ts
git commit -m "$(cat <<'EOF'
feat: integrate professional footer into homepage

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Improve Header with Language Selector

**Files:**

- Modify: `app/components/navigation/NavBar.tsx`
- Modify: `app/components/navigation/MainNav.tsx`

- [ ] **Step 1: Add language selector to NavBar**

Add language dropdown similar to reference site with EN/SR options.

- [ ] **Step 2: Add sign in button placeholder**

Add Sign in button to header (even if non-functional for now).

- [ ] **Step 3: Test header changes**

- [ ] **Step 4: Commit**

---

## Task 4: Visual Polish - Spacing and Typography

**Files:**

- Modify: `app/homepage/intro.tsx`
- Modify: `app/homepage/tutorial.tsx`
- Modify: `app/homepage/actions.tsx`

- [ ] **Step 1: Improve Intro component spacing**

Match reference site's hero section spacing.

- [ ] **Step 2: Improve Tutorial cards**

Add icons/illustrations to tutorial steps.

- [ ] **Step 3: Improve Actions layout**

Better visual grouping and spacing.

- [ ] **Step 4: Test visual changes**

- [ ] **Step 5: Commit**

---

## Task 5: Add Maintenance Notice System

**Files:**

- Create: `app/components/maintenance-notice.tsx`
- Modify: `app/pages/_app.tsx`

- [ ] **Step 1: Create maintenance notice component**

Alert banner for maintenance notifications.

- [ ] **Step 2: Integrate into app layout**

- [ ] **Step 3: Test**

- [ ] **Step 4: Commit**

---

## Execution Handoff

After saving plan: Ready to execute?
