declare global {
  type CustomSession = {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user: {
      name: string;
      email: string;
    }
  }
}
