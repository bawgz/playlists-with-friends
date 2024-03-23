"use server";

import { fetchPlaylists } from "@/actions/playlists";
import { auth } from "@/auth";
import { PlaylistManager } from "@/components/playlist-manager";
import { redirect } from "next/navigation";

export default async function ManagePage() {
  const session = await auth();

  if (!session?.user) redirect("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fmanage");

  const playlists = await fetchPlaylists();

  return (
    <main>
      <PlaylistManager playlists={playlists} />
    </main>
  );
}
