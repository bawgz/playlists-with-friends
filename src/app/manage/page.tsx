"use server";

import { fetchPlaylists } from "@/actions/playlists";
import { ManagementView } from "@/components/management-view";
import { AuthError, getSession, login, logout } from "@/lib/auth";

const BASE_URL = process.env.BASE_URL;

export default async function ManagePage() {
  const session = await getSession();

  if (!session?.data?.accessToken) {
    return login();
  }

  try {
    // filtering this for testing purposes...
    // TODO: new collection to select the playlists you want to manage through this app
    const playlists = await fetchPlaylists();

    return (
      <main>
        <ManagementView playlists={playlists.filter(p => p.id === "09Kpz6QL3YidOwurAzxLag")} />
      </main>
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return login();
    }

    throw error;
  }
}
