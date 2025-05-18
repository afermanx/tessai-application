"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.push("/chat");
    } else {
      alert("Erro ao autenticar com Google");
      router.push("/login");
    }
  }, [searchParams, router]);

  return <p>Acessando...</p>;
}
