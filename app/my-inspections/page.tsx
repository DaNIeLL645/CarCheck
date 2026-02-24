"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getClientInspections } from "@/actions/inspections";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Importăm butonul de PDF
import DownloadPdfButton from "@/components/DownloadPdfButton";
// IMPORTĂM FORMULARUL DE RECENZII
import ReviewForm from "@/components/ReviewForm";

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
          <div className="grid grid-cols-1 gap-8">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col transition-shadow duration-200"
              >
                {/* Antet Card */}
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

                {/* RAPORTUL DETALIAT (Apare doar dacă e finalizată) */}
                {insp.status === "COMPLETED" && (
                  <div className="mt-2 bg-gray-50 rounded-xl border border-gray-200 p-6">
                    {/* Antet Raport + Buton PDF */}
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        📋 Raport Inspecție
                      </h4>
                      <DownloadPdfButton inspection={insp} />
                    </div>

                    {/* 1. Textul Raportului */}
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

                    {/* 2. Galeria Foto */}
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

                    {/* 3. Media Audio/Video și Fisiere */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                            Browserul tău nu suportă acest format.{" "}
                            <a
                              href={insp.engineMediaUrl}
                              className="text-blue-600 underline"
                            >
                              Descarcă aici
                            </a>
                            .
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
                            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium hover:bg-yellow-200 transition-colors w-full"
                          >
                            📄 Deschide Fișierul
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
                            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition-colors w-full"
                          >
                            🧊 Descarcă Modelul
                          </a>
                        </div>
                      )}
                    </div>

                    {/* --- FORMULARUL DE RECENZII --- */}
                    {insp.mechanicId && (
                      <ReviewForm
                        inspectionId={insp.id}
                        mechanicId={insp.mechanicId}
                        hasReviewed={false}
                      />
                    )}
                    {/* ---------------------------- */}
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
