"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import {
  getPendingInspections,
  getMechanicStats,
  acceptInspection,
} from "@/actions/inspections";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MechanicDashboard() {
  const [pendingInspections, setPendingInspections] = useState<any[]>([]);
  const [stats, setStats] = useState({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mechanicId, setMechanicId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [router]);

  async function loadData() {
    const session = await getSession();
    if (!session || (session.user as any).role !== "MECHANIC") {
      router.push("/login");
      return;
    }
    const mId = (session.user as any).id;
    setMechanicId(mId);

    // Aduce statisticile mecanicului și CERERILE NOI (PENDING) din piață
    const [pending, mechanicStats] = await Promise.all([
      getPendingInspections(),
      getMechanicStats(mId),
    ]);

    setPendingInspections(pending);
    setStats(mechanicStats);
    setLoading(false);
  }

  // Funcția prin care mecanicul preia o mașină
  const handleAcceptInspection = async (inspectionId: string) => {
    const toastId = toast.loading("Se preia comanda...");

    const res = await acceptInspection(inspectionId, mechanicId);

    if (res.success) {
      toast.success(res.success, { id: toastId });
      // Redirecționăm mecanicul direct către mașinile lui în lucru
      router.push("/mechanic-dashboard/my-tasks");
    } else {
      toast.error(res.error || "Eroare la preluare", { id: toastId });
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 font-medium text-gray-500 animate-pulse">
        Se încarcă profilul...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* --- SECȚIUNEA DE PROFIL / STATISTICI --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
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

          {/* Buton către sarcinile în lucru */}
          <Link
            href="/mechanic-dashboard/my-tasks"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-sm"
          >
            Vezi mașinile tale în lucru →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLOANA STÂNGĂ: Cereri Noi / Piața de comenzi */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              🚨 Cereri Noi (Disponibile)
            </h2>

            {pendingInspections.length === 0 ? (
              <p className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-gray-500 text-center">
                Nu există cereri noi în acest moment. Revino mai târziu!
              </p>
            ) : (
              <div className="space-y-4">
                {pendingInspections.map((req: any) => (
                  <div
                    key={req.id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-6 hover:border-blue-300 transition-colors"
                  >
                    {/* Partea de Sus: Detalii și Buton */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block">
                          CERERE NOUĂ
                        </span>
                        <h3 className="font-bold text-xl text-gray-900">
                          {req.carMake || "Mașină necunoscută"} {req.carModel}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          👤 {req.client?.fullName} • 📍 {req.location}
                        </p>
                        <a
                          href={req.carUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline font-medium mt-2 inline-block"
                        >
                          🔗 Deschide anunțul mașinii
                        </a>
                      </div>

                      <button
                        onClick={() => handleAcceptInspection(req.id)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Preia Comanda
                      </button>
                    </div>

                    {/* Partea de Jos: HARTA INTERACTIVĂ GOOGLE MAPS */}
                    <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          req.location,
                        )}&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLOANA DREAPTĂ: Ultimele Recenzii */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              💬 Recenzii Recente
            </h2>
            <div className="space-y-4">
              {stats.reviews.length === 0 ? (
                <p className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm text-center">
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
                    <p className="text-gray-700 text-sm mb-2 italic">
                      "{rev.comment}"
                    </p>
                    <p className="text-xs font-bold text-gray-500">
                      — {rev.inspection?.client?.fullName || "Client"}
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
