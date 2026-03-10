import { t } from "@lingui/macro";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const getNavItems = () => [
  { href: "/browse", label: t({ id: "nav.browse", message: "Browse" }) },
  { href: "/create/new", label: t({ id: "nav.create", message: "Create" }) },
  { href: "/topics", label: t({ id: "nav.topics", message: "Topics" }) },
  { href: "/gallery", label: t({ id: "nav.gallery", message: "Gallery" }) },
  { href: "/docs", label: t({ id: "nav.docs", message: "Docs" }) },
  {
    href: "/demos/showcase",
    label: t({ id: "header.demo_gallery", message: "Demo Gallery" }),
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const navItems = getNavItems();

  return (
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      <IconButton
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        sx={{ color: "white", p: 1 }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ pt: 2 }}>
          <List>
            {navItems.map((item) => {
              const basePath = "/" + item.href.split("/")[1];
              const isActive = router.pathname.startsWith(basePath);
              return (
                <ListItem key={item.href} disablePadding>
                  <Link href={item.href} passHref legacyBehavior>
                    <ListItemButton
                      component="a"
                      selected={isActive}
                      onClick={() => setOpen(false)}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
