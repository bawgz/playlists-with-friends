"use server";

import { fetchPlaylists } from "@/actions/playlists";
import { PlaylistManager } from "@/components/playlist-manager";
import { getSession, login } from "@/lib/auth";

export default async function ManagePage() {
  const session = await getSession();

  if (!session?.data?.accessToken) {
    return login();
  }

  const playlists = await fetchPlaylists();

  return (
    <main>
      <PlaylistManager playlists={playlists} />
    </main>
  );
}
