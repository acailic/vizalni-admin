import { t } from "@lingui/macro";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

import { NavItem } from "./NavItem";

type Locale = "en" | "sr-Latn" | "sr-Cyrl";

interface MainNavProps {
  locale?: Locale;
}

const getNavItems = () => [
  {
    href: "/browse",
    label: t({ id: "nav.browse", message: "Browse" }),
  },
  {
    href: "/create/new",
    label: t({ id: "nav.create", message: "Create" }),
  },
  {
    href: "/topics",
    label: t({ id: "nav.topics", message: "Topics" }),
  },
  {
    href: "/gallery",
    label: t({ id: "nav.gallery", message: "Gallery" }),
  },
  {
    href: "/docs",
    label: t({ id: "nav.docs", message: "Docs" }),
  },
];

export function MainNav({ locale = "en" }: MainNavProps) {
  const router = useRouter();
  const navItems = getNavItems();

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Main navigation"
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        component="ul"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          listStyle: "none",
          m: 0,
          p: 0,
        }}
      >
        {navItems.map((item) => {
          const basePath = "/" + item.href.split("/")[1];
          const isActive = router.pathname.startsWith(basePath);
          return (
            <Box component="li" role="none" key={item.href}>
              <NavItem
                href={item.href}
                label={item.label}
                isActive={isActive}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
