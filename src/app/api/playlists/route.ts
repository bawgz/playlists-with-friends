// import { auth } from "@/auth";
// import { CustomSession } from "@/types";

// const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

// export const GET = auth(async (request) => {

//   console.log("____________________REQUEST____________________");
//   console.log(request.headers);

//   const auth = request.auth as CustomSession;
//   console.log("___________________AUTH________________________");
//   console.log(auth);

//   if (!auth?.accessToken) {
//     return Response.json({ error: "Access token not provided" }, { status: 401 });
//   }

//   const response = await fetch(
//     `${SPOTIFY_BASE_URL}/me/playlists`,
//     { headers: { 'Authorization': `Bearer ${auth.accessToken}` } }
//   );

//   const playlists = await response.json();

//   if (response.status !== 200) {
//     console.error("Failed to fetch playlists", playlists);
//     return Response.json({ error: "Failed to fetch playlists" }, { status: 500 });
//   }

//   return Response.json(playlists.items);
// });
