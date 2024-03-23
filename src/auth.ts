import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

import type { NextAuthConfig } from "next-auth";
import { CustomJwt, CustomSession } from "./types";

export const config = {
  providers: [Spotify],
  basePath: "/auth",
  callbacks: {
    jwt: async ({ token, account }): Promise<CustomJwt> => {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Math.floor(Date.now() / 1000 + (account.expires_in ?? 60));
        token.accountId = account.providerAccountId;
      }

      return token as CustomJwt;
    },
    session: async ({ session, token }): Promise<CustomSession> => {
      const customJwt = token as CustomJwt;
      return { ...session, accessToken: customJwt.accessToken, refreshToken: customJwt.refreshToken, expiresAt: customJwt.expiresAt, accountId: customJwt.accountId };
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
