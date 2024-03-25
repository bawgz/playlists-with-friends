type ExtraAuthFields = {
  accessToken: string;
  refreshToken: string | undefined;
  expiresAt: number;
  accountId: string;
}

export type Track = {
  id: string;
  name: string;
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
    items: Track[] | null;
  },
  metadata: PlaylistMetadata | null;
}

export type PlaylistMetadata = {
  changeRequests: {
    userId: string,
    trackId: string,
    track: Track | null | undefined,
    changeType: "add" | "remove",
    status: "pending" | "approved" | "rejected",
    createdAt: string,
    votes: {
      userId: string,
      vote: "approve" | "reject"
    }[] | null
  }[]
}
