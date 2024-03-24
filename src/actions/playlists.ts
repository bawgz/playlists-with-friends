"use server";

import { auth } from "@/auth";
import { CustomSession, Playlist } from "@/types";
import { redirect } from "next/navigation";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export async function fetchPlaylists() {
  const session = await auth();

  if (!session?.user) {
    return redirect(`/auth/signin?callbackUrl=${process.env.BASE_URL}/manage`);
  }

  const customSession = session as CustomSession;

  const response = await fetch(
    `${SPOTIFY_BASE_URL}/me/playlists`,
    { headers: { 'Authorization': `Bearer ${customSession.accessToken}` } }
  );

  const playlists = await response.json();

  if (response.status !== 200) {
    console.error("Failed to fetch playlists", playlists);
    throw new Error("Failed to fetch playlists");
  }

  console.log("Fetched playlists", playlists.total);

  return playlists.items;
}

export async function fetchPlaylist(id: string): Promise<Playlist> {
  const session = await auth();

  if (!session?.user) {
    return redirect(`/auth/signin?callbackUrl=${process.env.BASE_URL}/manage`);
  }

  const customSession = session as CustomSession;

  const response = await fetch(
    `${SPOTIFY_BASE_URL}/playlists/${id}`,
    { headers: { 'Authorization': `Bearer ${customSession.accessToken}` } }
  );

  const playlist = await response.json();

  if (response.status !== 200) {
    console.error("Failed to fetch playlist", playlist);
    throw new Error("Failed to fetch playlist");
  }

  console.log("Fetched playlist", playlist.tracks.items);

  const result = {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    images: playlist.images,
    tracks: {
      items: playlist.tracks.items.filter((item: any) => item.track).map((item: any) => {

        return ({
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists.map((artist: any) => artist.name).join(", "),
          album: item.track.album.name,
          time: item.track.duration_ms,
          durationMs: item.track.duration_ms,
        });
      }),
      total: playlist.tracks.total,
    }
  };

  return result;
}
