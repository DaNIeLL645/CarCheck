"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAcceptedInspections } from "@/actions/inspections";

export default function MechanicAcceptedInspections() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSessionAndData() {
      const session = await getSession();

      if (!session || (session.user as any)?.role !== "MECHANIC") {
        router.push("/");
        return;
      }

      const mechanicId = (session.user as any).id;
      const data = await getAcceptedInspections(mechanicId);
      setInspections(data);
      setLoading(false);
    }
    fetchSessionAndData();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500 animate-pulse">
          Se încarcă inspecțiile preluate...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b border-gray-200 pb-4">
          📋 Inspecții Preluate
        </h1>

        {inspections.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">
              Nu ai preluat nicio inspecție momentan.
            </h3>
            <p className="text-gray-500 mt-2">
              Mergi la panoul de cereri noi pentru a prelua mașini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 mb-4 inline-block">
                    ÎN LUCRU
                  </span>
                  <h3 className="text-xl font-bold mb-2">
                    {insp.carMake || "Mașină necunoscută"} {insp.carModel}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {insp.location}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    👤 Client: {insp.client?.fullName}
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/mechanic-accepted/${insp.id}`}
                    className="flex-1 text-center py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Completează Constatări
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
