import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

type ExtraAuthFields = {
  accessToken: string;
  refreshToken: string | undefined;
  expiresAt: number;
  accountId: string;
}

export type CustomSession = Session & ExtraAuthFields;

export type CustomJwt = JWT & ExtraAuthFields;

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
