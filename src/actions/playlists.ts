"use server";

import { AuthError, getSession } from "@/lib/auth";
import { fetchPlaylistMetadata } from "@/lib/db";
import { BasePlaylist, Playlist } from "@/types";
import { fetchTracks } from "./tracks";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export async function fetchPlaylists(): Promise<BasePlaylist[]> {
  const session = await getSession();

  const response = await fetch(
    `${SPOTIFY_BASE_URL}/me/playlists`,
    { headers: { 'Authorization': `Bearer ${session.data.accessToken}` } }
  );

  const playlists = await response.json();

  if (response.status !== 200) {
    console.error("Failed to fetch playlists", playlists);
    if (response.status === 401) {
      throw new AuthError("Unauthorized");
    }
    throw new Error("Failed to fetch playlists");
  }

  return playlists.items;
}

export async function fetchPlaylist(id: string): Promise<Playlist> {
  const session = await getSession();

  const response = await fetch(
    `${SPOTIFY_BASE_URL}/playlists/${id}`,
    {
      headers: { 'Authorization': `Bearer ${session.data.accessToken}` },
    }
  );

  const playlist = await response.json();

  if (response.status !== 200) {
    console.error("Failed to fetch playlist", playlist);
    if (response.status === 401) {
      throw new AuthError("Unauthorized");
    }
    throw new Error("Failed to fetch playlist");
  }

  const metadata = await fetchPlaylistMetadata(id);

  if (metadata?.changeRequests && metadata.changeRequests.length > 0) {
    const trackIds = metadata.changeRequests.map((changeRequest) => changeRequest.trackId);
    const tracks = await fetchTracks(trackIds);
    metadata.changeRequests = metadata.changeRequests.map((changeRequest) => ({
      ...changeRequest,
      track: tracks.find((track) => track.id === changeRequest.trackId),
    }));
  }

  const result = {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    images: playlist.images,
    tracks: {
      items: playlist.tracks.items.filter((item: any) => item.track).map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map((artist: any) => artist.name).join(", "),
        album: item.track.album.name,
        time: item.track.duration_ms,
        durationMs: item.track.duration_ms,
      })),
      total: playlist.tracks.total,
    },
    metadata: metadata,
  };

  return result;
}
