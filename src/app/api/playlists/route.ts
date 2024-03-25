import { getSession } from "@/lib/auth";
import { NextRequest } from "next/server";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await getSession(request);

  console.log("auth", auth);

  const response = await fetch(
    `${SPOTIFY_BASE_URL}/me/playlists`,
    { headers: { 'Authorization': `Bearer ${auth.data.accessToken}` } }
  );

  const playlists = await response.json();

  if (response.status !== 200) {
    console.error("Failed to fetch playlists", playlists);
    return Response.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }

  return Response.json(playlists.items);
};
