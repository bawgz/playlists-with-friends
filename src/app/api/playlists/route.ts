import { auth } from "@/auth";

export const GET = auth(async (request) => {
  console.log(request.auth);

  return Response.json({ ooh: "yeah" });
});
