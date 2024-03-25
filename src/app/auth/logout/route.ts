"use server";

import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

const BASE_URL = process.env.BASE_URL;

export async function GET() {
  await logout();

  return redirect(`${BASE_URL}/`);
}