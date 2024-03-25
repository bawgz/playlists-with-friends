import { AuthError, getSession } from "@/lib/auth";
import { Track } from "@/types";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export async function fetchTracks(ids: string[]): Promise<Track[]> {
  const session = await getSession();

  const response = await fetch(
    `${SPOTIFY_BASE_URL}/tracks?ids=${ids.join(",")}`,
    { headers: { 'Authorization': `Bearer ${session.data.accessToken}` } }
  );

  const tracks = await response.json();

  if (response.status !== 200) {
    console.error("Failed to fetch tracks", tracks);
    if (response.status === 401) {
      throw new AuthError("Unauthorized");
    }
    throw new Error("Failed to fetch tracks");
  }

  return tracks.tracks.map((track: any) => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(", "),
    album: track.album.name,
    duration: track.duration_ms,
  }));
}