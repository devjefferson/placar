"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo-veterano.svg" alt="Veterano FC" width={32} height={32} className="w-8 h-8" />
              <span className="font-bold text-xl text-gray-900">Veterano FC</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium${pathname === "/" ? " font-bold" : ""}`}
            >
              Início
            </Link>
            <Link
              href="/dashboard"
              className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium${pathname === "/dashboard" ? " font-bold" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              href="/public"
              className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium${pathname === "/public" ? " font-bold" : ""}`}
            >
              Ranking
            </Link>
            {!isLoading && (
              isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm font-semibold"
                >
                  Entrar / Cadastrar
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 