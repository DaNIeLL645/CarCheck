"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getClientInspections } from "@/actions/inspections";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyInspectionsPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSessionAndData() {
      const session = await getSession();
      if (!session) {
        router.push("/login");
      } else {
        const id = (session.user as any).id;
        // Aducem direct datele din baza de date
        const data = await getClientInspections(id);
        setInspections(data);
        setLoading(false);
      }
    }
    fetchSessionAndData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-medium text-gray-500 animate-pulse">
          Se încarcă cererile tale...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Antetul paginii */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Cererile mele de Inspecție
          </h1>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200"
          >
            + Adaugă o cerere nouă
          </Link>
        </div>

        {/* Dacă nu are nicio cerere */}
        {inspections.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <span className="text-4xl mb-4 block">🚗</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nu ai adăugat nicio mașină încă
            </h3>
            <p className="text-gray-500 mb-6">
              Când vei solicita o verificare, ea va apărea aici.
            </p>
            <Link
              href="/dashboard"
              className="text-blue-600 font-medium hover:underline"
            >
              Începe prima verificare →
            </Link>
          </div>
        ) : (
          /* Dacă are cereri, le afișăm sub formă de carduri (Grid) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        insp.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : insp.status === "ACCEPTED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {insp.status === "PENDING"
                        ? "⏳ În așteptare"
                        : insp.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(insp.createdAt).toLocaleDateString("ro-RO")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {insp.carMake || "Mașină necunoscută"} {insp.carModel}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                    📍 {insp.location}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50">
                  <a
                    href={insp.carUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Vezi anunțul original
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
