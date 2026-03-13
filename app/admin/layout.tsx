"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const session = await getSession();

      // Verificăm dacă utilizatorul NU este logat sau NU are rolul de ADMIN
      if (!session || (session.user as any).role !== "ADMIN") {
        router.push("/"); // Îl dăm afară către pagina principală
      } else {
        setIsAuthorized(true); // Îi dăm acces
      }
    }

    checkAdmin();
  }, [router]);

  // Cât timp verificăm în spate cine este, afișăm un mesaj de încărcare
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-medium text-gray-500 animate-pulse">
          🔐 Se verifică permisiunile...
        </p>
      </div>
    );
  }

  // Dacă a trecut de verificare, afișăm conținutul (children) + un mic meniu de navigație pentru Admin
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">👑 Admin Panel</h1>
          <div className="space-x-4 text-sm font-medium">
            <Link
              href="/admin"
              className="hover:text-blue-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/add-mechanic"
              className="hover:text-blue-400 transition-colors"
            >
              Adaugă Mecanic
            </Link>
            <Link href="/" className="hover:text-red-400 transition-colors">
              Ieși spre site
            </Link>
          </div>
        </div>
      </nav>

      {/* Aici va fi injectată pagina specifică pe care o accesează adminul */}
      <main className="p-8">{children}</main>
    </div>
  );
}
