// app/auth/login/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import google from "@src/../public/google.svg";
import tessLogo from "@src/../public/tess-logo-color.svg";

export default function LoginPage() {
  const router = useRouter();

  const handleGuestLogin = () => {
    // Exemplo: redireciona para dashboard sem autenticar de verdade
    router.push("/dashboard");
  };

  const handleGoogleLogin = () => {
    // Exemplo: redireciona para rota OAuth do backend (ajuste depois)
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Image src={tessLogo} alt="Tess Logo" width={250} height={50} />
      <h1 className="text-3xl font-bold text-center">
        Que bom que você voltou
      </h1>

      <button
        onClick={handleGoogleLogin}
        className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-secondary hover:text-gray-900 transition"
      >
        <Image src={google} alt="Google Logo" width={20} height={20} />
        <span>Continuar com Google</span>
      </button>

      <div className="text-gray-500 text-2xl font-semibold">ou</div>

      <button
        onClick={handleGuestLogin}
        className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
      >
        <CircleUserRound size={16} />
        <span>Continuar como convidado</span>
      </button>
    </div>
  );
}
