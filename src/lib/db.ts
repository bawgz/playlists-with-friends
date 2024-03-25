import { PlaylistMetadata } from '@/types';
import { Firestore } from '@google-cloud/firestore';

if (!process.env.GCP_CREDENTIALS) {
  throw new Error("GCP credentials not set.");
}

const credential = JSON.parse(
  Buffer.from(process.env.GCP_CREDENTIALS, "base64").toString(),
);

const firestore = new Firestore({
  projectId: "playlists-with-friends",
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  },
});

export async function fetchPlaylistMetadata(id: string): Promise<PlaylistMetadata> {
  const doc = await firestore.collection("playlists").doc(id).get();

  console.log("doc", doc.data());
  return doc.data() as PlaylistMetadata;
}