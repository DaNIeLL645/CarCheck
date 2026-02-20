"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { createInspection } from "@/actions/inspections";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
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

    const result = await createInspection(formData, clientId);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      // Dacă a avut succes, NU mai afișăm mesaj pe pagina asta,
      // ci redirecționăm instant pe pagina nouă de cereri!
      router.push("/my-inspections");
    }
  }

  if (!clientId) return null; // ascundem până se verifică sesiunea

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
              <p className="text-xs text-gray-500 mt-1">
                Lipește aici link-ul cu anunțul mașinii pe care vrei să o
                verificăm.
              </p>
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
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg"
            >
              Trimite Cererea
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
