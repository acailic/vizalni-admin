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
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        gap: 1,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const basePath = "/" + item.href.split("/")[1];
        const isActive = router.pathname.startsWith(basePath);
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
