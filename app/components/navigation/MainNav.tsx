// app/components/navigation/MainNav.tsx
import { Box } from "@mui/material";
import { useRouter } from "next/router";

import { NavItem } from "./NavItem";

type Locale = "en" | "sr-Latn" | "sr-Cyrl";

interface MainNavProps {
  locale?: Locale;
}

const NAV_ITEMS: { href: string; label: Record<Locale, string> }[] = [
  {
    href: "/browse",
    label: { en: "Browse", "sr-Latn": "Pretraga", "sr-Cyrl": "Претрага" },
  },
  {
    href: "/create/new",
    label: { en: "Create", "sr-Latn": "Kreiraj", "sr-Cyrl": "Креирај" },
  },
  {
    href: "/topics",
    label: { en: "Topics", "sr-Latn": "Teme", "sr-Cyrl": "Теме" },
  },
  {
    href: "/gallery",
    label: { en: "Gallery", "sr-Latn": "Galerija", "sr-Cyrl": "Галерија" },
  },
  {
    href: "/docs",
    label: {
      en: "Docs",
      "sr-Latn": "Dokumentacija",
      "sr-Cyrl": "Документација",
    },
  },
];

export function MainNav({ locale = "en" }: MainNavProps) {
  const router = useRouter();

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
        {NAV_ITEMS.map((item) => {
          const basePath = "/" + item.href.split("/")[1];
          const isActive = router.pathname.startsWith(basePath);
          return (
            <Box component="li" role="none" key={item.href}>
              <NavItem
                href={item.href}
                label={item.label[locale]}
                isActive={isActive}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
