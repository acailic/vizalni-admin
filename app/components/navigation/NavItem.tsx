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
  const ariaCurrent = isActive ? ("page" as const) : undefined;

  if (external) {
    return (
      <Box
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-current={ariaCurrent}
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
        aria-current={ariaCurrent}
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
