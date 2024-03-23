import { auth } from "@/auth";
import { CustomSession } from "@/types";
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

  spotifyApi.setRefreshToken(customSession.refreshToken);
  spotifyApi.setAccessToken(customSession.accessToken);
  const playlists = await spotifyApi.getUserPlaylists(customSession.accountId);

  if (playlists.statusCode !== 200) {
    throw new Error("Failed to fetch playlists");
  }

  console.log(playlists.body.items);

  return playlists.body.items;
}
