"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  getMechanicAcceptedInspections,
  getMechanicStats,
} from "@/actions/inspections";
import { useRouter } from "next/navigation";

export default function MechanicDashboard() {
  const [activeInspections, setActiveInspections] = useState<any[]>([]);
  const [stats, setStats] = useState({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const session = await getSession();
      if (!session || (session.user as any).role !== "MECHANIC") {
        router.push("/login");
        return;
      }
      const mechanicId = (session.user as any).id;

      const [inspections, mechanicStats] = await Promise.all([
        getMechanicAcceptedInspections(mechanicId),
        getMechanicStats(mechanicId),
      ]);

      setActiveInspections(inspections);
      setStats(mechanicStats);
      setLoading(false);
    }
    loadData();
  }, [router]);

  if (loading)
    return <p className="text-center py-10">Se încarcă profilul...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* --- SECȚIUNEA DE PROFIL / STATISTICI --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold">
            {stats.averageRating > 0 ? "⭐" : "👨‍🔧"}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Profilul Meu de Mecanic
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-yellow-500 mr-2">
                  {stats.averageRating}
                </span>
                <span className="text-yellow-400 text-xl">
                  {"★".repeat(Math.round(stats.averageRating)) || "☆"}
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                {stats.totalReviews} recenzii primite
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLOANA STÂNGĂ: Inspecții în lucru */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🛠️ Inspecții în Curs
            </h2>
            {activeInspections.length === 0 ? (
              <p className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-gray-500">
                Nu ai nicio inspecție activă în acest moment.
              </p>
            ) : (
              <div className="space-y-4">
                {/* Aici vine codul tău existent pentru lista de inspecții ale mecanicului */}
                <p className="text-sm text-gray-400 italic">
                  Lista ta de inspecții active este aici...
                </p>
              </div>
            )}
          </div>

          {/* COLOANA DREAPTĂ: Ultimele Recenzii */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">💬 Recenzii Recente</h2>
            <div className="space-y-4">
              {stats.reviews.length === 0 ? (
                <p className="text-gray-400 text-sm italic">
                  Încă nu ai primit recenzii.
                </p>
              ) : (
                stats.reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-yellow-500 font-bold">
                        {"★".repeat(rev.rating)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "{rev.comment}"
                    </p>
                    <p className="text-xs font-bold text-gray-500">
                      — {rev.inspection.client.fullName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
