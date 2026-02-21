"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { completeInspectionReport } from "@/actions/inspections";

export default function CompleteReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [reportData, setReportData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await completeInspectionReport(id, reportData);

    if (result.success) {
      toast.success("Raport salvat cu succes!");
      router.push("/mechanic-dashboard");
    } else {
      toast.error("Eroare la salvare.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">
        📝 Scrie Raportul de Inspecție
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-4 border rounded-lg h-64 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
          placeholder="Ex: Motorul funcționează corect, dar am observat scurgeri de ulei la garnitura capac culbutori..."
          value={reportData}
          onChange={(e) => setReportData(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Se salvează..." : "Finalizează și Trimite Raportul"}
        </button>
      </form>
    </div>
  );
}
