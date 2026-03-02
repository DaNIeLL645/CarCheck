"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { getUserCredits } from "@/actions/user";
import { createInspection } from "@/actions/inspections";
import Link from "next/link";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>("");

  const [formData, setFormData] = useState({
    carUrl: "",
    carMake: "",
    carModel: "",
    location: "",
  });

  useEffect(() => {
    async function fetchUser() {
      const session = await getSession();
      if (!session) {
        router.push("/login");
      } else {
        const id = (session.user as any).id;
        setUserId(id);
        const userCredits = await getUserCredits(id);
        setCredits(userCredits);
      }
    }
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credits === null || credits < 1) return;

    setLoading(true);

    // Chemăm Server Action-ul direct (în loc de un API)
    const result = await createInspection({ ...formData, clientId: userId });

    if (result.error) {
      alert(result.error);
      setLoading(false);
    } else {
      router.push("/my-inspections"); // Îl trimitem la panou după succes
    }
  };

  // 1. Cât timp se încarcă numărul de credite
  if (credits === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse font-medium text-lg">
          Verificăm contul tău...
        </p>
      </div>
    );
  }

  // 2. Dacă NU are credite (Blocăm formularul)
  if (credits === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <span className="text-6xl mb-6 block">🎟️</span>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Nu ai verificări disponibile
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Pentru a putea adăuga o mașină nouă, trebuie să achiziționezi un
            pachet de credite din panoul tău de control.
          </p>
          <Link
            href="/my-inspections"
            className="block w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Alege un Pachet
          </Link>
        </div>
      </div>
    );
  }

  // 3. Dacă ARE credite (Afișăm formularul)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Adaugă Mașină
          </h1>
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100 flex items-center gap-2">
            🎟️ {credits} {credits === 1 ? "Credit Rămas" : "Credite Rămase"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Link-ul Anunțului (ex: Autovit, OLX)
            </label>
            <input
              type="url"
              required
              placeholder="https://"
              className="w-full p-4 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
              onChange={(e) =>
                setFormData({ ...formData, carUrl: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Marca (Opțional)
              </label>
              <input
                type="text"
                placeholder="BMW"
                className="w-full p-4 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                onChange={(e) =>
                  setFormData({ ...formData, carMake: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Model (Opțional)
              </label>
              <input
                type="text"
                placeholder="Seria 3"
                className="w-full p-4 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                onChange={(e) =>
                  setFormData({ ...formData, carModel: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Orașul (Locația Mașinii)
            </label>
            <input
              type="text"
              required
              placeholder="Ex: București, Sector 2"
              className="w-full p-4 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 disabled:opacity-50 mt-4"
          >
            {loading
              ? "Se trimite la experți..."
              : "Consumă 1 Credit și Trimite"}
          </button>
        </form>
      </div>
    </div>
  );
}
