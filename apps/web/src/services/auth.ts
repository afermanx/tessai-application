import api from "@src/lib/api";

export async function loginAsGuest() {
  const response = await api.post("/auth/guest");

  console.log(response.data);
  return response.data;
}

export function loginWithGoogle() {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}

export async function getProfile(token: string) {
  const { data } = await api.get("/auth/me");
  return data;
}
