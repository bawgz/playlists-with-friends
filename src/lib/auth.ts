import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const AUTH_SECRET = process.env.AUTH_SECRET!;
const CLIENT_ID = process.env.AUTH_SPOTIFY_ID!;
const CLIENT_SECRET = process.env.AUTH_SPOTIFY_SECRET!;
const BASE_URL = process.env.BASE_URL!;

const REDIRECT_URL = `${BASE_URL}/auth/callback`;

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const key = new TextEncoder().encode(AUTH_SECRET);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 days from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login() {
  redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user-read-email,playlist-modify-public,playlist-modify-private,playlist-read-private,playlist-read-collaborative,user-library-read&redirect_uri=${REDIRECT_URL}&state=12345`);
}

export async function createSession(code: string) {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`
    },
    body: new URLSearchParams({
      'grant_type': 'authorization_code',
      'code': code, // replace 'redacted' with your actual value
      'redirect_uri': REDIRECT_URL,
      'client_id': CLIENT_ID, // replace 'redacted' with your actual value
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  const sessionDetails = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  // Create the session
  const expires = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ data: sessionDetails });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession(request: NextRequest | null = null) {
  let session = cookies().get("session")?.value;

  if (request) {
    session = request.cookies.get("session")?.value;
  }

  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  // Refresh the session so it doesn't expire
  let parsed = await getSession(request);

  if (!parsed) {
    return;
  }

  if (parsed.data.expiresAt < Date.now()) {
    parsed = await refreshAccessToken(parsed);
  }

  if (parsed.error) {
    // don't overwrite the cookie when there's been an error
    return NextResponse.next();
  }

  const expires = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires,
  });
  return res;
}

async function refreshAccessToken(token: any): Promise<any> {
  if (!token.data.refreshToken) {
    return {
      ...token,
      error: "NoRefreshToken",
    }
  }
  try {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.data.refreshToken,
        client_id: CLIENT_ID,
      }),
    };

    const response = await fetch(SPOTIFY_TOKEN_URL, payload);
    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    console.log("Refreshed access token", refreshedTokens);

    const data = {
      ...token.data,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.data.refreshToken, // Fall back to old refresh token
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    }

    return {
      ...token,
      data,
    }
  } catch (error) {
    console.error("Failed to refresh access token", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
