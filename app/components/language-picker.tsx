import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";

import { Icon } from "@/icons";
import type { Locale } from "@/locales/locales";
import localeConfig from "@/locales/locales.json";
import { useLocale } from "@/locales/use-locale";
import { persistAppLocale } from "@/utils/app-locale";
import { isStaticExportMode } from "@/utils/public-paths";

// Simple Language/Globe icon component
const LanguageIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
      fill="currentColor"
    />
  </svg>
);

interface LocaleInfo {
  code: string;
  label: string;
  flag: string;
}

const LOCALE_INFO: Record<string, LocaleInfo> = {
  "sr-Latn": {
    code: "sr-Latn",
    label: "Srpski (Latinica)",
    flag: "🇷🇸",
  },
  "sr-Cyrl": {
    code: "sr-Cyrl",
    label: "Српски (Ћирилица)",
    flag: "🇷🇸",
  },
  en: {
    code: "en",
    label: "English",
    flag: "🇬🇧",
  },
};

export const buildStaticLocaleChangeUrl = (
  currentHref: string,
  locale: Locale
) => {
  const nextUrl = new URL(currentHref);
  nextUrl.searchParams.set("uiLocale", locale);
  return nextUrl.toString();
};

export const LanguagePicker = () => {
  const currentLocale = useLocale();
  const { push, pathname, query, locales: routerLocales } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleChange = (locale: Locale) => {
    persistAppLocale(locale);

    if (isStaticExportMode) {
      // In static mode, preserve the current full URL so GitHub Pages base paths
      // and any already-resolved locale/static segments remain intact.
      window.location.assign(
        buildStaticLocaleChangeUrl(window.location.href, locale)
      );
      handleClose();
      return;
    }

    // Dynamic mode: use Next.js i18n routing
    if (Array.isArray(routerLocales) && routerLocales.length > 0) {
      push({ pathname, query }, undefined, { locale });
      handleClose();
      return;
    }

    const nextQuery = {
      ...query,
      uiLocale: locale,
    };

    push({ pathname, query: nextQuery }, undefined, {
      shallow: false,
      scroll: false,
    });
    handleClose();
  };

  const currentLocaleInfo =
    LOCALE_INFO[currentLocale] || LOCALE_INFO["sr-Latn"];

  return (
    <Box>
      <Button
        id="language-picker-button"
        aria-controls={open ? "language-picker-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label={`Language selector. Current language: ${currentLocaleInfo.label}`}
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        endIcon={<Icon name="chevronDown" size={20} />}
        sx={{
          color: "white",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span aria-hidden="true">{currentLocaleInfo.flag}</span>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {currentLocaleInfo.label}
          </Typography>
        </Box>
      </Button>
      <Menu
        id="language-picker-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-picker-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {localeConfig.locales.map((locale) => {
          const localeInfo = LOCALE_INFO[locale];
          if (!localeInfo) return null;

          return (
            <MenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale as Locale)}
              selected={locale === currentLocale}
              sx={{
                minWidth: 200,
                gap: 1.5,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>
                {localeInfo.flag}
              </span>
              <Typography variant="body2">{localeInfo.label}</Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
