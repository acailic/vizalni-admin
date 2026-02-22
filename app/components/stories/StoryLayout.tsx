import { useLingui } from "@lingui/react";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";

interface StoryLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function StoryLayout({
  title,
  description,
  children,
}: StoryLayoutProps) {
  const { i18n } = useLingui();
  const locale = i18n.locale || "en";

  return (
    <>
      <Head>
        <title>{title} | Vizualni Admin</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <NextLink href="/" passHref legacyBehavior>
              <Link underline="hover" color="inherit">
                {locale.startsWith("sr") ? "Početna" : "Home"}
              </Link>
            </NextLink>
            <NextLink href="/stories" passHref legacyBehavior>
              <Link underline="hover" color="inherit">
                {locale.startsWith("sr") ? "Priče" : "Stories"}
              </Link>
            </NextLink>
            <Typography color="text.primary">{title}</Typography>
          </Breadcrumbs>
        </Box>

        {children}
      </Container>
    </>
  );
}
