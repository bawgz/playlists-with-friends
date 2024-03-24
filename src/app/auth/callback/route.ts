import { createSession } from "@/lib/auth";

const BASE_URL = process.env.BASE_URL!;

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);


  console.log("____________________REQUEST____________________");
  console.log(searchParams);

  await createSession(searchParams.get("code") as string);
  return Response.redirect(`${BASE_URL}/`);
}