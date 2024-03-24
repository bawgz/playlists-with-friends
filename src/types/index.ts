type ExtraAuthFields = {
  accessToken: string;
  refreshToken: string | undefined;
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
