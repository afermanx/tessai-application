"use client";

import { useEffect, useState, useRef } from "react";
import { decodeJwt } from "jose";
import { useRouter } from "next/navigation";
import { CircleUserRound, LogOut } from "lucide-react";
import { UserSession } from "@src/@types/User";

import Image from "next/image";
import logo from "@src/../public/tess-logo-color.svg";

export default function Header() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = decodeJwt(token);
        setUser({
          name: decoded.name,
          email: decoded.email,
          avatar: decoded.avatar,
        } as UserSession);
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
        router.push("/sigin");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/sigin");
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between w-full px-4 py-2 mr-5 border-b bg-background text-foreground">
      <div className="text-lg font-semibold">
        <Image src={logo} alt="Tess Logo" width={150} height={50} />
      </div>

      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none dark:text-foreground"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <CircleUserRound className="w-8 h-8" />
            )}
            <span className="text-sm">{user.name ?? "Convidado"}</span>
          </button>

          {isOpen && (
            <div className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded shadow-lg dark:bg-zinc-800 dark:border-zinc-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      ) : (
        <span className="text-sm text-muted">Não autenticado</span>
      )}
    </header>
  );
}
