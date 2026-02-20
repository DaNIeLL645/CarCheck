"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);

  // Verificăm dacă utilizatorul este logat
  useEffect(() => {
    async function fetchSession() {
      const currentSession = await getSession();
      setSession(currentSession);
    }
    fetchSession();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Titlu */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-600 tracking-tight"
          >
            CarCheck
          </Link>

          {/* Linkurile din dreapta */}
          <div className="flex items-center gap-4">
            {session ? (
              // DACA ESTE LOGAT
              <>
                <span className="text-sm text-gray-500 hidden sm:block mr-4">
                  Salut, {session.user?.name || "Utilizator"}
                </span>

                {/* Butoane specifice în funcție de ROL */}
                {session.user?.role === "MECHANIC" ? (
                  <Link
                    href="/mechanic-dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Panou Mecanic
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/my-inspections"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Cererile mele
                    </Link>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                    >
                      + Cerere Nouă
                    </Link>
                  </>
                )}

                {/* Butonul de Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Deconectare
                </button>
              </>
            ) : (
              // DACA NU ESTE LOGAT
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Conectare
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
                >
                  Creează cont
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
