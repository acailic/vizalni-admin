import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import { signIn, useSession } from "next-auth/react";

import { Footer } from "@/components/footer";
import { AppLayout } from "@/components/layout";
import type { User } from "@/db/prisma-types";
import { getSignInProvider } from "@/login/auth";
import { ProfileContentTabs } from "@/login/components/profile-content-tabs";
import { ProfileHeader } from "@/login/components/profile-header";
import { useRootStyles } from "@/login/utils";
import {
  getDatasetBrowserPath,
  supportsAuthSessionRoutes,
} from "@/utils/public-paths";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const rootClasses = useRootStyles();

  if (status === "loading") {
    return null;
  }

  if (!session?.user?.id) {
    return (
      <AppLayout>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 4,
          }}
        >
          <Box sx={{ maxWidth: 520, textAlign: "center" }}>
            <Typography variant="h2" gutterBottom>
              {supportsAuthSessionRoutes
                ? "Sign in to manage your visualizations"
                : "Profile is unavailable on this deployment"}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              {supportsAuthSessionRoutes
                ? "Your drafts, published charts, and saved palettes are available after authentication."
                : "Static deployments do not include authentication, saved charts, or user profile APIs."}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {supportsAuthSessionRoutes ? (
                <Button
                  variant="contained"
                  onClick={() =>
                    signIn(getSignInProvider(window.location.host))
                  }
                >
                  Sign in
                </Button>
              ) : (
                <Button
                  component={NextLink}
                  href={getDatasetBrowserPath()}
                  variant="contained"
                >
                  Explore visualizations
                </Button>
              )}
              <Button component={NextLink} href="/" variant="text">
                Back home
              </Button>
            </Box>
          </Box>
        </Box>
        <Footer />
      </AppLayout>
    );
  }

  const user = session.user as User;

  return (
    <AppLayout>
      <Box className={rootClasses.root}>
        <ProfileHeader user={user} />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <ProfileContentTabs userId={user.id} />
        </Box>
      </Box>
      <Footer />
    </AppLayout>
  );
};

export default ProfilePage;
