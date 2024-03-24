import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

import type { NextAuthConfig } from "next-auth";
import { CustomJwt, CustomSession } from "./types";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: CustomJwt): Promise<CustomJwt> {
  if (!token.refreshToken) {
    return {
      ...token,
      error: "NoRefreshToken",
    }
  }
  try {
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: process.env.AUTH_SPOTIFY_ID!,
      }),
    };

    const response = await fetch(url, payload);
    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    console.log("Refreshed access token", refreshedTokens);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    }
  } catch (error) {
    console.error("Failed to refresh access token", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const config = {
  providers: [Spotify],
  basePath: "/auth",
  callbacks: {
    jwt: async ({ token, account, user }): Promise<CustomJwt> => {
      console.log("calling jwt");
      if (account && account.access_token && user) {

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: Date.now() + (account.expires_in ?? 0) * 1000,
          accountId: account.providerAccountId,
        }
      }

      const customToken = token as CustomJwt;
      // Return previous token if the access token has not expired yet
      if (Date.now() < customToken.expiresAt) {
        return customToken
      }

      return refreshAccessToken(customToken);
    },
    session: async ({ session, token }): Promise<CustomSession> => {
      console.log("calling session");
      const customJwt = token as CustomJwt;
      return { ...session, accessToken: customJwt.accessToken, refreshToken: customJwt.refreshToken, expiresAt: customJwt.expiresAt, accountId: customJwt.accountId };
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
