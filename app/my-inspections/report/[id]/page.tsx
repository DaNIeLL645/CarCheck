"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma"; // Atenție: Va trebui să facem un Server Action pentru a lua un singur raport sigur

// Adaugă această funcție în actions/inspections.ts dacă nu o ai
// export async function getInspectionById(id: string) {
//   return await prisma.inspection.findUnique({ where: { id }, include: { mechanic: true } });
// }

import { getInspectionById } from "@/actions/inspections";

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
            {inspection.report ||
              "Nu există observații scrise pentru acest raport."}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.print()}
              className="text-sm text-blue-600 hover:underline"
            >
              Descarcă sau printează raportul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
