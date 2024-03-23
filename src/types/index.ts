import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export type CustomSession = Session & {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  accountId: string;
}

export type CustomJwt = JWT & {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  accountId: string;
}
