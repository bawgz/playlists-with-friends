import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.OAUTH_CALLBACK_URL,
});

export async function fetchPlaylists() {
  const session = (await auth()) as CustomSession;
  console.log(session);

  if (!session?.user) {
    return redirect("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fmanage");
  }
  spotifyApi.setRefreshToken(session.refreshToken);
  spotifyApi.setAccessToken(session.accessToken);
  const playlists = await spotifyApi.getUserPlaylists("luke.boggs");

  if (playlists.statusCode !== 200) {
    throw new Error("Failed to fetch playlists");
  }

  console.log(playlists.body.items);

  return playlists.body.items;
}
