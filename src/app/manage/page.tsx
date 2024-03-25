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
    const playlists = await fetchPlaylists();

    return (
      <main>
        <ManagementView playlists={playlists} />
      </main>
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return login();
    }

    throw error;
  }
}
