import NextAuth, { NextAuthOptions } from "next-auth";

import { ADFS } from "@/auth-providers/adfs";
import { ensureUserFromSub } from "@/db/user";
import { ADFS_ID, ADFS_ISSUER } from "@/domain/env";
import { truthy } from "@/domain/types";
import { enforceRateLimit, handleSecurityError } from "@/server/security";

import type { NextApiRequest, NextApiResponse } from "next";

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (!nextAuthSecret && isProduction) {
  throw new Error("NEXTAUTH_SECRET is required in production");
}

// Skip authentication for local development
const isDevelopment = process.env.NODE_ENV !== "production";

const providers = isDevelopment
  ? [] // No providers in development
  : [
      ADFS_ID && ADFS_ISSUER
        ? ADFS({
            wellKnown: `${ADFS_ISSUER}/.well-known/openid-configuration`,
            clientId: ADFS_ID,
            clientSecret: "", // PKCE does not require a client secret
            authorizeUrl: `${ADFS_ISSUER}/protocol/openid-connect/auth`,
            issuer: ADFS_ISSUER,
            token: `${ADFS_ISSUER}/protocol/openid-connect/token`,
            userinfo: `${ADFS_ISSUER}/protocol/openid-connect/userinfo`,
            checks: ["pkce", "state"],
            client: {
              token_endpoint_auth_method: "none",
            },
          })
        : null,
    ].filter(truthy);

// Only require providers in production
if (!isDevelopment && !providers.length) {
  throw new Error(
    "No authentication providers configured. Set ADFS_ID and ADFS_ISSUER."
  );
}

export const nextAuthOptions = {
  providers,
  secret: nextAuthSecret ?? "development-only-secret",
  callbacks: {
    /** Necessary otherwise we cannot sign out */
    jwt: async ({ token }) => {
      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) {
        if (url === "/api/auth/signout") {
          // In development, just redirect to base URL
          return isDevelopment
            ? baseUrl
            : `${ADFS_ISSUER}/protocol/openid-connect/logout?redirect_uri=${baseUrl}`;
        }
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
    /**
     * When the user is logged in, ensures it creates on our side and save its id
     * on the session.
     */
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.sub = token.sub;
        const user = await ensureUserFromSub(token.sub, token.name);
        session.user.id = user.id;
      }
      return session;
    },
  },
  debug: false,
} as NextAuthOptions;

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
    enforceRateLimit(req, res, "auth");
    await NextAuth(req, res, nextAuthOptions);
  } catch (e) {
    if (!handleSecurityError(res, e)) {
      console.error(e);
      throw e;
    }
  }
}
