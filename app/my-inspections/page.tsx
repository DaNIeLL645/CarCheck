"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getClientInspections } from "@/actions/inspections";
import { getUserCredits } from "@/actions/user";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import ReviewForm from "@/components/ReviewForm";

export default function MyInspectionsPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchSessionAndData() {
      const session = await getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const id = (session.user as any).id;
      setUserId(id);

      // DACĂ VENIM DE LA STRIPE
      const isSuccess = searchParams.get("success");
      const isCanceled = searchParams.get("canceled");

      if (isSuccess) {
        // 1. Așteptăm 3 secunde ca să fim 100% siguri că Webhook-ul a terminat de salvat în baza de date
        await new Promise((resolve) => setTimeout(resolve, 3000));
        alert("Plata a fost finalizată cu succes! Creditele au fost adăugate.");

        // 2. FORȚĂM O REÎNCĂRCARE COMPLETĂ A PAGINII (Hard Reload)
        // Asta distruge complet memoria cache a browserului!
        window.location.href = "/my-inspections";
        return; // Oprim execuția aici, pagina se va reîncărca singură
      } else if (isCanceled) {
        alert("Plata a fost anulată.");
        window.location.href = "/my-inspections";
        return;
      }

      // Dacă este o accesare normală (nu venim de la plată), citim datele direct
      const [inspectionsData, userCredits] = await Promise.all([
        getClientInspections(id),
        getUserCredits(id),
      ]);

      setInspections(inspectionsData);
      setCredits(userCredits);
      setLoading(false);
    }

    fetchSessionAndData();
  }, [router, searchParams]);

  const handleBuyCredits = async (creditsToBuy: number) => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, credits: creditsToBuy }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "A apărut o eroare la plată.");
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Eroare de conexiune.");
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-medium text-gray-500 animate-pulse">
          Se încarcă panoul tău...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* PORTFOLOFEL */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Portofelul tău
              </h2>
              <p className="text-gray-500 text-sm">
                Folosește creditele pentru a solicita verificări noi.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-4 flex items-center gap-4">
              <div className="text-4xl">🎟️</div>
              <div>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                  Verificări Disponibile
                </p>
                <p className="text-3xl font-black text-gray-900">{credits}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">
              Cumpără mai multe verificări:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleBuyCredits(1)}
                disabled={isCheckingOut}
                className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <span className="font-bold text-lg text-gray-900 group-hover:text-blue-700">
                  1 Credit
                </span>
                <span className="text-gray-500">150 RON</span>
              </button>

              <button
                onClick={() => handleBuyCredits(2)}
                disabled={isCheckingOut}
                className="flex flex-col items-center justify-center p-4 border-2 border-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-left relative"
              >
                <div className="absolute -top-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  Reducere 100 lei
                </div>
                <span className="font-bold text-lg text-blue-800">
                  2 Credite
                </span>
                <span className="text-blue-600 font-medium">200 RON</span>
              </button>

              <button
                onClick={() => handleBuyCredits(3)}
                disabled={isCheckingOut}
                className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <span className="font-bold text-lg text-gray-900 group-hover:text-blue-700">
                  3 Credite
                </span>
                <span className="text-gray-500">250 RON</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Istoric Inspecții
          </h1>
          <Link
            href="/new-request"
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200"
          >
            + Solicită o Verificare Nouă
          </Link>
        </div>

        {inspections.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-5xl mb-4 block">🚗</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nu ai solicitat nicio verificare încă
            </h3>
            <p className="text-gray-500 mb-6">
              Asigură-te că ai credite disponibile și adaugă prima mașină.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4 border-b pb-4">
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                        insp.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : insp.status === "ACCEPTED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {insp.status === "PENDING"
                        ? "⏳ În așteptare"
                        : insp.status === "ACCEPTED"
                          ? "👨‍🔧 Acceptată (În lucru)"
                          : "✅ Finalizată"}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {insp.carMake || "Mașină necunoscută"} {insp.carModel}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      📍 {insp.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400 block mb-2">
                      {new Date(insp.createdAt).toLocaleDateString("ro-RO")}
                    </span>
                    <a
                      href={insp.carUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Vezi anunțul original ↗
                    </a>
                  </div>
                </div>

                {insp.status === "COMPLETED" && (
                  <div className="mt-2 bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        📋 Raport Inspecție
                      </h4>
                      <DownloadPdfButton inspection={insp} />
                    </div>

                    {insp.reportDetails && (
                      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <h5 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                          1. Concluzii Mecanic
                        </h5>
                        <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                          {insp.reportDetails}
                        </p>
                      </div>
                    )}

                    {insp.photosUrls && (
                      <div className="mb-6">
                        <h5 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                          2. Galerie Foto
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {insp.photosUrls
                            .split(",")
                            .map((url: string, index: number) => (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                              >
                                <img
                                  src={url}
                                  alt={`Poza ${index + 1}`}
                                  className="w-full h-24 object-cover"
                                />
                              </a>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {insp.engineMediaUrl && (
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
                          <h5 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                            3. Sunet Motor
                          </h5>
                          <video
                            controls
                            className="w-full h-auto rounded-md border border-gray-200 max-h-32"
                          >
                            <source src={insp.engineMediaUrl} />
                          </video>
                        </div>
                      )}
                      {insp.diagnosticUrl && (
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                          <h5 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                            4. Diagnoză
                          </h5>
                          <a
                            href={insp.diagnosticUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium hover:bg-yellow-200 w-full"
                          >
                            📄 Deschide
                          </a>
                        </div>
                      )}
                      {insp.model3dUrl && (
                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                          <h5 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                            5. Scanare 3D
                          </h5>
                          <a
                            href={insp.model3dUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 w-full"
                          >
                            🧊 Descarcă
                          </a>
                        </div>
                      )}
                    </div>

                    {insp.mechanicId && (
                      <ReviewForm
                        inspectionId={insp.id}
                        mechanicId={insp.mechanicId}
                        hasReviewed={false}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
