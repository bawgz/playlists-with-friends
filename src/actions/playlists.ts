"use server";

import { auth } from "@/auth";
import { CustomSession, Playlist } from "@/types";
import { redirect } from "next/navigation";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.OAUTH_CALLBACK_URL,
});

export async function fetchPlaylists() {
  const session = await auth();
  console.log(session);

  if (!session?.user) {
    return redirect(`/auth/signin?callbackUrl=${process.env.BASE_URL}/manage`);
  }

  const customSession = session as CustomSession;

  spotifyApi.setAccessToken(customSession.accessToken);
  const playlists = await spotifyApi.getUserPlaylists(customSession.accountId);

  if (playlists.statusCode !== 200) {
    throw new Error("Failed to fetch playlists");
  }

  return playlists.body.items;
}

export async function fetchPlaylist(id: string): Promise<Playlist> {
  console.log("fetching playlist", id);
  const session = await auth();
  console.log(session);

  if (!session?.user) {
    return redirect(`/auth/signin?callbackUrl=${process.env.BASE_URL}/manage`);
  }

  const customSession = session as CustomSession;

  spotifyApi.setAccessToken(customSession.accessToken);
  const playlist = await spotifyApi.getPlaylist(id);

  if (playlist.statusCode !== 200) {
    console.log("playlist", playlist);
    console.log("body", playlist.body);
    throw new Error("Failed to fetch playlist");
  }

  console.log("______________playlist details_____________", playlist.body);

  const result = {
    id: playlist.body.id,
    name: playlist.body.name,
    description: playlist.body.description,
    images: playlist.body.images,
    tracks: {
      items: playlist.body.tracks.items.filter(track => track.track).map((track) => {

        return ({
          id: track.track!.id,
          title: track.track!.name,
          artist: track.track!.artists.map((artist) => artist.name).join(", "),
          album: track.track!.album.name,
          time: track.track!.duration_ms,
          durationMs: track.track!.duration_ms,
        });
      }),
      total: playlist.body.tracks.total,
    }
  };

  return result;
}
