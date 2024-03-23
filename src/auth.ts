import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

import type { NextAuthConfig } from "next-auth";

type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    name: string;
    email: string;
  }
}

export const config = {
  providers: [Spotify],
  basePath: "/auth",
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Math.floor(Date.now() / 1000 + (account.expires_in ?? 60));
        token.accountId = account.providerAccountId;
      }

      return token
    },
    session: async ({ session, token, user }) => {
      return { ...session, accessToken: token.accessToken, refreshToken: token.refreshToken, expiresAt: token.expiresAt, accountId: token.accountId }
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config);
