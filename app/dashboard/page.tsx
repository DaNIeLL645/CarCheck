"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { createInspection } from "@/actions/inspections";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (!session) {
        router.push("/login");
      } else {
        setClientId((session.user as any).id);
      }
    }
    fetchSession();
  }, [router]);

  async function handleSubmit(formData: FormData) {
    if (!clientId) return;
    setError(null);
    setIsLoading(true);

    // 1. Salvăm cererea în baza noastră de date
    const result = await createInspection(formData, clientId);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success && result.inspectionId) {
      // 2. Apelăm API-ul nostru de Stripe pentru a genera link-ul de plată
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inspectionId: result.inspectionId }),
        });

        const data = await res.json();

        if (data.url) {
          // 3. Aruncăm clientul pe pagina oficială de la Stripe!
          window.location.href = data.url;
        } else {
          setError(data.error || "A apărut o eroare la inițializarea plății.");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Eroare de conexiune la serverul de plăți.");
        setIsLoading(false);
      }
    }
  }

  if (!clientId) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Cere o Inspecție Nouă
          </h1>
          <Link
            href="/my-inspections"
            className="text-blue-600 font-medium hover:underline text-sm"
          >
            Vezi cererile tale →
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {error && (
            <p className="text-red-500 text-sm mb-6 bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Link Anunț (obligatoriu)
              </label>
              <input
                type="url"
                name="carUrl"
                required
                placeholder="https://autovit.ro/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  name="carMake"
                  placeholder="ex: Volkswagen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Modelul
                </label>
                <input
                  type="text"
                  name="carModel"
                  placeholder="ex: Golf 7"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Locație (Oraș) - obligatoriu
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="ex: București"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading
                ? "⏳ Se redirecționează către Stripe..."
                : "💳 Plătește și Trimite Cererea (150 RON)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
