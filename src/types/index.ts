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

export type BasePlaylist = {
  id: string;
  name: string;
  description: string | null;
  images: { url: string }[];
  tracks: {
    total: number;
  }
}

export type Playlist = BasePlaylist & {
  tracks: {
    items: Song[] | null;
  }
}
