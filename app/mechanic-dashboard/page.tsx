"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getPendingInspections, acceptInspection } from "@/actions/inspections";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function MechanicDashboard() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mechanicId, setMechanicId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSessionAndData() {
      const session = await getSession();

      // Dacă nu e logat sau NU are rolul de MECANIC, îl dăm afară de pe pagină
      if (!session || (session.user as any).role !== "MECHANIC") {
        toast.error(
          "Acces interzis! Această pagină este doar pentru mecanici.",
        );
        router.push("/");
        return;
      }

      const id = (session.user as any).id;
      setMechanicId(id);

      // Aducem cererile din baza de date
      const data = await getPendingInspections();
      setInspections(data);
      setLoading(false);
    }
    fetchSessionAndData();
  }, [router]);

  const handleAccept = async (inspectionId: string) => {
    if (!mechanicId) return;

    // Arătăm o notificare de încărcare cât timp comunică cu baza de date
    const loadingToast = toast.loading("Se preia inspecția...");

    const result = await acceptInspection(inspectionId, mechanicId);

    // Ștergem notificarea de încărcare
    toast.dismiss(loadingToast);

    if (result.success) {
      // Ștergem mașina de pe ecran (pentru că nu mai e PENDING)
      setInspections((prev) => prev.filter((insp) => insp.id !== inspectionId));
      toast.success("Ai preluat inspecția cu succes! 🎉");
    } else {
      toast.error("Eroare la acceptare.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-medium text-gray-500 animate-pulse">
          Se caută cereri noi...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-200 pb-4">
          🔧 Panou Mecanic - Cereri Noi
        </h1>

        {inspections.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <span className="text-4xl mb-4 block">☕</span>
            <h3 className="text-lg font-medium text-gray-900">
              Nu sunt cereri noi momentan
            </h3>
            <p className="text-gray-500">
              Relaxează-te, te anunțăm când apar mașini de verificat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-200">
                      NOU - ÎN AȘTEPTARE
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(insp.createdAt).toLocaleDateString("ro-RO")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {insp.carMake || "Mașină necunoscută"} {insp.carModel}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                    📍 {insp.location}
                  </p>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                    <p className="text-sm text-gray-600">
                      👤 Client:{" "}
                      <span className="font-semibold text-gray-900">
                        {insp.client?.fullName}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <a
                    href={insp.carUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm"
                  >
                    Vezi Anunțul
                  </a>
                  <button
                    onClick={() => handleAccept(insp.id)}
                    className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm"
                  >
                    Acceptă / Preia
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
