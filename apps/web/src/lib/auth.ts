import { decodeJwt } from "jose";
import { UserSession } from "@src/@types/User";

export function getUserFromToken(): UserSession | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = decodeJwt(token);
    return {
      sub: decoded.sub ? Number(decoded.sub) : 0, // ou lance um erro se sub for obrigatório
      name: decoded.name as string,
      email: decoded.email as string,
      avatar: decoded.avatar as string,
    } satisfies UserSession;
  } catch {
    return null;
  }
}
