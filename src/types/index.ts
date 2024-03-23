import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export type CustomSession = Session & {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  accountId: string;
}

export type CustomJwt = JWT & {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  accountId: string;
}

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
}

export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  images: { url: string }[];
  tracks: {
    total: number;
    items: Song[] | null;
  }
}
