"use client";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import google from "@src/../public/google.svg";
import tessLogo from "@src/../public/tess-logo-color.svg";
import { loginAsGuest, loginWithGoogle } from "@src/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const handleGuestLogin = async () => {
    try {
      const response = await loginAsGuest();
      const token = response.token;
      localStorage.setItem("token", token);
      router.push("/chat");
    } catch (error) {
      console.error("Erro ao logar como convidado:", error);
      alert("Erro ao fazer login como convidado");
    }
  };
  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <Image src={tessLogo} alt="Tess Logo" width={250} height={50} />
      <h1 className="text-3xl font-bold text-center">Acessar com </h1>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full max-w-sm gap-2 px-4 py-2 transition border border-gray-300 rounded-md cursor-pointer hover:bg-secondary hover:text-gray-900"
      >
        <Image src={google} alt="Google Logo" width={20} height={20} />
        <span>Continuar com Google</span>
      </button>

      <div className="text-2xl font-semibold text-gray-500">ou</div>

      <button
        onClick={handleGuestLogin}
        className="flex items-center justify-center w-full max-w-sm gap-2 px-4 py-2 text-white transition bg-black rounded-md cursor-pointer hover:bg-gray-800"
      >
        <CircleUserRound size={16} />
        <span>Continuar como convidado</span>
      </button>
    </div>
  );
}
