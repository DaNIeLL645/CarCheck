"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// Am sters importurile nefolosite (getSession, useRouter, prisma)

import { getInspectionById } from "@/actions/inspections";
// IMPORTĂM BUTONUL NOU DE PDF AICI:
import DownloadPdfButton from "@/components/DownloadPdfButton";

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
    return <p className="text-center p-10">Se încarcă raportul...</p>;
  if (!inspection)
    return <p className="text-center p-10">Raportul nu a fost găsit.</p>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* --- PARTEA NOUĂ: ANTETUL CU BUTONUL DE DESCĂRCARE PDF --- */}
      <div className="flex justify-between items-center mb-6 border-4 border-red-500 p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Raportul tău - TEST
        </h1>
        <button className="bg-red-500 text-white p-2">BUTON FALS</button>
        <DownloadPdfButton inspection={inspection} />
      </div>
      {/* --------------------------------------------------------- */}

      <div className="bg-white border rounded-2xl shadow-lg overflow-hidden">
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
            {/* Am pus și inspection.reportDetails și inspection.report în caz că ai folosit oricare din ele */}
            {inspection.reportDetails ||
              inspection.report ||
              "Nu există observații scrise pentru acest raport."}
          </div>
        </div>
      </div>
    </div>
  );
}
