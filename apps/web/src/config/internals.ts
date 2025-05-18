import * as dotenv from "dotenv";

dotenv.config();

export const internals = {
  apiUrl: process.env.API_URL,
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
  isDev: process.env.NODE_ENV === "development",
} as const;
