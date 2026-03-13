"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Bun venit în Panoul de Control
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card pentru adăugare mecanic */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <span className="text-4xl mb-4 block">👨‍🔧</span>
          <h2 className="text-xl font-bold mb-2">Echipa Ta</h2>
          <p className="text-gray-500 text-sm mb-6">
            Gestionează mecanicii și creează conturi noi pentru angajați.
          </p>
          <Link
            href="/admin/add-mechanic"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Adaugă un Mecanic
          </Link>
        </div>

        {/* Loc pentru funcționalități viitoare */}
        <div className="bg-gray-100 p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center text-center opacity-70">
          <span className="text-4xl mb-4 block">💰</span>
          <h2 className="text-xl font-bold mb-2">Statistici Financiare</h2>
          <p className="text-gray-500 text-sm mb-6">
            Vezi încasările din Stripe (În curând).
          </p>
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 font-bold py-2 rounded-lg cursor-not-allowed"
          >
            Blocat
          </button>
        </div>
      </div>
    </div>
  );
}
