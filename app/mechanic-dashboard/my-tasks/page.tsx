"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getMechanicAcceptedInspections } from "@/actions/inspections";
import { cancelAndRefundInspection } from "@/actions/inspections"; // <-- Importăm noua funcție
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MechanicTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSessionAndTasks();
  }, [router]);

  async function fetchSessionAndTasks() {
    const session = await getSession();

    if (!session || (session.user as any).role !== "MECHANIC") {
      router.push("/");
      return;
    }

    const mechanicId = (session.user as any).id;
    const data = await getMechanicAcceptedInspections(mechanicId);
    setTasks(data);
    setLoading(false);
  }

  // Funcția care se apelează când mecanicul apasă pe butonul de anulare
  const handleCancelTask = async (inspectionId: string) => {
    const confirmCancel = window.confirm(
      "Ești sigur că vrei să anulezi? Clientul își va primi creditul înapoi, iar comanda va dispărea din lista ta.",
    );

    if (!confirmCancel) return;

    const toastId = toast.loading("Se anulează comanda...");
    const res = await cancelAndRefundInspection(inspectionId);

    if (res.success) {
      toast.success(res.success, { id: toastId });
      // Reîncărcăm lista de mașini (comanda anulată va dispărea)
      fetchSessionAndTasks();
    } else {
      toast.error(res.error || "A apărut o eroare.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-medium text-gray-500 animate-pulse">
          Se încarcă mașinile tale...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            🛠️ Mașini preluate (În lucru)
          </h1>
          <Link
            href="/mechanic-dashboard"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Înapoi la cereri noi
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <span className="text-4xl mb-4 block">✅</span>
            <h3 className="text-lg font-medium text-gray-900">
              Nu ai nicio mașină în lucru
            </h3>
            <p className="text-gray-500 mt-2">
              Toate rapoartele au fost trimise sau nu ai preluat încă cereri
              noi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 flex flex-col md:flex-row gap-6"
              >
                {/* Detalii Mașină */}
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block">
                    ÎN AȘTEPTARE RAPORT
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {task.carMake || "Mașină necunoscută"} {task.carModel}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    📍 {task.location}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    👤 Client: <strong>{task.client?.fullName}</strong>
                  </p>
                  <a
                    href={task.carUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline font-medium"
                  >
                    🔗 Deschide anunțul original
                  </a>

                  {/* Butonul de Anulare */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => handleCancelTask(task.id)}
                      className="text-red-600 text-sm font-bold hover:text-red-800 transition-colors flex items-center gap-2"
                    >
                      ❌ Anunț Inactiv / Mașină Vândută
                    </button>
                    <p className="text-xs text-gray-400 mt-1 leading-tight">
                      Apasă aici dacă vânzătorul nu mai răspunde sau mașina s-a
                      dat. Creditul se va returna clientului.
                    </p>
                  </div>
                </div>

                {/* Buton către pagina de raport complex */}
                <div className="md:w-2/3 flex flex-col justify-center items-center bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6">
                  <span className="text-4xl mb-3 block">📋</span>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    Raport de Inspecție Auto
                  </h4>
                  <p className="text-sm text-gray-500 text-center mb-6">
                    Apasă aici pentru a deschide formularul detaliat unde poți
                    încărca poze, video cu motorul, testerul și modelul 3D.
                  </p>

                  <Link
                    href={`/mechanic-dashboard/report/${task.id}`}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Deschide Formularul de Raport →
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
