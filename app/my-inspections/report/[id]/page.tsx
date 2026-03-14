"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getInspectionById } from "@/actions/inspections";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import Chat from "@/components/Chat";

export default function ViewReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getInspectionById(id);
      setInspection(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading)
    return (
      <p className="text-center p-10 text-gray-500">Se încarcă datele...</p>
    );
  if (!inspection)
    return (
      <p className="text-center p-10 text-gray-500">
        Inspecția nu a fost găsită.
      </p>
    );

  // Verificăm dacă raportul este gata
  const isCompleted = inspection.status === "COMPLETED";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* 1. AFIȘĂM RAPORTUL DOAR DACĂ E GATA */}
      {isCompleted ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Raportul tău</h1>
            <DownloadPdfButton inspection={inspection} />
          </div>

          <div className="bg-white border rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-blue-600 p-6 text-white text-center">
              <h1 className="text-2xl font-bold">Raport Inspecție Auto</h1>
              <p className="opacity-80">
                {inspection.carMake} {inspection.carModel}
              </p>
            </div>

            <div className="p-8">
              <div className="mb-8 flex justify-between border-b pb-4 text-sm text-gray-600">
                <span>
                  📅 Data:{" "}
                  {new Date(inspection.createdAt).toLocaleDateString("ro-RO")}
                </span>
                <span>
                  👨‍🔧 Mecanic: {inspection.mechanic?.fullName || "Nespecificat"}
                </span>
              </div>

              <h2 className="text-lg font-bold mb-4 text-gray-800 uppercase tracking-wider">
                Constatări Mecanic:
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 whitespace-pre-wrap text-gray-700 leading-relaxed">
                {inspection.reportDetails ||
                  inspection.report ||
                  "Nu există observații scrise pentru acest raport."}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 2. DACĂ NU E GATA (E doar PENDING sau ACCEPTED), AFIȘĂM UN MESAJ DRĂGUȚ */
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-blue-800 mb-2">
            👨‍🔧 {inspection.mechanic?.fullName || "Mecanicul"} lucrează la mașina
            ta!
          </h2>
          <p className="text-blue-600">
            Raportul complet va apărea aici după finalizarea inspecției. Până
            atunci, poți discuta detalii direct pe chat.
          </p>
        </div>
      )}

      {/* 3. CHAT-UL ESTE AFIȘAT MEREU JOS (și în timpul lucrului, și după) */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        💬 Discuție cu Mecanicul
      </h2>
      <Chat inspectionId={inspection.id} currentUserId={inspection.clientId} />
    </div>
  );
}
